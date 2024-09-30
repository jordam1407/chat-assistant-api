import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { KnowledgeBaseService } from '@src/modules/knowledge-base/service/knowledge-base.service'
import { OpenAiService } from '@src/modules/openai/service/openai.service'
import { Org } from '@src/modules/organization/data/org.schema'
import { OrgService } from '@src/modules/organization/service/org.service'
import { Thread } from '@src/modules/thread/schemas/thread.schema'
import {
	IFetchAnserReq,
	IFetchAnswerResponse,
	IThreadById,
	IThreadList,
	IThreadService,
	IUsage,
	IUsageItems,
} from '@src/modules/thread/service/thread.interface'
import { Model } from 'mongoose'

@Injectable()
export class ThreadService implements IThreadService {
	private threadId: string
	private modelPrice = 0.15 / 1000000

	constructor(
		@InjectModel(Thread.name) private readonly threadModel: Model<Thread>,
		private readonly openAiAdapter: OpenAiService,
		private readonly orgService: OrgService,
		private readonly knowledgeBase: KnowledgeBaseService
	) {}

	async fetchAnswer({ message, orgId, tId }: IFetchAnserReq): Promise<IFetchAnswerResponse> {
		this.threadId = tId
		const org = await this.orgService.findOrgById(orgId)
		this.validateOrg(org)

		if (!this.threadId) {
			this.threadId = await this.openAiAdapter.createThread()
			await this.createThread(this.threadId, orgId)
		}

		await this.openAiAdapter.createMessage({ threadId: this.threadId, message: message })

		const context = await this.knowledgeBase.searchVector(message)

		const { message: answer, tokens } = await this.openAiAdapter.getAssistantResponse({
			threadId: this.threadId,
			assistantId: org.assistantId,
			companyName: org.orgName,
			context: context.map((item, i) => `Citation${i + 1}: ${item.pageContent}`).join(`\n\n`),
		})

		await this.updateThread(this.threadId, tokens)

		return { message: answer, threadId: this.threadId }
	}

	async getThreadById(tId: string): Promise<IThreadById> {
		const threadMessages = await this.openAiAdapter.getMessages({ threadId: tId })
		const { totalCost, totalTokens } = await this.calculateTokensForThread(tId)

		return {
			thread: {
				messages: threadMessages.data.map((message) => ({
					content: message.content,
					created_at: message.created_at,
					role: message.role,
				})),
				totalCost,
				totalTokens,
			},
		}
	}

	async listThreads(orgId: string): Promise<IThreadList> {
		return { threads: await this.threadModel.find({ organizationId: orgId }) }
	}

	async createThread(threadId: string, organizationId: string): Promise<void> {
		await this.threadModel.create({ threadId, organizationId })
	}

	async updateThread(threadId: string, tokens: number): Promise<void> {
		await this.threadModel.findOneAndUpdate(
			{ threadId: threadId },
			{
				$inc: {
					totalTokens: tokens,
					cost: tokens * this.modelPrice,
					totalMessages: 2,
				},
			},
			{ new: true, useFindAndModify: false }
		)
	}

	private async aggregateUsageItems({
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

	async getUsage({ endDate, startDate, orgId }: { startDate?: Date; endDate?: Date; orgId: string }): Promise<IUsage> {
		let currentPeriod: IUsageItems
		let lastPeriodPercent: IUsageItems | undefined

		if (startDate && endDate) {
			currentPeriod = await this.aggregateUsageItems({ startDate, endDate, orgId })

			const endPeriod = new Date(startDate.getTime() - 24 * 60 * 60 * 1000)
			const startPeriod = new Date(endDate.getTime() - (endDate.getTime() - startDate.getTime()))

			const lastPeriod = await this.aggregateUsageItems({ startDate: startPeriod, endDate: endPeriod, orgId })

			lastPeriodPercent = lastPeriod ? this.calculatePercentChange(currentPeriod, lastPeriod) : undefined
		} else {
			currentPeriod = await this.aggregateUsageItems({ orgId })
		}

		return {
			current: currentPeriod,
			lastPeriodPercent: lastPeriodPercent,
		}
	}

	// Helpers
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

	private validateOrg(org: Org) {
		if (!org) {
			throw new NotFoundException('No such organization')
		}
		if (!org.subscriptionActive) {
			throw new UnauthorizedException('This subscription is inactive')
		}
	}
}
