import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { OrgRepository } from '@src/modules/organization/data/org.repository'
import { ConsumeCreditEvent } from '@src/modules/organization/events/consume-credit.event'

@Injectable()
export class ConsumeCreditListener {
	constructor(private readonly orgRepo: OrgRepository) {}

	@OnEvent('consume.credit')
	handleConsumeCreditEvent(event: ConsumeCreditEvent) {
		void this.orgRepo.consumeCredit(event.orgId)
	}
}
