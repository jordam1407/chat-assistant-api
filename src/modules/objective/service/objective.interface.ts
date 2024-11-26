import { Objective } from '@src/modules/objective/data/objective.schema'

export interface IObjectiveService {
	create(key: string, name: string): Promise<Objective>
	findAll(): Promise<Objective[]>
	findByKey(key: string): Promise<Objective | null>
	findById(id: string): Promise<Objective | null>
	update(id: string, updates: Partial<Objective>): Promise<Objective | null>
	delete(id: string): Promise<boolean>
}

export interface ICreateObjective {
	name: string
	key: string
}
