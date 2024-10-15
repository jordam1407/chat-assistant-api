import { Module } from '@nestjs/common'
import { DocxLoaderService } from '@src/modules/files/service/docx.service'
import { FilesService } from '@src/modules/files/service/files.service'
import { PdfLoaderService } from '@src/modules/files/service/pdf.service'
import { YoutubeLoaderService } from '@src/modules/files/service/youtube.service'

@Module({
	controllers: [],
	providers: [FilesService, DocxLoaderService, YoutubeLoaderService, PdfLoaderService],
	exports: [FilesService],
})
export class FilesModule {}
