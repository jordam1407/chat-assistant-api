import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetOrgId = createParamDecorator((data: unknown, context: ExecutionContext) => {
	const request = context.switchToHttp().getRequest()
	const user = request?.user

	if (!user) return null

	return user['orgId'] ?? null
})
