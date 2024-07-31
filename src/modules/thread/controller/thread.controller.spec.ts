import { Test, TestingModule } from '@nestjs/testing'
import { ThreadController } from './thread.controller'
import { ThreadService } from '../service/thread.service'

describe('AppController', () => {
	let appController: ThreadController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [ThreadController],
			providers: [ThreadService],
		}).compile()

		appController = app.get<ThreadController>(ThreadController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(appController.createMessage).toBe('Hello World!')
		})
	})
})
