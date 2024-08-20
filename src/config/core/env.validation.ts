import { plainToInstance } from 'class-transformer'
import { IsDefined, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
	@IsDefined()
	@IsString()
	OPENAI_API_KEY: string

	@IsDefined()
	@IsString()
	OPENAI_ASSISTANT_MODEL: string

	@IsDefined()
	@IsString()
	MONGODB_CONNECTION_URI: string

	@IsDefined()
	@IsString()
	JWT_ACCESS_SECRET: string

	@IsDefined()
	@IsString()
	JWT_ACCESS_TTL: string

	@IsDefined()
	@IsString()
	JWT_REFRESH_SECRET: string

	@IsDefined()
	@IsString()
	JWT_REFRESH_TTL_DAYS: string
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	})
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	})

	if (errors.length > 0) {
		throw new Error(errors.toString())
	}
	return validatedConfig
}
