import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OpenAiModule } from '@src/modules/openai/openai.module'
import { ThreadController } from '@src/modules/thread/controller/thread.controller'
import { Thread, ThreadSchema } from '@src/modules/thread/schemas/thread.schema'
import { ThreadService } from '@src/modules/thread/service/thread.service'

@Module({
	imports: [MongooseModule.forFeature([{ name: Thread.name, schema: ThreadSchema }]), OpenAiModule],
	controllers: [ThreadController],
	providers: [ThreadService],

	exports: [ThreadService],
})
export class ThreadModule {}
