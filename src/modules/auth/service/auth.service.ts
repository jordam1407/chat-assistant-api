import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { JwtService } from '@nestjs/jwt'
import { BASE_CREDITS } from '@src/core/constants/base-credits'
import { AuthUserRepository } from '@src/modules/auth/data/auth-user.repository'
import { createUserForOrgDto, SignUpReqDTO } from '@src/modules/auth/dto/auth.request.dto'
import { AuthUserResponseDTO } from '@src/modules/auth/dto/auth.response.dto'
import { ERoles } from '@src/modules/auth/types/auth.types'
import { CreateOrgEvent } from '@src/modules/organization/events/create-org.event'
import * as bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
@Injectable()
export class AuthService {
	constructor(
		private authRepo: AuthUserRepository,
		private jwtService: JwtService,
		private env: ConfigService,
		private readonly eventEmitter: EventEmitter2
	) {}

	async signUp({ email, name, password, phone, credits = BASE_CREDITS, orgName }: SignUpReqDTO) {
		const user = await this.authRepo.findByEmail(email)
		if (user) {
			throw new ConflictException('User already exists')
		}

		const hashedPassword = await this.generateHash(password)
		const organizationId = uuidv4()

		const newUser = await this.authRepo.create({
			email,
			password: hashedPassword,
			name,
			phone,
			organizationId,
			role: ERoles.owner,
		})

		this.eventEmitter.emit(
			'create.org',
			new CreateOrgEvent({
				orgId: newUser.organizationId,
				subscriptionActive: true,
				credits,
				orgName,
				support: newUser.phone,
			})
		)

		const userId = newUser._id.toString()

		const { accessToken, refreshToken } = await this.generateTokens({
			email,
			name,
			userId,
			orgId: organizationId,
		})

		await this.updateRefreshToken(userId, refreshToken)

		const data = new AuthUserResponseDTO({
			access_token: accessToken,
			user: {
				email,
				name,
				phone,
				refreshToken,
				organizationId: newUser.organizationId,
				role: newUser.role,
			},
		})

		return data
	}

	async createForOrg({ email, name, password, orgId }: createUserForOrgDto & { orgId: string }) {
		const user = await this.authRepo.findByEmail(email)
		if (user) {
			throw new ConflictException('User already exists')
		}

		const hashedPassword = await this.generateHash(password)

		await this.authRepo.create({
			email,
			password: hashedPassword,
			name,
			organizationId: orgId,
			role: ERoles.user,
		})

		return
	}

	async listByOrgId(id: string, userId: string) {
		return (await this.authRepo.listByOrg(id)).filter((item) => item.id !== userId)
	}

	async signIn(email: string, pass: string): Promise<AuthUserResponseDTO> {
		const user = await this.authRepo.findByEmail(email)
		if (!user) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const passwordMatch = await bcrypt.compare(pass, user.password as string)
		if (!passwordMatch) {
			throw new UnauthorizedException('Invalid credentials')
		}
		const userId = user._id.toString()

		const { accessToken, refreshToken } = await this.generateTokens({
			email: user.email,
			name: user.name,
			userId: user._id.toString(),
			orgId: user.organizationId,
		})

		await this.updateRefreshToken(userId, refreshToken)

		const data = new AuthUserResponseDTO({
			access_token: accessToken,
			user: {
				email: user.email,
				name: user.name,
				phone: user.phone,
				refreshToken,
				organizationId: user.organizationId,
				role: user.role,
			},
		})

		return data
	}

	async refresh(token: string): Promise<AuthUserResponseDTO> {
		const { email } = await this.decodeToken(token)

		const user = await this.authRepo.findByEmail(email)
		if (!user) {
			throw new UnauthorizedException('User already exists')
		}

		const refreshTokenMatches = await bcrypt.compare(token, user.refreshToken)

		if (!refreshTokenMatches) {
			throw new UnauthorizedException('Accesso denied')
		}

		const userId = user._id.toString()

		const { accessToken, refreshToken } = await this.generateTokens({
			email: user.email,
			name: user.name,
			userId: user._id.toString(),
			orgId: user.organizationId,
		})

		await this.updateRefreshToken(userId, refreshToken)

		const data = new AuthUserResponseDTO({
			access_token: accessToken,
			user: {
				email: user.email,
				name: user.name,
				phone: user.phone,
				refreshToken,
				organizationId: user.organizationId,
				role: user.role,
			},
		})

		return data
	}

	async updateUser({
		name,
		newPassword,
		password,
		userId,
	}: {
		userId: string
		name?: string
		password?: string
		newPassword?: string
	}) {
		const user = await this.authRepo.findById(userId)

		if (!user) {
			throw new UnauthorizedException('Invalid credentials')
		}

		if (password || newPassword) {
			if (!password || !newPassword) {
				throw new BadRequestException('Both current password and new password must be provided')
			}

			const passwordMatch = password === user.password
			if (!passwordMatch) {
				throw new UnauthorizedException('Invalid credentials')
			}
		}

		const updatedFields: Partial<{ name: string; password: string }> = {}

		if (name && name.trim()) {
			updatedFields.name = name.trim()
		}

		if (newPassword && newPassword.trim()) {
			updatedFields.password = await this.generateHash(newPassword)
		}

		if (Object.keys(updatedFields).length === 0) {
			throw new BadRequestException('No valid fields to update')
		}

		return await this.authRepo.updateById(userId, updatedFields)
	}

	private async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.generateHash(refreshToken)
		return this.authRepo.updateToken(userId, hashedRefreshToken)
	}

	private async generateTokens({
		email,
		name,
		userId,
		orgId,
	}: {
		userId: string
		name: string
		email: string
		orgId: string
	}) {
		const tokenPayload = {
			name,
			email,
			orgId,
		}
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(tokenPayload, {
				subject: userId,
				secret: this.env.get('jwtAcessSecret'),
				expiresIn: this.env.get('jwtAcessTtl'),
			}),
			this.jwtService.signAsync(tokenPayload, {
				subject: userId,
				secret: this.env.get('jwtRefreshSecret'),
				expiresIn: `${this.env.get('jwtRefreshTtlDays')}d`,
			}),
		])

		return {
			accessToken,
			refreshToken,
		}
	}

	private generateHash(data: string): Promise<string> {
		return bcrypt.hash(data, 10)
	}

	private async decodeToken(token: string): Promise<{ email: string; name: string }> {
		return await this.jwtService.verifyAsync(token, {
			secret: this.env.get('jwtRefreshSecret'),
		})
	}
}
