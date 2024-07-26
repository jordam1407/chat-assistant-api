import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

export class FastifyConfig {
	static async createService(appModule) {
		return NestFactory.create<NestFastifyApplication>(appModule, new FastifyAdapter())
	}
}
