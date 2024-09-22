import { Controller, Get, Req } from '@nestjs/common'
import { UsersService } from './users.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.usersService.getUserById(_id)
	}
}
