import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ThrottlerConfigModule } from '@src/config/security/throttler.module'
import { AssistantsModule } from '@src/modules/assistants/assistant.module'

const API_MODULES = [AssistantsModule]

const APIs = ['user']

@Module({
	imports: [ThrottlerConfigModule, ...API_MODULES],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes(...APIs.map((path) => ({ path, method: RequestMethod.GET })))
	}
}
