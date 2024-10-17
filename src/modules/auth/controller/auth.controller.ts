import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { Public } from '../decorators/auth.decorator'
import { AuthService } from '../service/auth.service'
import { createUserForOrgDto, LoginDto, SignUpReqDTO } from '../dto/auth.request.dto'
import { AuthUserResponseDTO } from '../dto/auth.response.dto'
import { GetOrgId } from '@src/core/decorators/get-org-id.decorator'
import { GetUserId } from '@src/core/decorators/get-user-id.decorator'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('sign-up')
	signUp(@Body() signInDto: SignUpReqDTO): Promise<AuthUserResponseDTO> {
		return this.authService.signUp(signInDto)
	}

	@HttpCode(HttpStatus.CREATED)
	@Post('/org/sign-up')
	createUserForOrg(@Body() { email, name, password, role }: createUserForOrgDto, @GetOrgId() orgId: string) {
		return this.authService.createForOrg({ email, name, password, role, orgId })
	}

	@HttpCode(HttpStatus.OK)
	@Get('/org/list')
	listByOrg(@GetOrgId() orgId: string, @GetUserId() userId: string) {
		return this.authService.listByOrgId(orgId, userId)
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('sign-in')
	signIn(@Body() signInDto: LoginDto): Promise<AuthUserResponseDTO> {
		return this.authService.signIn(signInDto.email, signInDto.password)
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	refresh(@Body() refreshReqDto: { refreshToken: string }): Promise<AuthUserResponseDTO> {
		return this.authService.refresh(refreshReqDto.refreshToken)
	}
}
