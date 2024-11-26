import { Injectable, NotFoundException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AgentRepository } from '@src/modules/agent/data/agent.repository'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { IAgentById, IAgentService, IAgentsList } from '@src/modules/agent/service/agent.interface'
import { ObjectiveRepository } from '@src/modules/objective/data/objective.repository'
import { OpenAiService } from '@src/modules/openai/service/openai.service'
import { ToneRepository } from '@src/modules/tone/data/tone.repository'

@Injectable()
export class AgentService implements IAgentService {
	constructor(
		private readonly agentModel: AgentRepository,
		private readonly openAiAdapter: OpenAiService,
		private readonly toneRepository: ToneRepository,
		private readonly objectiveRepository: ObjectiveRepository,
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
		toneId,
		objectiveId,
		systemPrompt,
		organizationId,
	}: IAgentRequestDto): Promise<IAgentResponseDto> {
		const tone = await this.toneRepository.findById(toneId)
		const objective = await this.objectiveRepository.findById(objectiveId)

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
			organizationId,
		})

		// this.eventEmitter.emit('agent.created', { agentId, name, organizationId })

		return { agentId }
	}
}
