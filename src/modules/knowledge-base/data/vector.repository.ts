import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Vector } from './vector.schema'
import { InsertChunkData, ExtractChunkData } from '@src/core/types/types'

@Injectable()
export class VectorRepository {
	private readonly logger = new Logger(VectorRepository.name)

	constructor(@InjectModel(Vector.name) private readonly vectorModel: Model<Vector>) {}

	async insertChunks(chunks: InsertChunkData[], orgId: string): Promise<number> {
		this.logger.debug(`Inserting ${chunks.length} chunks`)
		const insertResult = await this.vectorModel.insertMany(
			chunks.map((chunk) => ({
				fileId: chunk.metadata.fileId,
				fileName: chunk.metadata.fileName,
				vector: chunk.vector,
				pageContent: chunk.pageContent,
				organizationId: orgId,
			}))
		)
		return insertResult.length
	}

	async similaritySearch(query: number[], orgId: string): Promise<ExtractChunkData[]> {
		this.logger.debug(`Performing similarity search with vector size ${query.length}`)
		const result = await this.vectorModel.aggregate([
			{
				$vectorSearch: {
					index: 'vector_index',
					filter: { organizationId: orgId },
					path: 'vector',
					queryVector: query,
					numCandidates: 100,
					limit: 5,
				},
			},
			{
				$project: {
					_id: 1,
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

	async getChunkById(chunkId: string) {
		return await this.vectorModel.findById(chunkId)
	}

	async updateChunk(chukId: string, newChunk: Pick<InsertChunkData, 'pageContent' | 'vector'>) {
		return await this.vectorModel.findByIdAndUpdate(
			chukId,
			{
				vector: newChunk.vector,
				pageContent: newChunk.pageContent,
			},
			{ new: true, runValidators: true }
		)
	}

	async getVectorCount(): Promise<number> {
		return this.vectorModel.countDocuments()
	}

	async deleteByFileId(fileId: string): Promise<boolean> {
		this.logger.debug(`Deleting vectors for fileId: ${fileId}`)
		const result = await this.vectorModel.deleteMany({ fileId: fileId })
		return result.deletedCount > 0
	}

	async reset(): Promise<void> {
		this.logger.debug(`Resetting vector collection`)
		await this.vectorModel.deleteMany({})
	}
}
