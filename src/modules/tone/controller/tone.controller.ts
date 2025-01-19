import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiKey } from '@src/core/decorators/api-key-decorator'
import { CreateToneDto } from '@src/modules/tone/dto/create-tone.dto'
import { ToneService } from '@src/modules/tone/service/tone.service'
@ApiKey()
@Controller('tones')
export class ToneController {
	constructor(private readonly toneService: ToneService) {}

	@Post()
	async create(@Body() { key, name, value }: CreateToneDto) {
		return this.toneService.create({ key, name, value })
	}

	@Get()
	async findAll() {
		return this.toneService.findAll()
	}

	@Get('key/:key')
	async findByKey(@Param('key') key: string) {
		return this.toneService.findByKey(key)
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.toneService.findById(id)
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() updateToneDto: { name: string; value: string }) {
		return this.toneService.update(id, updateToneDto)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.toneService.delete(id)
	}
}
