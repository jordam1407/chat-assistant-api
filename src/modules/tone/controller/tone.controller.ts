import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Public } from '@src/modules/auth/decorators/auth.decorator'
import { ToneService } from '@src/modules/tone/service/tone.service'

@Controller('tones')
export class ToneController {
	constructor(private readonly toneService: ToneService) {}

	@Public()
	@Post()
	async create(@Body() createToneDto: { key: string; name: string }) {
		return this.toneService.create(createToneDto.key, createToneDto.name)
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
	async update(@Param('id') id: string, @Body() updateToneDto: { name: string }) {
		return this.toneService.update(id, updateToneDto.name)
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.toneService.delete(id)
	}
}
