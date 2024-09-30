import { Logger } from '@nestjs/common'
import { ICreateRunsAndAssistants } from '@src/modules/openai/types/openai.types'
import { IFetchAnswerResponse } from '@src/modules/thread/service/thread.interface'
import OpenAI from 'openai'
import { Message, MessagesPage } from 'openai/resources/beta/threads/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'

export class OpenAiService {
	private openai: OpenAI
	private model: string
	private readonly logger = new Logger(OpenAiService.name)

	constructor() {
		this.openai = new OpenAI({
			apiKey: 'sk-proj-j0ggz4BetKPhPDAuykmAT3BlbkFJnE3484f9cVGSi92V8yrB',
		})
		this.model = 'gpt-4o-mini-2024-07-18'
	}

	async getAssistantResponse({
		threadId,
		assistantId,
		companyName,
		context,
	}: ICreateRunsAndAssistants): Promise<IFetchAnswerResponse & { tokens: number }> {
		const run = await this.createRun({ assistantId, threadId, companyName, context })

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

	async createRun({ assistantId, threadId, companyName, context }: ICreateRunsAndAssistants): Promise<Run> {
		const instructions = this.generateInstructions({ companyName, context })
		this.logger.debug(instructions)

		const run = await this.openai.beta.threads.runs.createAndPoll(threadId, {
			instructions,
			assistant_id: assistantId,
		})
		return run
	}

	async createAssistant({ companyName, context }: ICreateRunsAndAssistants) {
		return await this.openai.beta.assistants.create({
			instructions: this.generateInstructions({ companyName, context }),
			model: this.model,
		})
	}

	private generateInstructions({ companyName, context }: Partial<ICreateRunsAndAssistants>) {
		return `<instruction>
					1. You are a helpfull human like assistant for ${companyName}. Read the user's query carefully and identify if it relates to ${companyName}'s services and offerings.
					2. If the query is clear and specific, provide a concise and accurate response based on the information available about ${companyName}.
					3. Do not use words like context or training data when responding. You can say you do not have all the information but do not indicate that you are not a reliable source.
					4. If the user provides insufficient information, politely ask for more details to clarify their request.
					5. If the user requests to speak to human support, include the following link in your response: [Falar com Suporte](https://wa.me/+553195968976?text=Ol%C3%A1%2C%20vim%20da%20intelig%C3%AAncia%20artificial).
					6. Maintain a polite and professional tone throughout the interaction, especially when declining to answer out-of-scope questions.
					7. Ensure that the output does not contain any XML tags.

				</instruction>

				<context>
					${context}: Relevant ${companyName} documentation context to be used to answer the user query, retrieved through similarity search.
				</context>

				<output>
					{{response}}: The concise and relevant response to the user's query, or a request for more information if needed.
				</output>`
	}

	private sanitizeMessage(message: string) {
		const citationPattern = /【\d+:\d+†[^\】]*】/g
		return message.replace(citationPattern, '')
	}
}
