import { IFetchAnswerResponse } from '@src/modules/thread/service/thread.interface'
import OpenAI from 'openai'
import { Message, MessagesPage } from 'openai/resources/beta/threads/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'

export class OpenAiService {
	private openai: OpenAI
	private model: string
	private assistant: string

	constructor() {
		this.openai = new OpenAI({
			apiKey: 'sk-proj-j0ggz4BetKPhPDAuykmAT3BlbkFJnE3484f9cVGSi92V8yrB',
		})
		this.model = 'gpt-4o-mini'
		this.assistant = 'asst_yyEF3Z29cD0olDWtanbJ6cSS'
	}

	async getAssistantResponse({ threadId }: { threadId: string }): Promise<IFetchAnswerResponse & { tokens: number }> {
		const run = await this.createRun({ assistantId: this.assistant, threadId })

		if (run.status === 'completed') {
			const messages = await this.getMessages({ threadId })
			for (const message of messages.data.reverse()) {
				// @ts-expect-error - The last message is always a text message
				console.log(`${message.role} > ${message.content[0].text.value}`)
			}
			const tokens = run.usage.total_tokens
			const message = messages.data[messages.data.length - 1]

			return { message, tokens, threadId }
		}
	}

	async createThread(): Promise<string> {
		const { id } = await this.openai.beta.threads.create()
		return id
	}

	async createMessage({ threadId, message }: { threadId: string; message: string }): Promise<Message> {
		return await this.openai.beta.threads.messages.create(threadId, {
			role: 'user',
			content: message,
		})
	}

	async getMessages({ threadId }: { threadId: string }): Promise<MessagesPage> {
		return await this.openai.beta.threads.messages.list(threadId)
	}

	async createRun({ assistantId, threadId }: { assistantId: string; threadId: string }): Promise<Run> {
		const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {
			assistant_id: assistantId,
			instructions: this.generateInstructions('WAspeed'),
			tools: [{ type: 'file_search', file_search: { max_num_results: 1 } }],
		})
		return run
	}

	async createAssistant({ companyName }: { companyName: string }) {
		return await this.openai.beta.assistants.create({
			instructions: this.generateInstructions(companyName),
			model: this.model,
			tools: [{ type: 'file_search', file_search: { max_num_results: 5 } }],
		})
	}

	private generateInstructions(companyName: string) {
		return `You are Speed, an assistant responsible for handling customer interactions on any type of communication tool for ${companyName}. Your responsibilities include sales, post-sale, FAQ, customer support, and addressing all other user requests. You should respond concisely and as briefly as possible to address customer requests. You are not allowed to answer questions outside the scope of the ${companyName} company be polite about it. Respond using MARKDOWN only, for empty lines include a black line. In case you cant provide a apropriate answer you can ask the user to provide more information. After that or if the user ask to contact human support yo u provide the on a markdown syntax saying Falar com Suporte: https://wa.me/+553195968976?text=Ol%C3%A1%2C%20vim%20da%20intelig%C3%AAncia%20artificial.`
	}

	private sanitizeMessage(message: string) {
		const citationPattern = /【\d+:\d+†[^\】]*】/g
		return message.replace(citationPattern, '')
	}
}
