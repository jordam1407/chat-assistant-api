import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { GetOrgId } from '@src/core/decorators/get-org-id.decorator'
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

	@Get('findOne')
	async getOrg(@GetOrgId() id: string) {
		console.log(id)
		return this.orgService.findOrgById(id)
	}

	@Public()
	@Get('/start-chat/:orgId')
	async startChat(@Param('orgId') orgId: string) {
		return this.orgService.startChat(orgId)
	}
}
