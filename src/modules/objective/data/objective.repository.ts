import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Objective, ObjectiveDocument } from '@src/modules/objective/data/objective.schema'
import { Model } from 'mongoose'

@Injectable()
export class ObjectiveRepository {
	constructor(@InjectModel(Objective.name) private readonly objectiveModel: Model<ObjectiveDocument>) {}

	async create(data: { key: string; name: string }): Promise<Objective> {
		const objective = new this.objectiveModel(data)
		return objective.save()
	}

	async findAll(): Promise<Objective[]> {
		return this.objectiveModel.find().exec()
	}

	async findByKey(key: string): Promise<Objective | null> {
		return this.objectiveModel.findOne({ key }).exec()
	}

	async findById(id: string): Promise<Objective | null> {
		return this.objectiveModel.findById(id).exec()
	}

	async update(id: string, updates: Partial<Objective>): Promise<Objective | null> {
		return this.objectiveModel.findByIdAndUpdate(id, updates, { new: true }).exec()
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.objectiveModel.findByIdAndDelete(id).exec()
		return result !== null
	}
}
