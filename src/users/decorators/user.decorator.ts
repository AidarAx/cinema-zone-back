import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { UserModel } from '../models/user.model'

export type DataType = keyof UserModel

export const User = createParamDecorator(
	(data: DataType, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user

		return data ? user[data] : user
	}
)
