import { DataSchema } from './data.schema'
import { Connection } from 'mongoose'

export const dataProviders = [
  {
    provide: 'DataModel',
    useFactory: (connection: Connection) =>
      connection.model('Data', DataSchema),
    inject: ['DATABASE_CONNECTION'],
  },
]
