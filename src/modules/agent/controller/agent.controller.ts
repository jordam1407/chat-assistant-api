import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { IAgentById, IAgentsList } from '@src/modules/agent/service/agent.interface'
import { AgentService } from '@src/modules/agent/service/agent.service'

@Controller('agent')
export class AgentController {
	constructor(@Inject(AgentService) private readonly agentService: AgentService) {}

	@Post()
	async createAgent(
		@Body() { name, tone, objective, systemPrompt, organizationId }: IAgentRequestDto
	): Promise<IAgentResponseDto> {
		return this.agentService.createAgent({ name, tone, objective, systemPrompt, organizationId })
	}

	@Get()
	async getAgentById(@Param('agentId') agentId: string): Promise<IAgentById> {
		return this.agentService.getAgentById(agentId)
	}

	@Get()
	async listAgentsByOrgId(@Param('orgId') orgId: string): Promise<IAgentsList> {
		return this.agentService.listAgentsByOrgId(orgId)
	}
}
