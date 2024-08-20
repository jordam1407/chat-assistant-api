import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { OpenAiService } from '@src/modules/openai/service/openai.service'

@Module({
	imports: [ConfigModule],
	controllers: [],
	providers: [OpenAiService],
	exports: [OpenAiService],
})
export class OpenAiModule {}
