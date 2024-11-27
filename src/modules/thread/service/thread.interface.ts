import { Thread } from '@src/modules/thread/data/thread.schema'
import { IMessage } from '@src/modules/thread/types/core.types'

export interface IThreadService {
	fetchAnswer({ message, orgId, tId, agentId }: IFetchAnserReq): Promise<IFetchAnswerResponse>
	getThreadById(tId: string): Promise<IThreadById>
	listThreads(orgId: string): Promise<IThreadList>
	getUsage({ endDate, startDate }: { startDate?: Date; endDate?: Date; orgId: string }): Promise<IUsage>
}

export interface IFetchAnserReq {
	message: string
	tId?: string
	orgId: string
	agentId: string
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
	thread: { messages: IMessage[]; totalCost: number; totalTokens: number }
}

export interface IThreadList {
	threads: Thread[]
}
export interface IFetchAnswerResponse {
	message: string
	threadId: string
}
