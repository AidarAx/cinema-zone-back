import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from './models/user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}

	async getUserById(_id: string): Promise<UserModel> {
		const user = await this.userModel.findById(_id)

		if (!user) {
			throw new NotFoundException(`Пользователь не найден`)
		}

		return user
	}
}
