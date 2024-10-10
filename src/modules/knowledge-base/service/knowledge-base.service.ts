import { Injectable } from '@nestjs/common'
import { InsertChunkData } from '@src/core/types/types'
import { EmbeddingService } from '@src/modules/embeddinng/service/embedding.service'
import { FilesService } from '@src/modules/files/service/files.service'
import { VectorRepository } from '@src/modules/knowledge-base/data/vector.repository'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class KnowledgeBaseService {
	constructor(
		private readonly fileService: FilesService,
		private readonly embeddingService: EmbeddingService,
		private readonly vectorRepo: VectorRepository
	) {}

	async processFiles(files: Array<Express.Multer.File>, orgId: string) {
		const processedChunks: { filename: string; success: boolean }[] = []
		for (const file of files) {
			const currentFileId = uuidv4()
			const { chunk, error } = await this.fileService.processDocx(file)
			console.log(chunk)
			if (error) {
				return
			}
			const embeddings = await this.embeddingService.embedDocuments(chunk)

			const embedChunk = chunk.map((chunk, index) => {
				return <InsertChunkData>{
					id: uuidv4(),
					pageContent: chunk,
					vector: embeddings[index],
					metadata: { fileName: file.originalname, fileId: currentFileId },
				}
			})

			processedChunks.push({
				success: (await this.vectorRepo.insertChunks(embedChunk, orgId)) ? true : false,
				filename: file.originalname,
			})
		}
		return processedChunks
	}

	async searchVector(query: string, orgId: string) {
		const vector = await this.embeddingService.embedQuery(query)
		const searchResult = await this.vectorRepo.similaritySearch(vector, orgId)
		return searchResult
	}

	async deleteByFileId(fileId: string): Promise<void> {
		await this.vectorRepo.deleteByFileId(fileId)
	}

	async getChunkById(id: string) {
		return await this.vectorRepo.getChunkById(id)
	}

	async updateChunkById(id: string, newChunkText: string) {
		const newChunkEmbeding = await this.embeddingService.embedDocuments([newChunkText])

		const newChunk = { pageContent: newChunkText, vector: newChunkEmbeding[0] }

		return await this.vectorRepo.updateChunk(id, newChunk)
	}
}
