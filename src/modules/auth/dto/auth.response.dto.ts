import { IAuthAccount } from '@src/modules/auth/types/auth.types'

export class AuthUserResponseDTO {
	access_token: string
	user: Omit<IAuthAccount, 'password'>

	constructor({ access_token, user }: { access_token: string; user: Omit<IAuthAccount, 'password'> }) {
		this.access_token = access_token
		this.user = user
	}
}
