import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { cleanString, isValidURL } from '@src/modules/files/util/string'

export class PdfLoaderService {
	async getUnfilteredChunks({
		fileBufferOrUrl,
		chunkSize = 1800,
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
		const pdfParsed = await getTextExtractor().extractText({ input: fileBufferOrUrl, type: isUrl ? 'url' : 'file' })

		const chunks = await chunker.splitText(cleanString(pdfParsed))
		const cleanedChunks = chunks.map((chunk) => cleanString(chunk))

		return cleanedChunks
	}
}
