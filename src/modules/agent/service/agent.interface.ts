import { Agent } from '@src/modules/agent/data/agent.schema'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { ObjectiveEnum, ToneEnum } from '@src/modules/agent/types/core.types'

export interface IAgentService {
	createAgent({ name, tone, objective, systemPrompt }: IAgentRequestDto): Promise<IAgentResponseDto>
	getAgentById(agentId: string): Promise<IAgentById>
	listAgentsByOrgId(orgId: string): Promise<IAgentsList>
}

export interface ICreateAgent {
	name: string
	tone: ToneEnum
	objective: ObjectiveEnum
	systemPrompt: string
	organizationId: string
}

export interface IAgentById {
	agent: {
		agentId: string
		name: string
		tone: ToneEnum
		objective: ObjectiveEnum
		systemPrompt: string
	}
}

export interface IAgentsList {
	agents: Agent[]
}
