import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Agent } from '@src/modules/agent/data/agent.schema'
import { ICreateAgent } from '@src/modules/agent/service/agent.interface'
import { Model } from 'mongoose'

@Injectable()
export class AgentRepository {
	constructor(@InjectModel(Agent.name) private readonly agentModel: Model<Agent>) {}
	async createAgent({ name, tone, objective, systemPrompt, organizationId }: ICreateAgent): Promise<string> {
		const agent = await this.agentModel.create({ name, tone, objective, systemPrompt, organizationId })

		return agent.agentId
	}

	async getAgentById(agentId: string): Promise<Agent> {
		const agent = (await (await this.agentModel.findOne({ agentId })).populate('Objective')).populate('Tone')
		return agent
	}

	async listAgentsByOrgId(orgId: string): Promise<Agent[]> {
		const agents = await this.agentModel.find({ $where: orgId }).exec()
		return agents
	}

	async deleteAgent(agentId: string): Promise<void> {
		const agent = await this.getAgentById(agentId)
		if (!agent) {
			throw new Error('Agent not found')
		}
		await this.agentModel.deleteOne({ agentId }).exec()
	}
}
