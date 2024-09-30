import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { EmbeddingService } from '@src/modules/embeddinng/service/embedding.service'

@Module({
	imports: [ConfigModule],
	controllers: [],
	providers: [EmbeddingService],
	exports: [EmbeddingService],
})
export class EmbeddingModule {}
