import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
export type ObjectiveDocument = HydratedDocument<Objective>

// Objective class
@Schema({ timestamps: true })
export class Objective extends Document {
	@Prop({ required: true, unique: true })
	key: string

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	value: string
}

export const ObjectiveSchema = SchemaFactory.createForClass(Objective)
