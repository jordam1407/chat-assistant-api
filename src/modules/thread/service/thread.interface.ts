import { Thread } from '@src/modules/thread/schemas/thread.schema'
import { Message } from 'openai/resources/beta/threads/messages'

export interface IThreadService {
	fetchAnswer({ message, orgId, tId }: IFetchAnserReq): Promise<IFetchAnswerResponse>
	getThreadById(tId: string): Promise<IThreadById>
	listThreads(orgId: string): Promise<IThreadList>
	getUsage({ endDate, startDate }: { startDate?: Date; endDate?: Date; orgId: string }): Promise<IUsage>
}

export interface IFetchAnserReq {
	message: string
	tId?: string
	orgId: string
}

export interface IUsage {
	current: IUsageItems
	lastPeriodPercent?: IUsageItems
}

export interface IUsageItems {
	totalTokens: number
	totalThreads: number
	totalPrice: number
	averageTokensPerThread: number
	averagePricePerThread: number
	averageMessagePerThread: number
}

export interface IThreadById {
	thread: { messages: Pick<Message, 'content' | 'created_at' | 'role'>[]; totalCost: number; totalTokens: number }
}

export interface IThreadList {
	threads: Thread[]
}
export interface IFetchAnswerResponse {
	message: Pick<Message, 'content' | 'created_at' | 'role'>
	threadId: string
}
