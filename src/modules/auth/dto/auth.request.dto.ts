import { ICreateAccount } from '@src/modules/auth/types/auth.types'

export class SignUpReqDTO implements ICreateAccount {
	email: string

	password: string

	name: string

	phone?: string
}

export class LoginDto {
	email: string

	password: string
}
