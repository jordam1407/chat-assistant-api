import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Instruction } from '@src/modules/instructions/data/instructions.schema'
import { Model } from 'mongoose'

@Injectable()
export class InstructionRepository {
	constructor(@InjectModel(Instruction.name) private readonly instructionModel: Model<Instruction>) {}

	async create(instruction: Partial<Instruction>): Promise<Instruction> {
		const newInstruction = new this.instructionModel(instruction)
		return newInstruction.save()
	}

	async findAll(): Promise<Instruction[]> {
		return this.instructionModel.find().exec()
	}

	async findById(id: string): Promise<Instruction | null> {
		return this.instructionModel.findById(id).exec()
	}

	async update(id: string, updateData: Partial<Instruction>): Promise<Instruction | null> {
		return this.instructionModel.findByIdAndUpdate(id, updateData, { new: true }).exec()
	}

	async delete(id: string): Promise<Instruction | null> {
		return this.instructionModel.findByIdAndDelete(id).exec()
	}
}
