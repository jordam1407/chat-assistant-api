import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiKey } from '@src/core/decorators/api-key-decorator'
import { CreateObjectiveDto } from '@src/modules/objective/dto/create-objective.dto'
import { UpdateObjectiveDto } from '@src/modules/objective/dto/update-objective.dto'
import { ObjectiveService } from '@src/modules/objective/service/objective.service'

@ApiKey()
@Controller('objectives')
export class ObjectiveController {
	constructor(private readonly objectiveService: ObjectiveService) {}

	@Post()
	async create(@Body() { key, name, value }: CreateObjectiveDto) {
		return this.objectiveService.create({ key, name, value })
	}

	@Get()
	async findAll() {
		return this.objectiveService.findAll()
	}

	@Get('key/:key')
	async findByKey(@Param('key') key: string) {
		return this.objectiveService.findByKey(key)
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.objectiveService.findById(id)
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateObjectiveDto: UpdateObjectiveDto) {
		return this.objectiveService.update(id, updateObjectiveDto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.objectiveService.delete(id)
	}
}
