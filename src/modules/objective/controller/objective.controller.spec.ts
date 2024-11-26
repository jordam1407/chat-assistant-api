import { Test, TestingModule } from '@nestjs/testing'
import { ObjectiveService } from '@src/modules/objective/service/objective.service'
import { ObjectiveController } from './objective.controller'

describe('AppController', () => {
	let objectiveController: ObjectiveController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [ObjectiveController],
			providers: [ObjectiveService],
		}).compile()

		objectiveController = app.get<ObjectiveController>(ObjectiveController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(objectiveController.create({ key: 'string', name: 'String' })).toBe('Hello World!')
		})
	})
})
