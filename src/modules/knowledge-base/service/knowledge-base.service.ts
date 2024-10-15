import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InsertChunkData } from '@src/core/types/types'
import { EmbeddingService } from '@src/modules/embeddinng/service/embedding.service'
import { FilesService } from '@src/modules/files/service/files.service'
import { cleanString } from '@src/modules/files/util/string'
import { VectorRepository } from '@src/modules/knowledge-base/data/vector.repository'
import path from 'path'
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
			let chunkToEmbed: string[]
			let error: string

			const currentFileId = uuidv4()
			if (path.extname(file.originalname) === 'docx') {
				const { chunk, error: processError } = await this.fileService.processDocx(file)
				chunkToEmbed = chunk
				error = processError
			}

			if (path.extname(file.originalname) === 'pdf') {
				const { chunk, error: processError } = await this.fileService.processPdf(file)
				chunkToEmbed = chunk
				error = processError
			}

			if (error) {
				return
			}

			const embeddings = await this.embeddingService.embedDocuments(chunkToEmbed)

			const embedChunk = chunkToEmbed.map((chunk, index) => {
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

	async addNewTextDocument({ orgId, text, title }: { text: string; orgId: string; title: string }) {
		const { chunk, error } = await this.fileService.processText(text)
		if (error) {
			throw new InternalServerErrorException(error)
		}

		const embeddings = await this.embeddingService.embedDocuments(chunk)
		const currentFileId = uuidv4()

		const embedChunk = chunk.map((chunk, index) => {
			return <InsertChunkData>{
				id: uuidv4(),
				pageContent: chunk,
				vector: embeddings[index],
				metadata: { fileName: title, fileId: currentFileId },
			}
		})

		return await this.vectorRepo.insertChunks(embedChunk, orgId)
	}

	async addContextFromYoutubeVideo(url: string, orgId: string, title: string) {
		const { chunk, error } = await this.fileService.processYoutubeVideo(url)
		if (error) {
			throw new InternalServerErrorException(error)
		}

		const embeddings = await this.embeddingService.embedDocuments(chunk)
		const currentFileId = uuidv4()

		const embedChunk = chunk.map((chunk, index) => {
			return <InsertChunkData>{
				id: uuidv4(),
				pageContent: chunk,
				vector: embeddings[index],
				metadata: { fileName: title, fileId: currentFileId },
			}
		})

		return await this.vectorRepo.insertChunks(embedChunk, orgId)
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

	async getAllChunks({ orgId }: { orgId: string }) {
		return await this.vectorRepo.getAllChunks({ orgId })
	}

	async updateChunkById(id: string, newChunkText: string) {
		const newChunkEmbeding = await this.embeddingService.embedDocuments([cleanString(newChunkText)])

		const newChunk = { pageContent: newChunkText, vector: newChunkEmbeding[0] }

		return await this.vectorRepo.updateChunk(id, newChunk)
	}
}
