import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Vector } from './vector.schema'
import { InsertChunkData, ExtractChunkData } from '@src/core/types/types'

@Injectable()
export class VectorRepository {
	private readonly logger = new Logger(VectorRepository.name)

	constructor(@InjectModel(Vector.name) private readonly vectorModel: Model<Vector>) {}

	async insertChunks(chunks: InsertChunkData[]): Promise<number> {
		this.logger.debug(`Inserting ${chunks.length} chunks`)
		const insertResult = await this.vectorModel.insertMany(
			chunks.map((chunk) => ({
				fileId: chunk.metadata.fileId,
				fileName: chunk.metadata.filename,
				vector: chunk.vector,
				pageContent: chunk.pageContent,
			}))
		)
		return insertResult.length
	}

	async similaritySearch(query: number[]): Promise<ExtractChunkData[]> {
		this.logger.debug(`Performing similarity search with vector size ${query.length}`)

		const result = await this.vectorModel.aggregate([
			{
				$vectorSearch: {
					index: 'vector_index',
					path: 'vector',
					queryVector: query,
					numCandidates: 12,
					limit: 6,
				},
			},
			{
				$project: {
					_id: 0,
					pageContent: 1,
					fileName: 1,
					fileId: 1,
					score: {
						$meta: 'vectorSearchScore',
					},
				},
			},
		])

		return result
	}

	async getVectorCount(): Promise<number> {
		return this.vectorModel.countDocuments()
	}

	async deleteByFileId(fileId: string): Promise<boolean> {
		this.logger.debug(`Deleting vectors for fileId: ${fileId}`)
		const result = await this.vectorModel.deleteMany({ 'metadata.fileId': fileId })
		return result.deletedCount > 0
	}

	async reset(): Promise<void> {
		this.logger.debug(`Resetting vector collection`)
		await this.vectorModel.deleteMany({})
	}
}
