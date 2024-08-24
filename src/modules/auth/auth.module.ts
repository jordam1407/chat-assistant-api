import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './service/auth.service'
import { AuthGuard } from './guard/auth.guard'
import { AuthController } from './controller/auth.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthUser, AuthUserSchema } from '@src/modules/auth/data/auth-user.schema'
import { AuthUserRepository } from '@src/modules/auth/data/auth-user.repository'
import { OrgModule } from '@src/modules/organization/org.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: AuthUser.name, schema: AuthUserSchema }]),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_ACCESS_SECRET,
			signOptions: { expiresIn: '60s' },
		}),
		OrgModule,
	],
	providers: [
		AuthService,
		AuthUserRepository,
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
	controllers: [AuthController],
	exports: [AuthService, AuthUserRepository],
})
export class AuthModule {}
