import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common'
import { GetOrgId } from '@src/core/decorators/get-org-id.decorator'
import { Public } from '@src/modules/auth/decorators/auth.decorator'
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

	@Public()
	@Post()
	async createMessage(@Body() { message, orgId, threadId }: IThreadRequestDto): Promise<IFetchAnswerResponse> {
		return this.threadService.fetchAnswer({ message, orgId, tId: threadId })
	}

	@Public()
	@Get(':id')
	async getThread(@Param('id') threadId: string): Promise<IThreadById> {
		return this.threadService.getThreadById(threadId)
	}

	@Get('list')
	async listThreads(@GetOrgId() orgId: string): Promise<IThreadList> {
		return this.threadService.listThreads(orgId)
	}

	@Get('usage')
	async getUsage(@Query() query: UsageQueryDto, @GetOrgId() orgId: string): Promise<IUsage> {
		const { startDate, endDate } = query
		return this.threadService.getUsage({ startDate, endDate, orgId })
	}
}
