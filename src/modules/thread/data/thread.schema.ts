import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, HydratedDocument } from 'mongoose'
import { IMessage, ISourceDetail } from '@src/modules/thread/types/core.types'
import { v4 as uuidv4 } from 'uuid'

export type ThreadDocument = HydratedDocument<Thread>

export class SourceDetail implements ISourceDetail {
	@Prop({ required: true })
	chunkId: string

	@Prop({ required: true })
	filename: string

	@Prop({ required: true })
	fileId: string

	constructor(partial: Partial<SourceDetail>) {
		Object.assign(this, partial)
	}
}

export const SourceDetailSchema = SchemaFactory.createForClass(SourceDetail)

export class Message implements IMessage {
	@Prop({ default: uuidv4() })
	id: string

	@Prop({ default: new Date() })
	timestamp: Date

	@Prop({ required: true })
	content: string

	@Prop({ required: true, enum: ['user', 'assistant'] })
	role: 'user' | 'assistant'

	@Prop({
		type: [SourceDetailSchema],
		default: [],
	})
	sources?: SourceDetail[]

	constructor(partial: Omit<Message, 'id' | 'timestamp'>) {
		Object.assign(this, partial)
	}
}

// Thread class
@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Thread extends Document {
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

	@Prop({ default: '' })
	organizationId: string

	@Prop({ default: [] })
	messages: IMessage[]
}

export const ThreadSchema = SchemaFactory.createForClass(Thread)
