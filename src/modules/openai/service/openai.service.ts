import { Logger } from '@nestjs/common'
import { IMessage } from '@src/modules/thread/types/core.types'
import { OpenAI } from 'openai'
import { ChatCompletionMessageParam } from 'openai/src/resources/index.js'

export class OpenAiService {
	private openai: OpenAI
	private model: string
	private readonly logger = new Logger(OpenAiService.name)

	constructor() {
		this.openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
		})
		this.model = 'gpt-4o-mini-2024-07-18'
	}

	async queryClassification(message: IMessage): Promise<boolean> {
		const res = await this.openai.chat.completions.create({
			model: this.model,
			temperature: 0,
			top_p: 1,
			presence_penalty: 0,
			frequency_penalty: 0,
			max_tokens: 512,
			messages: this.generateMessageChain({
				instruction:
					'Classify the query as either needing context or being a common conversation, such as greetings or small talk. Return in JSON format: {"shouldRetrieve": boolean}.',
				pastMessages: [message],
			}),
		})

		const content = res.choices[0].message.content
		this.logger.debug(`Classification result: ${content}`)
		return JSON.parse(content).shouldRetrieve
	}

	async completion({
		pastMessages,
		customInstruction,
	}: {
		pastMessages: IMessage[]
		customInstruction: string
	}): Promise<{ output: string; tokens: number }> {
		const res = await this.openai.chat.completions.create({
			model: this.model,
			temperature: 0,
			top_p: 1,
			presence_penalty: 0,
			frequency_penalty: 0,
			max_tokens: 512,
			messages: this.generateMessageChain({
				instruction: customInstruction,
				pastMessages,
			}),
		})

		const output = res.choices[0].message.content
		const tokens = res.usage?.total_tokens || 0

		this.logger.debug(`Generated response: ${output}, Tokens used: ${tokens}`)
		return { output, tokens }
	}

	async getMessages({ threadId }: { threadId: string }) {
		return await this.openai.beta.threads.messages.list(threadId)
	}

	private generateMessageChain({
		instruction,
		pastMessages = [],
	}: {
		instruction: string
		pastMessages?: IMessage[]
	}): ChatCompletionMessageParam[] {
		const messageChain: ChatCompletionMessageParam[] = []

		if (instruction) {
			messageChain.push({ role: 'system', content: instruction })
		}

		if (pastMessages.length) {
			messageChain.push(
				...pastMessages.map((msg) => ({
					role: msg.role,
					content: msg.content,
				}))
			)
		}
		return messageChain
	}
}
