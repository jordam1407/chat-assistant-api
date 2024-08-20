import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common'
import { IThreadRequestDto, UsageQueryDto } from '@src/modules/thread/dto/thread.request.dto'
import {
	IFetchAnswerResponse,
	IThreadById,
	IThreadList,
	IThreadService,
	IUsage,
} from '@src/modules/thread/service/thread.interface'
import { ThreadService } from '@src/modules/thread/service/thread.service'

@Controller('thread')
export class ThreadController {
	constructor(@Inject(ThreadService) private readonly threadService: IThreadService) {}

	@Post()
	async createMessage(@Body() body: IThreadRequestDto): Promise<IFetchAnswerResponse> {
		return this.threadService.fetchAnswer(body.message, body.threadId)
	}

	@Get(':id')
	async getThread(@Param('id') threadId: string): Promise<IThreadById> {
		return this.threadService.getThreadById(threadId)
	}

	@Get('list')
	async listThreads(): Promise<IThreadList> {
		return this.threadService.listThreads()
	}

	@Get('usage')
	async getUsage(@Query() query: UsageQueryDto): Promise<IUsage> {
		const { startDate, endDate } = query
		return this.threadService.getUsage({ startDate, endDate })
	}
}
