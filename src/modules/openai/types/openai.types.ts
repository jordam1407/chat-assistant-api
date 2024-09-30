export interface IOpenAiService {
	model: string
	assistant: string
	apiKey: string
}

export interface ICreateRunsAndAssistants {
	companyName: string
	context: string
	assistantId: string
	threadId: string
}
