import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest()
		const key = request.headers['x-api-key']

		if (!key) {
			throw new BadRequestException('API Key not provided')
		}

		const apiKey = this.configService.get('apiKey')

		if (key !== apiKey) {
			throw new UnauthorizedException('Invalid API Key')
		}

		return true
	}
}
