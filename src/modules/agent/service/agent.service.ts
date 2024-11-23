import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AgentRepository } from '@src/modules/agent/data/agent.repository'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { IAgentById, IAgentService, IAgentsList } from '@src/modules/agent/service/agent.interface'
import { OpenAiService } from '@src/modules/openai/service/openai.service'

@Injectable()
export class AgentService implements IAgentService {
	constructor(
		private readonly agentModel: AgentRepository,
		private readonly openAiAdapter: OpenAiService,
		private readonly eventEmitter: EventEmitter2
	) {}

	async listAgentsByOrgId(orgId: string): Promise<IAgentsList> {
		const agents = await this.agentModel.listAgentsByOrgId(orgId)
		return { agents }
	}

	async getAgentById(agentId: string): Promise<IAgentById> {
		const agent = await this.agentModel.getAgentById(agentId)
		return { agent }
	}

	async createAgent({
		name,
		tone,
		objective,
		systemPrompt,
		organizationId,
	}: IAgentRequestDto): Promise<IAgentResponseDto> {
		const agentId = await this.agentModel.createAgent({ name, tone, objective, systemPrompt, organizationId })

		return { agentId }
	}
}
