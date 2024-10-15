import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiKey } from '@src/core/decorators/api-key-decorator'
import { Instruction } from '@src/modules/instructions/data/instructions.schema'
import { InstructionService } from '@src/modules/instructions/service/instruction.service'

@ApiKey()
@Controller('instructions')
export class InstructionController {
	constructor(private readonly instructionService: InstructionService) {}

	@Post()
	async createInstruction(@Body() createInstructionDto: Partial<Instruction>): Promise<Instruction> {
		return this.instructionService.createInstruction(createInstructionDto)
	}

	@Get()
	async getInstructions(): Promise<Instruction[]> {
		return this.instructionService.getInstructions()
	}

	@Get(':id')
	async getInstructionById(@Param('id') id: string): Promise<Instruction> {
		return this.instructionService.getInstructionById(id)
	}

	@Patch(':id')
	async updateInstruction(
		@Param('id') id: string,
		@Body() updateInstructionDto: Partial<Instruction>
	): Promise<Instruction> {
		return this.instructionService.updateInstruction(id, updateInstructionDto)
	}

	@Delete(':id')
	async deleteInstruction(@Param('id') id: string): Promise<void> {
		return this.instructionService.deleteInstruction(id)
	}
}
