import { FilesInterceptor } from '@nest-lab/fastify-multer'
import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { Public } from '@src/modules/auth/decorators/auth.decorator'
import { KnowledgeBaseService } from '@src/modules/knowledge-base/service/knowledge-base.service'

@Controller('knowledge-base')
export class KnowledgeBaseController {
	constructor(private readonly knowledgeBaseService: KnowledgeBaseService) {}

	@Public()
	@Post('bulk-add')
	@UseInterceptors(FilesInterceptor('files', 5))
	async addDocuments(@UploadedFiles() files: Array<Express.Multer.File>, @Body() { orgId }: { orgId: string }) {
		return this.knowledgeBaseService.processFiles(files, orgId)
	}

	@Public()
	@Post('query')
	async getVector(@Body() body: { query: string; orgId: string }) {
		return this.knowledgeBaseService.searchVector(body.query, body.orgId)
	}

	@Public()
	@Post('deleteMany')
	async deleteByFileId(@Body() body: { fileId: string }) {
		return this.knowledgeBaseService.deleteByFileId(body.fileId)
	}
}
