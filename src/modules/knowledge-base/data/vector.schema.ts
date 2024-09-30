import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type VectorDocument = HydratedDocument<Vector>

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Vector {
	@Prop({ required: true })
	fileId: string

	@Prop({ required: true })
	fileName: string

	@Prop({ required: true })
	vector: number[]

	@Prop({ required: true })
	pageContent: string
}

export const VectorSchema = SchemaFactory.createForClass(Vector)
