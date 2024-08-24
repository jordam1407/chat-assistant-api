import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrgRepository } from '@src/modules/organization/data/org.repository'
import { Org, OrgSchema } from '@src/modules/organization/data/org.schema'
import { OrgService } from '@src/modules/organization/service/org.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])],
	controllers: [],
	providers: [OrgService, OrgRepository],
	exports: [OrgService],
})
export class OrgModule {}
