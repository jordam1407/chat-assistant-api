import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AgentRepository } from '@src/modules/agent/data/agent.repository'
import { Agent } from '@src/modules/agent/data/agent.schema'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { IAgentService, IAgentsList } from '@src/modules/agent/service/agent.interface'
import { ObjectiveService } from '@src/modules/objective/service/objective.service'
import { OpenAiService } from '@src/modules/openai/service/openai.service'
import { ToneService } from '@src/modules/tone/service/tone.service'

@Injectable()
export class AgentService implements IAgentService {
	constructor(
		private readonly agentModel: AgentRepository,
		private readonly openAiAdapter: OpenAiService,
		private readonly toneService: ToneService,
		private readonly objectiveService: ObjectiveService,
		private readonly eventEmitter: EventEmitter2
	) {}

	async listAgentsByOrgId(orgId: string): Promise<IAgentsList> {
		const agents = await this.agentModel.listAgentsByOrgId(orgId)
		return { agents }
	}

	async getAgentById(agentId: string): Promise<Agent> {
		const agent = await this.agentModel.getAgentById(agentId)
		return agent
	}

	async createAgent({ name, toneId, objectiveId, systemPrompt, orgId }: IAgentRequestDto): Promise<IAgentResponseDto> {
		const tone = await this.toneService.findById(toneId)
		const objective = await this.objectiveService.findById(objectiveId)

		if (!tone) {
			throw new NotFoundException('Tone not found')
		}

		if (!objective) {
			throw new NotFoundException('Objective not found')
		}

		const agentId = await this.agentModel.createAgent({
			name,
			tone,
			objective,
			systemPrompt,
			orgId,
		})

		// this.eventEmitter.emit('agent.created', { agentId, name, organizationId })

		return { agentId }
	}
}
