import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Objective } from '@src/modules/objective/data/objective.schema'
import { Tone } from '@src/modules/tone/data/tone.schema'
import mongoose, { Document, HydratedDocument } from 'mongoose'
export type AgentDocument = HydratedDocument<Agent>

// Agent class
@Schema({ timestamps: true })
export class Agent extends Document {
	@Prop({ required: true })
	name: string

	@Prop({ required: true })
	initialMessage: string

	@Prop({ required: true })
	tooltipMessage: string

	@Prop({ required: true })
	logo: string

	@Prop({ required: true })
	contact: string

	@Prop({
		type: String,
		ref: 'Org',
		required: true,
	})
	orgId: string

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tone', required: true })
	tone: Tone

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Objective', required: true })
	objective: Objective

	@Prop({ required: true })
	systemPrompt: string
}

export const AgentSchema = SchemaFactory.createForClass(Agent)
