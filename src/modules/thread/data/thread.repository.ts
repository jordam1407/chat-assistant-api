import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Thread } from '@src/modules/thread/data/thread.schema'
import { IThreadList, IUsageItems } from '@src/modules/thread/service/thread.interface'
import { IMessage } from '@src/modules/thread/types/core.types'
import { Model } from 'mongoose'

@Injectable()
export class ThreadRepository {
	constructor(@InjectModel(Thread.name) private readonly threadModel: Model<Thread>) {}
	async createThread({ threadId, orgId }: { threadId: string; orgId: string }): Promise<void> {
		// Check if conversation already exists to prevent duplication
		const exists = await this.hasConversation(threadId)
		if (!exists) {
			await this.threadModel.create({ threadId, organizationId: orgId, messages: [] })
		}
	}

	async getConversation(threadId: string): Promise<Thread> {
		return await this.threadModel.findOne({ threadId })
	}

	async hasConversation(threadId: string): Promise<boolean> {
		return !!(await this.threadModel.findOne({ threadId }))
	}

	async deleteConversation(threadId: string): Promise<void> {
		await this.threadModel.deleteOne({ threadId })
	}

	async addEntryToThread({
		message,
		threadId,
		cost = 0,
		tokens = 0,
	}: {
		threadId: string
		message: IMessage
		tokens?: number
		cost?: number
	}): Promise<void> {
		await this.threadModel.updateOne(
			{ threadId },
			{
				$push: { messages: message },
				$inc: {
					totalTokens: tokens,
					cost,
					totalMessages: 1,
				},
			}
		)
	}

	async aggregateUsageItems({
		endDate,
		orgId,
		startDate,
	}: {
		startDate?: Date
		endDate?: Date
		orgId: string
	}): Promise<IUsageItems> {
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
			{ $match: { ...matchStage, organizationId: orgId } },
			{
				$group: {
					_id: null,
					totalTokens: { $sum: '$totalTokens' },
					totalThreads: { $sum: 1 },
					totalPrice: { $sum: '$cost' },
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

	async listThreads(orgId: string): Promise<IThreadList> {
		return { threads: await this.threadModel.find({ organizationId: orgId }).select('-messages') }
	}

	async clearConversations(orgId: string): Promise<void> {
		await this.threadModel.deleteMany({ organizationId: orgId })
	}
}
