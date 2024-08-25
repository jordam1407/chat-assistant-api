import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ThreadDocument = HydratedDocument<Thread>

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Thread {
	@Prop({ required: true, immutable: true, unique: true })
	threadId: string

	@Prop({ default: new Date() })
	createdAt?: Date

	@Prop({ default: new Date() })
	updatedAt?: Date

	@Prop({ default: 0 })
	totalTokens: number

	@Prop({ default: 0 })
	cost: number

	@Prop({ default: 0 })
	totalMessages: number

	@Prop({ default: 0 })
	organizationId: string
}

export const ThreadSchema = SchemaFactory.createForClass(Thread)
