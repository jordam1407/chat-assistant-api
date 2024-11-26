import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
export type ToneDocument = HydratedDocument<Tone>

// Tone class
@Schema({ timestamps: true })
export class Tone extends Document {
	@Prop({ required: true, unique: true })
	key: string // e.g., "formal", "informal"

	@Prop({ required: true })
	name: string // e.g., "Formal", "Informal"
}

export const ToneSchema = SchemaFactory.createForClass(Tone)
