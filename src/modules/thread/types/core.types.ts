export type IMessage = {
	id: string
	timestamp: Date
	content: string
	role: 'user' | 'assistant'
	sources?: ISourceDetail[]
}

export type ISourceDetail = {
	chunkId: string
	filename: string
	fileId: string
}
