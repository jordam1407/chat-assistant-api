import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AgentController } from '@src/modules/agent/controller/agent.controller'
import { AgentRepository } from '@src/modules/agent/data/agent.repository'
import { Agent, AgentSchema } from '@src/modules/agent/data/agent.schema'
import { AgentService } from '@src/modules/agent/service/agent.service'
import { OpenAiModule } from '@src/modules/openai/openai.module'

@Module({
	imports: [MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]), OpenAiModule],
	controllers: [AgentController],
	providers: [AgentService, AgentRepository],

	exports: [AgentService, AgentRepository],
})
export class AgentModule {}
