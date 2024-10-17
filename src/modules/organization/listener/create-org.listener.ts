import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrgRepository } from '@src/modules/organization/data/org.repository'
import { CreateOrgEvent } from '@src/modules/organization/events/create-org.event'

@Injectable()
export class CreateOrgListener {
	constructor(private readonly orgRepo: OrgRepository) {}

	@OnEvent('create.org')
	handleCreateOrgEvent(event: CreateOrgEvent) {
		void this.orgRepo.createOrg(event)
	}
}
