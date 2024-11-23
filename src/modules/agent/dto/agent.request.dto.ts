import { ObjectiveEnum, ToneEnum } from '@src/modules/agent/types/core.types'

export class IAgentRequestDto {
	name: string
	tone: ToneEnum
	objective: ObjectiveEnum
	systemPrompt: string
	organizationId: string
}
