import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class IThreadRequestDto {
	message: string
	threadId?: string
}

export class UsageQueryDto {
	@IsOptional()
	@Transform(({ value }) => {
		const date = new Date(value)
		date.setUTCHours(0, 0, 0, 0)
		return date
	})
	startDate?: Date

	@IsOptional()
	@Transform(({ value }) => {
		const date = new Date(value)
		date.setUTCHours(23, 59, 59, 999)
		return date
	})
	endDate?: Date
}
