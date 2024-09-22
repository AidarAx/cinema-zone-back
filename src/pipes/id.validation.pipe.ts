import {
	ArgumentMetadata,
	BadRequestException,
	PipeTransform,
} from '@nestjs/common'
import { Types } from 'mongoose'

export class IdValidationPipe implements PipeTransform {
	transform(value: string, meta: ArgumentMetadata): string {
		if (meta.type !== 'param') {
			return value
		}

		if (!Types.ObjectId.isValid(value)) {
			throw new BadRequestException('Invalid parameter')
		}

		return value
	}
}
