import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Thread } from '@src/modules/thread/schemas/thread.schema'
import {
	IThreadById,
	IThreadList,
	IThreadService,
	IUsage,
	IUsageItems,
} from '@src/modules/thread/service/thread.interface'
import { OpenAiAdapter } from '@src/shared/adapters/openai/openai.adapter'
import { Model } from 'mongoose'

@Injectable()
export class ThreadService implements IThreadService {
	private threadId: string
	private OpenAI: OpenAiAdapter
	private modelPrice = 0.15 / 1000000

	constructor(@InjectModel(Thread.name) private readonly threadModel: Model<Thread>) {
		this.OpenAI = new OpenAiAdapter({
			assistant: 'asst_yyEF3Z29cD0olDWtanbJ6cSS',
			model: 'gpt-4o-mini',
			apiKey: 'sk-proj-j0ggz4BetKPhPDAuykmAT3BlbkFJnE3484f9cVGSi92V8yrB',
		})
	}

	async fetchAnswer(reqMessage: string, tId?: string): Promise<string> {
		this.threadId = tId

		if (!this.threadId) {
			this.threadId = await this.OpenAI.createThread()
			await this.createThread(this.threadId)
		}

		await this.OpenAI.createMessage({ threadId: this.threadId, message: reqMessage })

		const { message, tokens } = await this.OpenAI.getAssistantResponse({ threadId: this.threadId })

		await this.updateThread(this.threadId, tokens)

		return message
	}

	async getThreadById(tId: string): Promise<IThreadById> {
		const threadMessages = await this.OpenAI.getMessages({ threadId: tId })
		const { totalCost, totalTokens } = await this.calculateTokensForThread(tId)
		const { current } = await this.getUsage({})

		return {
			thread: {
				messages: threadMessages.data,
				totalCost,
				totalTokens,
			},
			usageMetrics: current,
		}
	}

	async listThreads(): Promise<IThreadList> {
		return { threads: await this.threadModel.find() }
	}

	async createThread(threadId: string): Promise<void> {
		await this.threadModel.create({ threadId })
	}

	async updateThread(threadId: string, tokens: number): Promise<void> {
		await this.threadModel.findOneAndUpdate(
			{ threadId: threadId },
			{
				$inc: {
					totalTokens: tokens,
					cost: tokens * this.modelPrice,
					totalMessages: 1,
				},
			},
			{ new: true, useFindAndModify: false }
		)
	}

	private async aggregateUsageItems(startDate?: Date, endDate?: Date): Promise<IUsageItems> {
		const matchStage =
			startDate && endDate
				? {
						createdAt: {
							$gte: startDate,
							$lte: endDate,
						},
					}
				: {}

		const pipeline = [
			{ $match: matchStage },
			{
				$group: {
					_id: null,
					totalTokens: { $sum: '$totalTokens' },
					totalThreads: { $sum: 1 },
					totalPrice: { $sum: '$cost' }, // assuming cost is the total cost per thread
					totalMessages: { $sum: '$totalMessages' },
				},
			},
			{
				$project: {
					_id: 0,
					totalTokens: 1,
					totalThreads: 1,
					totalPrice: 1,
					averageTokensPerThread: { $divide: [{ $ifNull: ['$totalTokens', 0] }, { $ifNull: ['$totalThreads', 1] }] },
					averagePricePerThread: { $divide: [{ $ifNull: ['$totalPrice', 0] }, { $ifNull: ['$totalThreads', 1] }] },
					averageMessagePerThread: { $divide: [{ $ifNull: ['$totalMessages', 0] }, { $ifNull: ['$totalThreads', 1] }] },
				},
			},
		]

		const result = await this.threadModel.aggregate(pipeline)

		if (result.length === 0) {
			return {
				totalTokens: 0,
				totalThreads: 0,
				totalPrice: 0,
				averageTokensPerThread: 0,
				averagePricePerThread: 0,
				averageMessagePerThread: 0,
			}
		}

		return result[0] as IUsageItems
	}

	private async calculateTokensForThread(threadId: string): Promise<{ totalTokens: number; totalCost: number }> {
		const thread = await this.threadModel.findOne({ threadId })

		if (!thread) {
			return {
				totalTokens: 0,
				totalCost: 0,
			}
		}

		return { totalTokens: thread.totalTokens, totalCost: thread.cost }
	}

	// Helpers
	async getUsage({ endDate, startDate }: { startDate?: Date; endDate?: Date }): Promise<IUsage> {
		let currentPeriod: IUsageItems
		let lastPeriodPercent: IUsageItems | undefined

		if (startDate && endDate) {
			currentPeriod = await this.aggregateUsageItems(startDate, endDate)

			const endPeriod = new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
			const startPeriod = new Date(endDate.getTime() - (endDate.getTime() - startDate.getTime()))

			const lastPeriod = await this.aggregateUsageItems(startPeriod, endPeriod)

			lastPeriodPercent = lastPeriod ? this.calculatePercentChange(currentPeriod, lastPeriod) : undefined
		} else {
			currentPeriod = await this.aggregateUsageItems()
		}

		return {
			current: currentPeriod,
			lastPeriodPercent: lastPeriodPercent,
		}
	}

	private calculatePercentChange(current: IUsageItems, lastPeriod: IUsageItems): IUsageItems {
		const percentChange = (currentValue: number, lastValue: number) =>
			lastValue === 0 ? (currentValue > 0 ? 100 : 0) : ((currentValue - lastValue) / lastValue) * 100

		return {
			totalTokens: percentChange(current.totalTokens, lastPeriod.totalTokens),
			totalThreads: percentChange(current.totalThreads, lastPeriod.totalThreads),
			totalPrice: percentChange(current.totalPrice, lastPeriod.totalPrice),
			averageTokensPerThread: percentChange(current.averageTokensPerThread, lastPeriod.averageTokensPerThread),
			averagePricePerThread: percentChange(current.averagePricePerThread, lastPeriod.averagePricePerThread),
			averageMessagePerThread: percentChange(current.averageMessagePerThread, lastPeriod.averageMessagePerThread),
		}
	}
}
