export type Metadata<T> = T & { fileId: string; fileName: string }

export type InsertChunkData<
	Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
	id: string
	vector: number[]
	pageContent: string
	metadata: Metadata<Meta>
}

export type ExtractChunkData = {
	score: number
	_id: string
	pageContent: string
	fileName: string
	fileId: string
}
