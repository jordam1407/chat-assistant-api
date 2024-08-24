import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
export interface IOrg {
	orgId: string
	assistantId?: string
	baseColor?: string
	logo?: string
	subscriptionActive: boolean
	expireAt?: Date
}

@Schema({ timestamps: true })
export class Org implements IOrg {
	@Prop({ index: true, unique: true, required: true })
	orgId: string

	@Prop()
	assistantId?: string

	@Prop()
	baseColor?: string

	@Prop()
	logo?: string

	@Prop()
	subscriptionActive: boolean

	@Prop()
	expireAt?: Date
}

export const OrgSchema = SchemaFactory.createForClass(Org)
