import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ObjectiveEnum, ToneEnum } from '@src/modules/agent/types/core.types'
import { Document, HydratedDocument } from 'mongoose'
import { v4 as uuid } from 'uuid'
export type AgentDocument = HydratedDocument<Agent>

// Agent class
@Schema({ timestamps: true })
export class Agent extends Document {
	@Prop({ required: true, immutable: true, unique: true, default: uuid })
	agentId: string

	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	organizationId: string

	@Prop({ default: ToneEnum.Formal, required: true, enum: Object.values(ToneEnum) })
	tone: ToneEnum

	@Prop({ default: ObjectiveEnum.Answer, required: true, enum: Object.values(ObjectiveEnum) })
	objective: ObjectiveEnum

	@Prop({ required: true })
	systemPrompt: string
}

export const AgentSchema = SchemaFactory.createForClass(Agent)
