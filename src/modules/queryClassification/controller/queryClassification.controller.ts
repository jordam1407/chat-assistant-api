import { Body, Controller, Post } from '@nestjs/common'
import { Public } from '@src/modules/auth/decorators/auth.decorator'
import { QueryClassificationService } from '@src/modules/queryClassification/service/queryClassification.service'

@Controller('query-class')
export class QueryClassificationController {
	constructor(private queryClassService: QueryClassificationService) {}

	@Public()
	@Post()
	async getQueries(@Body() body: { text: string; orgId: string }) {
		return await this.queryClassService.processQuery(body.text, body.orgId)
	}
}
