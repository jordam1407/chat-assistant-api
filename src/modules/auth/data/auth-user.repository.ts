import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AuthUser } from '@src/modules/auth/data/auth-user.schema'
import { IAuthAccount, ICreateAccount } from '@src/modules/auth/types/auth.types'
import { Model, Types } from 'mongoose'

@Injectable()
export class AuthUserRepository {
	constructor(@InjectModel(AuthUser.name) private authUserRepo: Model<AuthUser>) {}

	async findById(userId: string) {
		return await this.authUserRepo.findOne({ _id: new Types.ObjectId(userId) })
	}

	async findByEmail(email: string) {
		return await this.authUserRepo.findOne({ email })
	}

	async updateToken(userId: string, refreshToken: string) {
		return await this.authUserRepo.updateOne({ _id: new Types.ObjectId(userId) }, { refreshToken })
	}

	async updateById(userId: string, data: Partial<IAuthAccount>) {
		return await this.authUserRepo.updateOne({ _id: new Types.ObjectId(userId) }, data)
	}

	async create(data: ICreateAccount) {
		return await this.authUserRepo.create(data)
	}

	async listByOrg(id: string) {
		return await this.authUserRepo.find({ organizationId: id }).select(['-password', '-refreshToken', '-__v'])
	}
}
