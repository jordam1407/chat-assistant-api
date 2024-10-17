import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
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

	async updateSubscription(id: string, data: Pick<Org, 'subscriptionActive'>) {
		return await this.orgRepo.updateSubscription(id, data)
	}

	async startChat(id: string) {
		const org = await this.findOrgById(id)
		this.startChatValidation(org)
		return org
	}

	private startChatValidation(org: Org) {
		if (!org) {
			throw new NotFoundException()
		}

		if (!org.subscriptionActive) {
			throw new ForbiddenException('Subscription inactive')
		}

		if (org.credits < 1) {
			throw new ForbiddenException('You are out of credits')
		}
	}
}
