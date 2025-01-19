import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ToneController } from '@src/modules/tone/controller/tone.controller'
import { ToneRepository } from '@src/modules/tone/data/tone.repository'
import { Tone, ToneSchema } from '@src/modules/tone/data/tone.schema'
import { ToneService } from '@src/modules/tone/service/tone.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Tone.name, schema: ToneSchema }])],
	controllers: [ToneController],
	providers: [ToneService, ToneRepository],

	exports: [ToneService, ToneRepository],
})
export class ToneModule {}
