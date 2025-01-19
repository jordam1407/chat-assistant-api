import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Tonality } from '@src/modules/instructions/data/tonality.schema'
import { Model } from 'mongoose'

@Injectable()
export class InstructionRepository {
	constructor(@InjectModel(Tonality.name) private readonly instructionModel: Model<Tonality>) {}

	async create(instruction: Partial<Tonality>): Promise<Tonality> {
		const newInstruction = new this.instructionModel(instruction)
		return newInstruction.save()
	}

	async findAll(): Promise<Tonality[]> {
		return this.instructionModel.find().exec()
	}

	async findById(id: string): Promise<Tonality | null> {
		return this.instructionModel.findById(id).exec()
	}

	async update(id: string, updateData: Partial<Tonality>): Promise<Tonality | null> {
		return this.instructionModel.findByIdAndUpdate(id, updateData, { new: true }).exec()
	}

	async delete(id: string): Promise<Tonality | null> {
		return this.instructionModel.findByIdAndDelete(id).exec()
	}
}
