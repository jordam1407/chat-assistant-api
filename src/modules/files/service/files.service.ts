import { Injectable } from '@nestjs/common'
import { DocxLoaderService } from '@src/modules/files/service/docx.service'
import { PdfLoaderService } from '@src/modules/files/service/pdf.service'
import { YoutubeLoaderService } from '@src/modules/files/service/youtube.service'

@Injectable()
export class FilesService {
	constructor(
		private readonly docxLoader: DocxLoaderService,
		private readonly pdfLoader: PdfLoaderService,
		private readonly youtubeLoader: YoutubeLoaderService
	) {}

	async processDocx(file: Express.Multer.File): Promise<{ chunk?: string[]; error?: string }> {
		try {
			const chunk = await this.docxLoader.getUnfilteredChunks({ fileBufferOrUrl: file.buffer })
			return { chunk }
		} catch (error) {
			console.error(`Error processing file ${file.originalname}:`, error)
			return { error: 'Failed to extract text' }
		}
	}

	async processPdf(file: Express.Multer.File): Promise<{ chunk?: string[]; error?: string }> {
		try {
			const chunk = await this.pdfLoader.getUnfilteredChunks({ fileBufferOrUrl: file.buffer })
			return { chunk }
		} catch (error) {
			console.error(`Error processing file ${file.originalname}:`, error)
			return { error: 'Failed to extract text' }
		}
	}

	async processText(text: string) {
		try {
			const chunk = await this.docxLoader.splitText(text)
			return { chunk }
		} catch (error) {
			console.error(`Error processing chunk`, error)
			return { error: 'Failed to extract text' }
		}
	}

	async processYoutubeVideo(url: string) {
		try {
			const chunk = await this.youtubeLoader.getUnfilteredChunks({ videoIdOrUrl: url })
			return { chunk }
		} catch (error) {
			console.error(`Error processing chunk`, error)
			return { error: 'Failed to extract text from youtube video' }
		}
	}
}
