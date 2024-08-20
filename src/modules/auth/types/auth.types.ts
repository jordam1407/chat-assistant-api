import { Types } from 'mongoose'

export interface IAuthAccount {
	email: string
	password: string
	name: string
	phone: string
	openAIApiKey: string
	assistant: string
	refreshToken: string | null
}

export interface ICreateAccount {
	email: string
	password: string
	name: string
	phone?: string
}
