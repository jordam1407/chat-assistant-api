import { Thread } from '@src/modules/thread/schemas/thread.schema'
import { Message } from 'openai/resources/beta/threads/messages'

export interface IThreadService {
	fetchAnswer(message: string, tId?: string): Promise<string>
	getThreadById(tId: string): Promise<IThreadById>
	listThreads(): Promise<IThreadList>
	getUsage({ endDate, startDate }: { startDate?: Date; endDate?: Date }): Promise<IUsage>
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
	thread: { messages: Message[]; totalCost: number; totalTokens: number }
	usageMetrics: IUsageItems
}

export interface IThreadList {
	threads: Thread[]
}
