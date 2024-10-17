import { IOrg } from '@src/modules/organization/data/org.schema'

export class CreateOrgEvent implements IOrg {
	assistantName?: string
	baseColor?: string
	expireAt?: Date
	logo?: string
	orgId: string
	orgName?: string
	subscriptionActive: boolean
	credits?: number
	instruction?: string
	support?: string

	constructor(org: IOrg) {
		Object.assign(this, org)
	}
}
