import { Tone } from '@src/modules/tone/data/tone.schema'
import { CreateToneDto } from '@src/modules/tone/dto/create-tone.dto'
import { UpdateToneDto } from '@src/modules/tone/dto/update-tone.dto'

export interface IToneService {
	create(createToneDto: CreateToneDto): Promise<Tone>
	findAll(): Promise<Tone[]>
	findByKey(key: string): Promise<Tone>
	findById(id: string): Promise<Tone>
	update(id: string, updateDto: UpdateToneDto): Promise<Tone>
	delete(id: string): Promise<{ message: string }>
}
