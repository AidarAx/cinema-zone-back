import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Put,
	Query,
	Req,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { IdValidationPipe } from '../pipes/id.validation.pipe'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('profile')
	@Auth()
	async getProfile(@User('_id') _id: string) {
		return this.usersService.getUserById(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@Auth()
	async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
		return this.usersService.updateProfile(_id, dto)
	}

	@Get('count')
	@Auth('admin')
	async getCountUsers() {
		return this.usersService.getCountUsers()
	}

	@Get()
	@Auth('admin')
	async getAllUsers(@Query('searchTerm') searchTerm?: string) {
		return this.usersService.getAllUsers(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async getUser(@Param('id', IdValidationPipe) _id: string) {
		return this.usersService.getUserById(_id)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth('admin')
	async updateUser(
		@Param('id', IdValidationPipe) _id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.usersService.updateProfile(_id, dto)
	}

	@Delete(':id')
	@Auth('admin')
	async deleteUser(@Param('id') _id: string) {
		return this.usersService.deleteUser(_id)
	}
}
