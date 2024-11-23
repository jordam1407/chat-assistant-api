import { Test, TestingModule } from '@nestjs/testing'
import { AgentService } from '../service/agent.service'
import { AgentController } from './agent.controller'

describe('AppController', () => {
	let agentController: AgentController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AgentController],
			providers: [AgentService],
		}).compile()

		agentController = app.get<AgentController>(AgentController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(agentController.createAgent).toBe('Hello World!')
		})
	})
})
