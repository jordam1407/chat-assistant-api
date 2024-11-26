import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Tone, ToneDocument } from '@src/modules/tone/data/tone.schema'
import { Model } from 'mongoose'

@Injectable()
export class ToneRepository {
	constructor(@InjectModel(Tone.name) private readonly toneModel: Model<ToneDocument>) {}

	async create(data: { key: string; name: string }): Promise<Tone> {
		const tone = new this.toneModel(data)
		return tone.save()
	}

	async findAll(): Promise<Tone[]> {
		return this.toneModel.find().exec()
	}

	async findByKey(key: string): Promise<Tone | null> {
		return this.toneModel.findOne({ key }).exec()
	}

	async findById(id: string): Promise<Tone | null> {
		return this.toneModel.findById(id).exec()
	}

	async update(id: string, updates: Partial<Tone>): Promise<Tone | null> {
		return this.toneModel.findByIdAndUpdate(id, updates, { new: true }).exec()
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.toneModel.findByIdAndDelete(id).exec()
		return result !== null
	}
}
