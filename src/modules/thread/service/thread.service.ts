import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { KnowledgeBaseService } from '@src/modules/knowledge-base/service/knowledge-base.service'
import { OpenAiService } from '@src/modules/openai/service/openai.service'
import { Org } from '@src/modules/organization/data/org.schema'
import { OrgService } from '@src/modules/organization/service/org.service'
import { ThreadRepository } from '@src/modules/thread/data/thread.repository'
import { Message, SourceDetail } from '@src/modules/thread/data/thread.schema'
import {
	IFetchAnserReq,
	IFetchAnswerResponse,
	IThreadById,
	IThreadList,
	IUsage,
	IUsageItems,
} from '@src/modules/thread/service/thread.interface'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class ThreadService {
	private threadId: string
	private modelPrice = 0.15 / 1000000

	constructor(
		private readonly threadModel: ThreadRepository,
		private readonly openAiAdapter: OpenAiService,
		private readonly orgService: OrgService,
		private readonly knowledgeBase: KnowledgeBaseService
	) {}

	async fetchAnswer({ message, orgId, tId }: IFetchAnserReq): Promise<IFetchAnswerResponse> {
		this.threadId = tId
		const org = await this.orgService.findOrgById(orgId)
		this.validateOrg(org)

		if (!this.threadId) {
			const newId = uuidv4()
			this.threadId = newId
			await this.threadModel.createThread({
				threadId: newId,
				orgId,
			})
		}

		const context = await this.knowledgeBase.searchVector(message, orgId)
		await this.threadModel.addEntryToThread({
			threadId: this.threadId,
			message: new Message({
				content: message,
				role: 'user',
			}),
		})

		const { output: answer, tokens } = await this.openAiAdapter.completion({
			companyName: org.orgName,
			context: context.map((item, i) => `Citation${i + 1}: ${item.pageContent}`).join(`\n\n`),
			pastMessages: (await this.threadModel.getConversation(this.threadId)).messages,
		})

		await this.threadModel.addEntryToThread({
			message: new Message({
				content: answer,
				role: 'assistant',
				sources: context.map((source) => {
					return new SourceDetail({
						chunkId: source._id,
						filename: source.fileName,
						fileId: source.fileId,
					})
				}),
			}),
			threadId: this.threadId,
			cost: this.calculatePriceByTokens(tokens),
			tokens,
		})

		return { message: answer, threadId: this.threadId }
	}

	async getThreadById(tId: string): Promise<IThreadById> {
		const threadMessages = await this.threadModel.getConversation(tId)
		const { totalCost, totalTokens } = await this.calculateTokensForThread(tId)

		return {
			thread: {
				messages: threadMessages.messages,
				totalCost,
				totalTokens,
			},
		}
	}

	async listThreads(orgId: string): Promise<IThreadList> {
		return await this.threadModel.listThreads(orgId)
	}

	async populateThreads(orgId: string) {
		const threads = await this.threadModel.listThreads(orgId)
		for (const thread of threads.threads) {
			const { data } = await this.openAiAdapter.getMessages({ threadId: thread.threadId })
			console.log(data[0].role)

			for (const message of data.reverse())
				await this.threadModel.addEntryToThread({
					threadId: thread.threadId,
					message: new Message({
						content: 'text' in message.content[0] ? message.content[0].text.value : '',
						role: message.role,
					}),
				})
		}
		return threads
	}

	private async aggregateUsageItems(filter: { startDate?: Date; endDate?: Date; orgId: string }): Promise<IUsageItems> {
		return await this.threadModel.aggregateUsageItems(filter)
	}

	private async calculateTokensForThread(threadId: string): Promise<{ totalTokens: number; totalCost: number }> {
		const thread = await this.threadModel.getConversation(threadId)

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

	private calculatePriceByTokens(tokens: number) {
		return tokens * this.modelPrice
	}
}
