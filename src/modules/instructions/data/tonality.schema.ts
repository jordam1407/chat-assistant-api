import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TonalityDocument = HydratedDocument<Tonality>

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Tonality {
	@Prop({ required: true })
	value: string

	@Prop({ required: true })
	description: string

	@Prop({ required: true })
	type: string

	@Prop({ required: true })
	label: string
}

export const TonalitySchema = SchemaFactory.createForClass(Tonality)
