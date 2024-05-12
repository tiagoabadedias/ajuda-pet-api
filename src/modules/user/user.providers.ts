import { UserSchema } from './user.schema'
import { Connection } from 'mongoose'

export const userProviders = [
  {
    provide: 'UserModel',
    useFactory: (connection: Connection) => connection.model('User', UserSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
