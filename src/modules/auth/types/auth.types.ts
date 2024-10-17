export interface IAuthAccount {
	email: string
	password: string
	name: string
	phone: string
	organizationId: string
	refreshToken: string | null
	role: ERoles
}

export interface ICreateAccount {
	email: string
	password: string
	name: string
	organizationId: string
	phone?: string
	role: ERoles
}

export enum ERoles {
	owner = 'owner',
	admin = 'admin',
	user = 'user',
}
