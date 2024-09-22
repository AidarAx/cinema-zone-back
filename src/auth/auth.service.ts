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
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dto/refreshToken.dto'

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
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

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens,
		}
	}

	async register(dto: AuthDto) {
		const existingUser = await this.userModel.findOne({ email: dto.email })

		if (existingUser) {
			throw new BadRequestException(
				`Пользователь с почтовым адресом ${dto.email} уже существует`
			)
		}

		const salt = await genSalt(10)
		const hashedPassword = await hash(dto.password, salt)

		const newUser = await this.userModel.create({
			email: dto.email,
			password: hashedPassword,
		})

		const tokens = await this.issueTokenPair(String(newUser._id))

		return {
			user: this.getUserFields(newUser),
			...tokens,
		}
	}

	async getNewTokens({ refreshToken }: RefreshTokenDto) {
		if (!refreshToken) {
			throw new UnauthorizedException('Пожалуйста авторизуйтесь')
		}

		const result = await this.jwtService.verifyAsync(refreshToken)

		if (!result) {
			throw new UnauthorizedException('Токен не валидный')
		}

		const user = await this.userModel.findById(result._id)

		const tokens = await this.issueTokenPair(String(user._id))

		return {
			user: this.getUserFields(user),
			...tokens,
		}
	}

	async issueTokenPair(userId: string) {
		const data = { _id: userId }

		const refreshToken = await this.jwtService.signAsync(data, {
			expiresIn: '14d',
		})

		const accessToken = await this.jwtService.signAsync(data, {
			expiresIn: '1h',
		})

		return { refreshToken, accessToken }
	}

	getUserFields(user: UserModel) {
		return {
			id: user._id,
			email: user.email,
			isAdmin: user.isAdmin,
		}
	}
}
