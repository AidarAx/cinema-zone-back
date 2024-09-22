import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export interface UserModel extends Base {}

export class UserModel extends TimeStamps {
  @prop({ unique: true, required: true })
  email: string

  @prop({ required: true })
  password: string

  @prop({ default: false })
  isAdmin: boolean

  @prop({ default: [] })
  favorites?: []
}
