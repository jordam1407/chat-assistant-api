import { ValidationPipe } from '@nestjs/common'
import { FastifyConfig } from '@src/config/fastify/fastify.config'
import { CsrfProtectionConfig } from '@src/config/security/csrf-protection.config'
import { HelmetConfig } from '@src/config/security/helmet.config'
import { AppModule } from './modules/app.module'

async function bootstrap() {
	const app = await FastifyConfig.createService(AppModule)

	app.useGlobalPipes(new ValidationPipe({ transform: true }))

	HelmetConfig.useHelmet(app)
	CsrfProtectionConfig.useCsrf(app)

	app.enableCors()

	await app.listen(3001, '0.0.0.0')
	console.info(`Chat Assistant API is running on: ${await app.getUrl()}`)
}
bootstrap()
