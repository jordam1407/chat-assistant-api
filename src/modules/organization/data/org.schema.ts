import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
export interface IOrg {
	orgId: string
	assistantId?: string
	baseColor?: string
	assistantName?: string
	orgName?: string
	logo?: string
	subscriptionActive: boolean
	expireAt?: Date
}

@Schema({ timestamps: true })
export class Org implements IOrg {
	@Prop({ index: true, unique: true, required: true })
	orgId: string

	@Prop()
	baseColor?: string

	@Prop()
	logo?: string

	@Prop()
	orgName?: string

	@Prop()
	assistantName?: string

	@Prop()
	instruction?: string

	@Prop()
	support?: string

	@Prop()
	subscriptionActive: boolean

	@Prop()
	expireAt?: Date
}

export const OrgSchema = SchemaFactory.createForClass(Org)
