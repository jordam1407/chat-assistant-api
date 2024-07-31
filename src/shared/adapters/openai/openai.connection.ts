import { Assistant } from 'openai/resources/beta/assistants'
import { Message, MessagesPage } from 'openai/resources/beta/threads/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'

export interface IOpenAIConnection {
	getAssistantResponse: ({
		threadId,
		assistantId,
	}: {
		threadId: string
		assistantId: string
	}) => Promise<{ message: string; tokens: number }>
	createThread: () => Promise<string>
	createMessage: ({ threadId, message }: { threadId: string; message: string }) => Promise<Message>
	getMessages: ({ threadId }: { threadId: string }) => Promise<MessagesPage>
	createRun: ({ assistantId, threadId }: { assistantId: string; threadId: string }) => Promise<Run>
	createAssistant: ({ companyName }: { companyName: string }) => Promise<Assistant>
}
