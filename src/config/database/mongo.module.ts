import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

/**
 * If you wan't to run this manually, please ask the .env for this URI
 */
@Module({
	imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_CONNECTION_URI)],
})
export class MongoModule {}
