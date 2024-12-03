import { Injectable, NotFoundException } from '@nestjs/common'
import { ObjectiveRepository } from '@src/modules/objective/data/objective.repository'
import { Objective } from '@src/modules/objective/data/objective.schema'
import { ICreateObjective, IObjectiveService } from '@src/modules/objective/service/objective.interface'

@Injectable()
export class ObjectiveService implements IObjectiveService {
	constructor(private readonly objectiveRepository: ObjectiveRepository) {}

	async create({ key, name, value }: ICreateObjective) {
		return this.objectiveRepository.create({ key, name, value })
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
		return { success: result }
	}
}
