import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthUserRepository } from '@src/modules/auth/data/auth-user.repository'
import { SignUpReqDTO } from '@src/modules/auth/dto/auth.request.dto'
import { AuthUserResponseDTO } from '@src/modules/auth/dto/auth.response.dto'
import * as bcrypt from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		private authRepo: AuthUserRepository,
		private jwtService: JwtService,
		private env: ConfigService
	) {}

	async signUp({ email, name, password, phone }: SignUpReqDTO) {
		const user = await this.authRepo.findByEmail(email)
		if (user) {
			throw new UnauthorizedException('User already exists')
		}

		const hashedPassword = await this.generateHash(password)

		const newUser = await this.authRepo.create({
			email,
			password: hashedPassword,
			name,
			phone,
		})

		const userId = newUser._id.toString()

		const { accessToken, refreshToken } = await this.generateTokens({
			email,
			name,
			userId,
		})

		await this.updateRefreshToken(userId, refreshToken)

		const data = new AuthUserResponseDTO({
			access_token: accessToken,
			user: {
				email,
				name,
				phone,
				refreshToken,
				openAIApiKey: newUser.openAIApiKey,
				assistant: newUser.assistant,
			},
		})

		return data
	}

	async signIn(email: string, pass: string): Promise<AuthUserResponseDTO> {
		return
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
		})

		await this.updateRefreshToken(userId, refreshToken)

		const data = new AuthUserResponseDTO({
			access_token: accessToken,
			user: {
				email: user.email,
				name: user.name,
				phone: user.phone,
				refreshToken,
				openAIApiKey: user.openAIApiKey,
				assistant: user.assistant,
			},
		})

		return data
	}

	private async updateRefreshToken(userId: string, refreshToken: string) {
		const hashedRefreshToken = await this.generateHash(refreshToken)
		return this.authRepo.updateToken(userId, hashedRefreshToken)
	}

	private async generateTokens({ email, name, userId }: { userId: string; name: string; email: string }) {
		const tokenPayload = {
			name,
			email,
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
}
