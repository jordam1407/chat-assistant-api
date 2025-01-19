import { Injectable, NotFoundException } from '@nestjs/common'
import { InstructionRepository } from '@src/modules/instructions/data/instructions.repository'
import { Instruction } from '@src/modules/instructions/data/instructions.schema'

@Injectable()
export class InstructionService {
	constructor(private readonly instructionRepository: InstructionRepository) {}

	async createInstruction(data: Partial<Instruction>): Promise<Instruction> {
		return this.instructionRepository.create(data)
	}

	async getInstructions(): Promise<Instruction[]> {
		return this.instructionRepository.findAll()
	}

	async getInstructionById(id: string): Promise<Instruction> {
		const instruction = await this.instructionRepository.findById(id)
		if (!instruction) {
			throw new NotFoundException(`Instruction with ID ${id} not found`)
		}
		return instruction
	}

	async updateInstruction(id: string, updateData: Partial<Instruction>): Promise<Instruction> {
		const updatedInstruction = await this.instructionRepository.update(id, updateData)
		if (!updatedInstruction) {
			throw new NotFoundException(`Instruction with ID ${id} not found`)
		}
		return updatedInstruction
	}

	async deleteInstruction(id: string): Promise<void> {
		const result = await this.instructionRepository.delete(id)
		if (!result) {
			throw new NotFoundException(`Instruction with ID ${id} not found`)
		}
	}
}
