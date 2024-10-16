import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrgController } from '@src/modules/organization/controller/org.controller'
import { OrgRepository } from '@src/modules/organization/data/org.repository'
import { Org, OrgSchema } from '@src/modules/organization/data/org.schema'
import { ConsumeCreditListener } from '@src/modules/organization/listener/consume-credit.listener'
import { OrgService } from '@src/modules/organization/service/org.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Org.name, schema: OrgSchema }])],
	controllers: [OrgController],
	providers: [OrgService, OrgRepository, ConsumeCreditListener],
	exports: [OrgService],
})
export class OrgModule {}
