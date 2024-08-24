import { Injectable } from '@nestjs/common'
import { OrgRepository } from '@src/modules/organization/data/org.repository'
import { Org } from '@src/modules/organization/data/org.schema'

@Injectable()
export class OrgService {
	constructor(private readonly orgRepo: OrgRepository) {}

	async createOrg(data: Partial<Org>) {
		return await this.orgRepo.createOrg(data)
	}

	async findOrgById(id: string) {
		return await this.orgRepo.findOrgById(id)
	}

	async updateBrand(id: string, data: Pick<Org, 'baseColor' | 'logo'>) {
		return await this.orgRepo.updateBrand(id, data)
	}

	async updateAssistant(id: string, data: Pick<Org, 'assistantId'>) {
		return await this.orgRepo.updateAssistant(id, data)
	}

	async updateSubscription(id: string, data: Pick<Org, 'subscriptionActive'>) {
		return await this.orgRepo.updateSubscription(id, data)
	}
}
