import { ConfigService } from '@nestjs/config'
import { TypegooseModuleOptions } from 'nestjs-typegoose'

export const getMongoDbConfig = async (
  configServices: ConfigService
): Promise<TypegooseModuleOptions> => ({
  uri: configServices.get('MONGODB_URI'),
})
