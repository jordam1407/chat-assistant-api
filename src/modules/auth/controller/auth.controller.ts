import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { Public } from '../decorators/auth.decorator'
import { AuthService } from '../service/auth.service'
import { LoginDto, SignUpReqDTO } from '../dto/auth.request.dto'
import { AuthUserResponseDTO } from '../dto/auth.response.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('sign-up')
	signUp(@Body() signInDto: SignUpReqDTO): Promise<AuthUserResponseDTO> {
		return this.authService.signUp(signInDto)
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
