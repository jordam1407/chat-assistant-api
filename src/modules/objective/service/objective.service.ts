import { Injectable, NotFoundException } from '@nestjs/common'
import { ObjectiveRepository } from '@src/modules/objective/data/objective.repository'
import { Objective } from '@src/modules/objective/data/objective.schema'

@Injectable()
export class ObjectiveService {
	constructor(private readonly objectiveRepository: ObjectiveRepository) {}

	async create(key: string, name: string) {
		return this.objectiveRepository.create({ key, name })
	}

	async findAll() {
		return this.objectiveRepository.findAll()
	}

	async findByKey(key: string) {
		const objective = await this.objectiveRepository.findByKey(key)
		if (!objective) {
			throw new NotFoundException(`Objective with key "${key}" not found`)
		}
		return objective
	}

	async findById(id: string) {
		const objective = await this.objectiveRepository.findById(id)
		if (!objective) {
			throw new NotFoundException(`Objective with ID "${id}" not found`)
		}
		return objective
	}

	async update(id: string, objectiveUpdateDto: Partial<Objective>) {
		const updatedObjective = await this.objectiveRepository.update(id, objectiveUpdateDto)
		if (!updatedObjective) {
			throw new NotFoundException(`Objective with ID "${id}" not found`)
		}
		return updatedObjective
	}

	async delete(id: string) {
		const result = await this.objectiveRepository.delete(id)
		if (!result) {
			throw new NotFoundException(`Objective with ID "${id}" not found`)
		}
		return { message: 'Objective successfully deleted' }
	}
}
