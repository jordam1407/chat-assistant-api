import { Agent } from '@src/modules/agent/data/agent.schema'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { Objective } from '@src/modules/objective/data/objective.schema'
import { Tone } from '@src/modules/tone/data/tone.schema'

export interface IAgentService {
	createAgent({ name, toneId, objectiveId, systemPrompt }: IAgentRequestDto): Promise<IAgentResponseDto>
	getAgentById(agentId: string): Promise<Agent>
	listAgentsByOrgId(orgId: string): Promise<IAgentsList>
}

export interface ICreateAgent {
	name: string
	tone: Tone
	objective: Objective
	systemPrompt?: string
	orgId: string
}

export interface IAgentsList {
	agents: Agent[]
}
