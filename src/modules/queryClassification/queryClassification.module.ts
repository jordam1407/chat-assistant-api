import { Module } from '@nestjs/common'
import { EmbeddingModule } from '@src/modules/embeddinng/embedding.module'
import { KnowledgeBaseModule } from '@src/modules/knowledge-base/knowledge-base.module'
import { QueryClassificationController } from '@src/modules/queryClassification/controller/queryClassification.controller'
import { QueryClassificationService } from '@src/modules/queryClassification/service/queryClassification.service'

@Module({
	controllers: [QueryClassificationController],
	imports: [KnowledgeBaseModule, EmbeddingModule],
	providers: [QueryClassificationService],
	exports: [QueryClassificationService],
})
export class QueryClassificationModule {}
