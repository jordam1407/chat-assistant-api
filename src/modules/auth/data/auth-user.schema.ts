import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { IAuthAccount } from '@src/modules/auth/types/auth.types'

@Schema({ timestamps: true })
export class AuthUser implements IAuthAccount {
	@Prop({ index: true, unique: true, required: true })
	email: string

	@Prop({ required: true })
	password: string

	@Prop()
	name: string

	@Prop()
	refreshToken: string | null

	@Prop()
	phone: string

	@Prop()
	organizationId: string
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser)
