import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { UserModel } from '../users/models/user.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { AuthDto } from './dto/auth.dto'
import { compare, genSalt, hash } from 'bcryptjs'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>
	) {}

	async login(dto: AuthDto) {
		const user = await this.userModel.findOne({ email: dto.email })

		if (!user) {
			throw new UnauthorizedException(`Пользователь с таким email не найден`)
		}

		const isValidPassword = await compare(dto.password, user.password)

		if (!isValidPassword) {
			throw new UnauthorizedException('Неверный пароль')
		}

		return user
	}

	async register(dto: AuthDto) {
		const oldUser = await this.userModel.findOne({ email: dto.email })

		if (oldUser) {
			throw new BadRequestException(
				'Пользователь с почтовым адресом ${email} уже существует'
			)
		}

		const salt = await genSalt(10)
		const hashPassword = await hash(dto.password, salt)

		const newUser = await this.userModel.create({
			email: dto.email,
			password: hashPassword,
		})

		return {
			user: newUser,
		}
	}
}
