import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type InstructionDocument = HydratedDocument<Instruction>

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Instruction {
	@Prop({ required: true })
	instruction: string

	@Prop({ required: true })
	instructionName: string
}

export const InstructionSchema = SchemaFactory.createForClass(Instruction)
