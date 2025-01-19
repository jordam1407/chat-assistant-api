import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ObjectiveController } from '@src/modules/objective/controller/objective.controller'
import { ObjectiveRepository } from '@src/modules/objective/data/objective.repository'
import { Objective, ObjectiveSchema } from '@src/modules/objective/data/objective.schema'
import { ObjectiveService } from '@src/modules/objective/service/objective.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Objective.name, schema: ObjectiveSchema }])],
	controllers: [ObjectiveController],
	providers: [ObjectiveService, ObjectiveRepository],

	exports: [ObjectiveService, ObjectiveRepository],
})
export class ObjectiveModule {}
