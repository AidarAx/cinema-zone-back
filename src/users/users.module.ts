import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { UserModel } from './models/user.model'
import { ConfigModule } from '@nestjs/config'

@Module({
	providers: [UsersService],
	controllers: [UsersController],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: UserModel,
				schemaOptions: {
					collection: 'users',
				},
			},
		]),
		ConfigModule,
	],
})
export class UsersModule {}
