import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { InstructionController } from '@src/modules/instructions/controller/instruction.controller'
import { InstructionRepository } from '@src/modules/instructions/data/instructions.repository'
import { Instruction, InstructionSchema } from '@src/modules/instructions/data/instructions.schema'
import { InstructionService } from '@src/modules/instructions/service/instruction.service'

@Module({
	controllers: [InstructionController],
	providers: [InstructionRepository, InstructionService],
	imports: [MongooseModule.forFeature([{ name: Instruction.name, schema: InstructionSchema }])],
	exports: [InstructionService],
})
export class InstructionModule {}
