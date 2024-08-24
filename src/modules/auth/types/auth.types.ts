export interface IAuthAccount {
	email: string
	password: string
	name: string
	phone: string
	organizationId: string
	refreshToken: string | null
}

export interface ICreateAccount {
	email: string
	password: string
	name: string
	organizationId: string
	phone?: string
}
