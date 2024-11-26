import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ObjectiveService } from '@src/modules/objective/service/objective.service'

@Controller('objectives')
export class ObjectiveController {
	constructor(private readonly objectiveService: ObjectiveService) {}

	@Post()
	async create(@Body() createObjectiveDto: { key: string; name: string }) {
		return this.objectiveService.create(createObjectiveDto.key, createObjectiveDto.name)
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
	async update(@Param('id') id: string, @Body() updateObjectiveDto: { name: string }) {
		return this.objectiveService.update(id, updateObjectiveDto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.objectiveService.delete(id)
	}
}
