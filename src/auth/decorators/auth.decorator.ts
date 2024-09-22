import { RoleType } from '../interfaces/auth.interface'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../guards/admin.guard'
import { JwtGuard } from '../guards/jwt.guard'

export const Auth = (role: RoleType = 'user') =>
	applyDecorators(
		role === 'admin' ? UseGuards(JwtGuard, AdminGuard) : UseGuards(JwtGuard)
	)
