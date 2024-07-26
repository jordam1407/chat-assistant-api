import { Module } from '@nestjs/common'
import { AppController } from '@src/modules/assistants/controller/app.controller'
import { AppService } from '@src/modules/assistants/service/app.service'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService],

	exports: [AppService],
})
export class AssistantsModule {}
