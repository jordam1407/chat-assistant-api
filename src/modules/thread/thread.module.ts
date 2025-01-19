import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AgentModule } from '@src/modules/agent/agent.module'
import { KnowledgeBaseModule } from '@src/modules/knowledge-base/knowledge-base.module'
import { OpenAiModule } from '@src/modules/openai/openai.module'
import { OrgModule } from '@src/modules/organization/org.module'
import { QueryClassificationModule } from '@src/modules/queryClassification/queryClassification.module'
import { ThreadController } from '@src/modules/thread/controller/thread.controller'
import { ThreadRepository } from '@src/modules/thread/data/thread.repository'
import { Thread, ThreadSchema } from '@src/modules/thread/data/thread.schema'
import { ThreadService } from '@src/modules/thread/service/thread.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]),
		OpenAiModule,
		OrgModule,
		KnowledgeBaseModule,
		AgentModule,
		QueryClassificationModule,
	],
	controllers: [ThreadController],
	providers: [ThreadService, ThreadRepository],

	exports: [ThreadService, ThreadRepository],
})
export class ThreadModule {}
