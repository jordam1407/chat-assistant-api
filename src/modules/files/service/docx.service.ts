import { Injectable } from '@nestjs/common'
import { cleanString, isValidURL } from '@src/modules/files/util/string'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

@Injectable()
export class DocxLoaderService {
	async getUnfilteredChunks({
		fileBufferOrUrl,
		chunkSize = 1500,
		chunkOverlap = 0,
	}: {
		fileBufferOrUrl: string | Buffer
		chunkSize?: number
		chunkOverlap?: number
	}) {
		const isUrl = typeof fileBufferOrUrl === 'string' && isValidURL(fileBufferOrUrl)
		const chunker = new RecursiveCharacterTextSplitter({
			chunkSize: chunkSize,
			chunkOverlap: chunkOverlap,
		})

		const { getTextExtractor } = await import('office-text-extractor')
		const docxParsed = await getTextExtractor().extractText({
			input: fileBufferOrUrl,
			type: isUrl ? 'url' : 'file',
		})

		const cleanedText = cleanString(docxParsed)
		const chunks = await chunker.splitText(cleanedText)

		return chunks
	}
}
