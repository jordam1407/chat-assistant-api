import { ERoles, ICreateAccount } from '@src/modules/auth/types/auth.types'

export class SignUpReqDTO implements Omit<ICreateAccount, 'organizationId' | 'role'> {
	email: string

	password: string

	name: string

	phone?: string

	credits?: number

	orgName: string
}

export class createUserForOrgDto {
	email: string

	password: string

	name: string

	role: ERoles
}

export class LoginDto {
	email: string

	password: string
}
