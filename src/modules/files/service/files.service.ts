import { Injectable } from '@nestjs/common'
import { DocxLoaderService } from '@src/modules/files/service/docx.service'

@Injectable()
export class FilesService {
	constructor(private readonly docxLoader: DocxLoaderService) {}

	async processDocx(file: Express.Multer.File): Promise<{ chunk?: string[]; error?: string }> {
		try {
			const chunk = await this.docxLoader.getUnfilteredChunks({ fileBufferOrUrl: file.buffer })
			return { chunk }
		} catch (error) {
			console.error(`Error processing file ${file.originalname}:`, error)
			return { error: 'Failed to extract text' }
		}
	}
}
