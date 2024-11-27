import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AgentController } from '@src/modules/agent/controller/agent.controller'
import { AgentRepository } from '@src/modules/agent/data/agent.repository'
import { Agent, AgentSchema } from '@src/modules/agent/data/agent.schema'
import { AgentService } from '@src/modules/agent/service/agent.service'
import { Objective, ObjectiveSchema } from '@src/modules/objective/data/objective.schema'
import { ObjectiveModule } from '@src/modules/objective/objective.module'
import { OpenAiModule } from '@src/modules/openai/openai.module'
import { Org, OrgSchema } from '@src/modules/organization/data/org.schema'
import { Tone, ToneSchema } from '@src/modules/tone/data/tone.schema'
import { ToneModule } from '@src/modules/tone/tone.module'

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Agent.name, schema: AgentSchema },
			{ name: Org.name, schema: OrgSchema },
			{ name: Tone.name, schema: ToneSchema },
			{ name: Objective.name, schema: ObjectiveSchema },
		]),
		OpenAiModule,
		ToneModule,
		ObjectiveModule,
	],
	controllers: [AgentController],
	providers: [AgentService, AgentRepository],

	exports: [AgentService, AgentRepository],
})
export class AgentModule {}
