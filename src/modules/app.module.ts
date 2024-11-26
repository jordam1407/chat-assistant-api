import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { validate } from '@src/config/core/env.validation'
import configuration from '@src/config/core/environment.config'
import { MongoModule } from '@src/config/database/mongo.module'
import { ThrottlerConfigModule } from '@src/config/security/throttler.module'
import { AgentModule } from '@src/modules/agent/agent.module'
import { AuthModule } from '@src/modules/auth/auth.module'
import { InstructionModule } from '@src/modules/instructions/instructions.module'
import { KnowledgeBaseModule } from '@src/modules/knowledge-base/knowledge-base.module'
import { ObjectiveModule } from '@src/modules/objective/objective.module'
import { ThreadModule } from '@src/modules/thread/thread.module'
import { ToneModule } from '@src/modules/tone/tone.module'

const API_MODULES = [
	ThreadModule,
	AuthModule,
	KnowledgeBaseModule,
	InstructionModule,
	AgentModule,
	ToneModule,
	ObjectiveModule,
]

const APIs = ['assistants']

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			validate,
		}),
		EventEmitterModule.forRoot(),
		ThrottlerConfigModule,
		MongoModule,
		...API_MODULES,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply().forRoutes(...APIs.map((path) => ({ path, method: RequestMethod.GET })))
	}
}
