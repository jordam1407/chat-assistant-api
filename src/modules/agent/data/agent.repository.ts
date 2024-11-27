import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Agent } from '@src/modules/agent/data/agent.schema'
import { ICreateAgent } from '@src/modules/agent/service/agent.interface'
import { Model } from 'mongoose'

@Injectable()
export class AgentRepository {
	constructor(@InjectModel(Agent.name) private readonly agentModel: Model<Agent>) {}
	async createAgent({ name, tone, objective, systemPrompt, orgId }: ICreateAgent): Promise<string> {
		if (!systemPrompt) {
			systemPrompt = `
			You are an AI agent named "${name}", designed to assist users effectively.
			Your tone of communication should reflect the following: "${tone}".
			Your primary objective is: "${objective}".
	  
			Guidelines:
			- Always prioritize clarity and accuracy in your responses.
			- Stay consistent with the tone and objective provided.
			- Adapt your behavior to fulfill the user's requirements while respecting the constraints of your design.
	  
			Remember, your responses should be helpful, engaging, and aligned with the goals defined.
		  `.trim()
		}

		const agent = await this.agentModel.create({ name, tone, objective, systemPrompt, orgId })

		return agent.agentId
	}

	async getAgentById(agentId: string): Promise<Agent> {
		const agent = (await (await this.agentModel.findOne({ agentId })).populate('objective')).populate('tone')
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
