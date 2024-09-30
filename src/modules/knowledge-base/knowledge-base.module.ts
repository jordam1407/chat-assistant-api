import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EmbeddingModule } from '@src/modules/embeddinng/embedding.module'
import { FilesModule } from '@src/modules/files/files.module'
import { KnowledgeBaseController } from '@src/modules/knowledge-base/controller/knowledge-base.controller'
import { VectorRepository } from '@src/modules/knowledge-base/data/vector.repository'
import { Vector, VectorSchema } from '@src/modules/knowledge-base/data/vector.schema'
import { KnowledgeBaseService } from '@src/modules/knowledge-base/service/knowledge-base.service'

@Module({
	controllers: [KnowledgeBaseController],
	providers: [KnowledgeBaseService, VectorRepository],
	imports: [MongooseModule.forFeature([{ name: Vector.name, schema: VectorSchema }]), EmbeddingModule, FilesModule],
	exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule {}
