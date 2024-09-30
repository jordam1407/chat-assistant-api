export type Metadata<T> = T & { fileId: string; filename: string }

export type InsertChunkData<
	Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
	vector: number[]
	pageContent: string
	metadata: Metadata<Meta>
}

export type ExtractChunkData<
	Meta extends Record<string, string | number | boolean> = Record<string, string | number | boolean>,
> = {
	score: number
	pageContent: string
	metadata: Metadata<Meta>
}
