import { plainToInstance } from 'class-transformer'
import { IsDefined, IsString, validateSync } from 'class-validator'

class EnvironmentVariables {
	@IsDefined()
	@IsString()
	OPENAI_API_KEY: string

	@IsDefined()
	@IsString()
	OPENAI_ASSISTANT_MODEL: string
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
