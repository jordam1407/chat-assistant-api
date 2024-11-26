import { Tone } from '@src/modules/tone/data/tone.schema'

export interface IToneService {
	create(key: string, name: string): Promise<Tone>
	findAll(): Promise<Tone[]>
	findByKey(key: string): Promise<Tone>
	findById(id: string): Promise<Tone>
	update(id: string, name: string): Promise<Tone>
	delete(id: string): Promise<{ message: string }>
}
