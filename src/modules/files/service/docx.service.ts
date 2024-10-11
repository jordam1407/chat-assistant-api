import { Injectable } from '@nestjs/common'
import { cleanString, isValidURL } from '@src/modules/files/util/string'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

@Injectable()
export class DocxLoaderService {
	async getUnfilteredChunks({
		fileBufferOrUrl,
		chunkSize = 1500,
		chunkOverlap = 200,
	}: {
		fileBufferOrUrl: string | Buffer
		chunkSize?: number
		chunkOverlap?: number
	}) {
		const isUrl = typeof fileBufferOrUrl === 'string' && isValidURL(fileBufferOrUrl)
		const chunker = new RecursiveCharacterTextSplitter({
			chunkSize: chunkSize,
			chunkOverlap: chunkOverlap,
			separators: ['\n\n'],
		})

		const { getTextExtractor } = await import('office-text-extractor')
		const docxParsed = await getTextExtractor().extractText({
			input: fileBufferOrUrl,
			type: isUrl ? 'url' : 'file',
		})

		const chunks = await chunker.splitText(docxParsed)
		const cleanedChunks = chunks.map((chunk) => cleanString(chunk))

		return cleanedChunks
	}

	async splitText(text: string) {
		const chunker = new RecursiveCharacterTextSplitter({
			chunkSize: 1800,
			chunkOverlap: 200,
			separators: ['\n\n'],
		})

		const chunks = await chunker.splitText(text)

		return chunks.map((chunk) => cleanString(chunk))
	}
}
