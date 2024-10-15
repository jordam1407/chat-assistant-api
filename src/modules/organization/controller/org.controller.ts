import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { Public } from '@src/modules/auth/decorators/auth.decorator'
import { IOrg } from '@src/modules/organization/data/org.schema'
import { OrgService } from '@src/modules/organization/service/org.service'

@Controller('org')
export class OrgController {
	constructor(private readonly orgService: OrgService) {}

	@Post()
	async createOrg(@Body() data: Partial<IOrg>) {
		return this.orgService.createOrg(data)
	}

	@Get(':id')
	async getOrg(@Query() orgId: string) {
		return this.orgService.findOrgById(orgId)
	}

	@Public()
	@Get('/start-chat/:orgId')
	async startChat(@Param('orgId') orgId: string) {
		return this.orgService.startChat(orgId)
	}
}
