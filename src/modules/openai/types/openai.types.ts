import { IMessage } from '@src/modules/thread/types/core.types'

export interface IOpenAiService {
	model: string
	assistant: string
	apiKey: string
}

export interface ICompletion {
	companyName: string
	context: string
	pastMessages: IMessage[]
}
