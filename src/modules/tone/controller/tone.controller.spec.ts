import { Test, TestingModule } from '@nestjs/testing'
import { ToneService } from '@src/modules/tone/service/tone.service'
import { ToneController } from './tone.controller'

describe('AppController', () => {
	let toneController: ToneController

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [ToneController],
			providers: [ToneService],
		}).compile()

		toneController = app.get<ToneController>(ToneController)
	})

	describe('root', () => {
		it('should return "Hello World!"', () => {
			expect(toneController.create({ key: 'string', name: 'String', value: 'string' })).toBe('Hello World!')
		})
	})
})
