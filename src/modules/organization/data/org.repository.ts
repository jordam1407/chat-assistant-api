import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Org } from '@src/modules/organization/data/org.schema'
import { Model } from 'mongoose'

@Injectable()
export class OrgRepository {
	constructor(@InjectModel(Org.name) private readonly orgRepo: Model<Org>) {}

	async createOrg(data: Partial<Org>) {
		return await this.orgRepo.create(data)
	}

	async findOrgById(id: string) {
		return await this.orgRepo.findOne({ orgId: id })
	}

	async updateBrand(id: string, data: Pick<Org, 'baseColor' | 'logo'>) {
		return await this.orgRepo.updateOne({ orgId: id }, data)
	}

	async updateAssistant(id: string, data: Pick<Org, 'assistantId'>) {
		return await this.orgRepo.updateOne({ orgId: id }, data)
	}

	async updateSubscription(id: string, data: Pick<Org, 'subscriptionActive'>) {
		return await this.orgRepo.updateOne({ orgId: id }, data)
	}
}
