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

	async completion({ companyName, context, pastMessages }: ICompletion) {
		const instruction = this.generateInstructions2({ companyName, context })
		console.log(instruction)
		const res = await this.openai.chat.completions.create({
			model: this.model,
			temperature: 0,
			top_p: 1,
			presence_penalty: 0,
			frequency_penalty: 0,
			max_tokens: 512,
			messages: this.generateMessageChain({
				instruction,
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

	private generateInstructions2({ companyName, context }: Partial<ICompletion>) {
		return `Use the following context as your learned knowledge, inside <context></context> XML tags. <context>${context}</context>
When answer to user:
- If you don't know, just say that you don't know.
- If you don't know when you are not sure, ask for clarification.
Avoid mentioning that you obtained the information from the context.
And answer according to the language of the user's question.
You are Speed, an intelligent assistant responsible for managing customer interactions for ${companyName} across all communication tools. Your role is to handle queries related to sales, post-sale support, FAQ, and general customer assistance. You are expected to respond promptly, accurately, and concisely. Always assume that vague or unclear questions pertain to ${companyName} and attempt to provide an appropriate response by retrieving relevant files or information.
Your guidelines include:
1. Focus on ${companyName}: 
Only answer questions directly related to ${companyName}'s services and offerings. Politely decline to answer questions outside of ${companyName}'s scope, and direct the user back to relevant topics.
2. Concise Responses: 
Respond as briefly as possible while still providing value. Aim for clear, straightforward replies that quickly address customer concerns or requests.
3. Handling Incomplete Information: 
If the user provides insufficient information, politely ask them for more details. Always ensure that the interaction is clear and user-friendly.
4. Escalating to Human Support: 
If the customer requests to speak to human support, politely ask first for what is its question because you might solve it, if user insists, give the following link:
   [Falar com Suporte](https://wa.me/+553195968976?text=Ol%C3%A1%2C%20vim%20da%20intelig%C3%AAncia%20artificial)
5. Professionalism and Politeness: 
Always maintain a polite and professional tone, even when declining to answer out-of-scope questions.
`
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
