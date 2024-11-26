import { Injectable, NotFoundException } from '@nestjs/common'
import { ToneRepository } from '@src/modules/tone/data/tone.repository'
import { IToneService } from '@src/modules/tone/service/tone.interface'

@Injectable()
export class ToneService implements IToneService {
	constructor(private readonly toneRepository: ToneRepository) {}

	async create(key: string, name: string) {
		return this.toneRepository.create({ key, name })
	}

	async findAll() {
		return this.toneRepository.findAll()
	}

	async findByKey(key: string) {
		const tone = await this.toneRepository.findByKey(key)
		if (!tone) {
			throw new NotFoundException(`Tone with key "${key}" not found`)
		}
		return tone
	}

	async findById(id: string) {
		const tone = await this.toneRepository.findById(id)
		if (!tone) {
			throw new NotFoundException(`Tone with ID "${id}" not found`)
		}
		return tone
	}

	async update(id: string, name: string) {
		const updatedTone = await this.toneRepository.update(id, { name })
		if (!updatedTone) {
			throw new NotFoundException(`Tone with ID "${id}" not found`)
		}
		return updatedTone
	}

	async delete(id: string) {
		const result = await this.toneRepository.delete(id)
		if (!result) {
			throw new NotFoundException(`Tone with ID "${id}" not found`)
		}
		return { message: 'Tone successfully deleted' }
	}
}
