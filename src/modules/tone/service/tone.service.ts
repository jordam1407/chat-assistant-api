import { Injectable, NotFoundException } from '@nestjs/common'
import { ToneRepository } from '@src/modules/tone/data/tone.repository'
import { CreateToneDto } from '@src/modules/tone/dto/create-tone.dto'
import { UpdateToneDto } from '@src/modules/tone/dto/update-tone.dto'
import { IToneService } from '@src/modules/tone/service/tone.interface'

@Injectable()
export class ToneService implements IToneService {
	constructor(private readonly toneRepository: ToneRepository) {}

	async create({ key, name, value }: CreateToneDto) {
		return this.toneRepository.create({ key, name, value })
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

	async update(id: string, updateToneDto: UpdateToneDto) {
		const updatedTone = await this.toneRepository.update(id, { name: updateToneDto.name, value: updateToneDto.value })
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
