import { Body, Controller, Post } from '@nestjs/common'
import { OrgService } from '@src/modules/organization/service/org.service'

@Controller('org')
export class OrgController {
	constructor(private readonly orgService: OrgService) {}

	@Post()
	async createOrg(@Body() { orgId, subscriptionActive }: { orgId: string; subscriptionActive: boolean }) {
		return this.orgService.createOrg({ orgId, subscriptionActive })
	}
}
