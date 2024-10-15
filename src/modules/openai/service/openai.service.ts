import { Logger } from '@nestjs/common'
import { ICompletion } from '@src/modules/openai/types/openai.types'
import { IMessage } from '@src/modules/thread/types/core.types'
import { OpenAI } from 'openai'
import { ChatCompletionMessageParam } from 'openai/src/resources/index.js'

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

	async completion({ pastMessages, customInstruction }: ICompletion) {
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

		return {
			output: res.choices[0].message.content,
			tokens: res.usage.total_tokens,
		}
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
		const messageChain = []

		if (instruction) {
			messageChain.push({ content: instruction, role: 'system' })
		}
		if (pastMessages.length) {
			messageChain.push(...pastMessages)
		}
		return messageChain
	}
}
