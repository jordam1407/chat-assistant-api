import { cleanString } from '@src/modules/files/util/string'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { YoutubeTranscript } from 'youtube-transcript'

export class YoutubeLoaderService {
	async getUnfilteredChunks({
		videoIdOrUrl,
		chunkSize = 1800,
		chunkOverlap = 200,
	}: {
		videoIdOrUrl: string
		chunkSize?: number
		chunkOverlap?: number
	}) {
		const chunker = new RecursiveCharacterTextSplitter({
			chunkSize: chunkSize,
			chunkOverlap: chunkOverlap,
			separators: ['\n\n'],
		})

		const transcripts = await YoutubeTranscript.fetchTranscript(videoIdOrUrl, { lang: 'pt' })

		const fullTranscript = transcripts.map((t) => t.text).join('\n\n')
		const chunks = await chunker.splitText(fullTranscript)
		const cleanedChunks = chunks.map((chunk) => cleanString(chunk))

		return cleanedChunks
	}
}
