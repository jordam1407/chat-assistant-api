import { Objective } from '@src/modules/objective/data/objective.schema'

export interface IObjectiveService {
	create(createObjectiveDto: ICreateObjective): Promise<Objective>
	findAll(): Promise<Objective[]>
	findByKey(key: string): Promise<Objective | null>
	findById(id: string): Promise<Objective | null>
	update(id: string, updates: Partial<Objective>): Promise<Objective | null>
	delete(id: string): Promise<{ success: boolean }>
}

export interface ICreateObjective {
	name: string
	key: string
	value: string
}
