import { Module } from '@nestjs/common'
import { DocxLoaderService } from '@src/modules/files/service/docx.service'
import { FilesService } from '@src/modules/files/service/files.service'

@Module({
	controllers: [],
	providers: [FilesService, DocxLoaderService],
	exports: [FilesService],
})
export class FilesModule {}
