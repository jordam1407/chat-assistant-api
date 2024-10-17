import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BASE_CREDITS } from '@src/core/constants/base-credits'
export interface IOrg {
	orgId: string
	baseColor?: string
	logo?: string
	orgName?: string
	assistantName?: string
	instruction?: string
	support?: string
	subscriptionActive: boolean
	credits?: number
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

	@Prop({ default: BASE_CREDITS })
	credits?: number

	@Prop()
	expireAt?: Date
}

export const OrgSchema = SchemaFactory.createForClass(Org)
