import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common'
import { ApiKey } from '@src/core/decorators/api-key-decorator'
import { Agent } from '@src/modules/agent/data/agent.schema'
import { IAgentRequestDto } from '@src/modules/agent/dto/agent.request.dto'
import { IAgentResponseDto } from '@src/modules/agent/dto/agent.response.dto'
import { IAgentsList } from '@src/modules/agent/service/agent.interface'
import { AgentService } from '@src/modules/agent/service/agent.service'

@ApiKey()
@Controller('agent')
export class AgentController {
	constructor(@Inject(AgentService) private readonly agentService: AgentService) {}

	@Post()
	async createAgent(
		@Body() { name, toneId, objectiveId, systemPrompt, orgId }: IAgentRequestDto
	): Promise<IAgentResponseDto> {
		return this.agentService.createAgent({ name, toneId, objectiveId, systemPrompt, orgId })
	}

	@Get('/:agentId')
	async getAgentById(@Param('agentId') agentId: string): Promise<Agent> {
		return this.agentService.getAgentById(agentId)
	}

	@Get('/organization/:orgId')
	async listAgentsByOrgId(@Param('orgId') orgId: string): Promise<IAgentsList> {
		return this.agentService.listAgentsByOrgId(orgId)
	}
}
