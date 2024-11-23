export default () => ({
	openaiApiKey: process.env.OPENAI_API_KEY,
	hfApiKey: process.env.HF_API_KEY,
	openAiAssistantModel: process.env.OPENAI_ASSISTANT_MODEL,
	jwtAcessSecret: process.env.JWT_ACCESS_SECRET,
	jwtAcessTtl: process.env.JWT_ACCESS_TTL,
	jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
	jwtRefreshTtlDays: process.env.JWT_REFRESH_TTL_DAYS,
})
