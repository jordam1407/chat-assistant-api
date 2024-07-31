import { ConfigService } from '@nestjs/config'
import { IOpenAIConnection } from '@src/shared/adapters/openai/openai.connection'
import OpenAI from 'openai'
import { Message, MessagesPage } from 'openai/resources/beta/threads/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import { Thread } from 'openai/resources/beta/threads/threads'

export class OpenAiAdapter implements IOpenAIConnection {
	private openai: OpenAI
	private model: string
	private assistant: string

	constructor({ assistant, model, apiKey }: { model: string; assistant: string; apiKey: string }) {
		this.openai = new OpenAI({
			apiKey,
		})
		this.model = model
		this.assistant = assistant
	}

	async getAssistantResponse({ threadId }: { threadId: string }): Promise<{ message: string; tokens: number }> {
		const run = await this.createRun({ assistantId: this.assistant, threadId })

		if (run.status === 'completed') {
			const messages = await this.getMessages({ threadId })
			for (const message of messages.data.reverse()) {
				// @ts-expect-error - The last message is always a text message
				console.log(`${message.role} > ${message.content[0].text.value}`)
			}
			const tokens = run.usage.total_tokens
			// @ts-expect-error - The last message is always a text message
			const message = this.sanitizeMessage(messages.data[messages.data.length - 1].content[0].text.value)

			return { message, tokens }
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
		console.log('Run:', run)
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
		return `You are an assistant responsible for handling customer interactions on any type of communication tool for ${companyName}. Your responsibilities include sales, post-sale, FAQ, customer support, and addressing all other user requests. You should respond concisely and as briefly as possible to address customer requests. You are not allowed to answer questions outside the scope of the ${companyName} company. If any request is outside the provided documentation, respond with: "Não devo falar sobre isso, posso te ajudar em algo mais?".`
	}

	private sanitizeMessage(message: string) {
		const citationPattern = /【\d+:\d+†[^\】]*】/g
		return message.replace(citationPattern, '')
	}
}
