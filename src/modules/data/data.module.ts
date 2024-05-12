import { RequestFactoryModule } from '../shared/requestFactory/requestFactory.module'
import { DatabaseModule } from '../shared/database/database.module'
import { LoggerService } from '../shared/logger/logger.service'
import { HelperModule } from '../shared/helper/helper.module'
import { Module, forwardRef } from '@nestjs/common'
import { DataRepository } from './data.repository'
import { DataController } from './data.controller'
import { AuthModule } from '../auth/auth.module'
import { DataService } from './data.service'
import { JwtModule } from '@nestjs/jwt'
import { dataProviders } from './data.providers'
import { DataMapper } from './dto/data.mapper'

@Module({
  imports: [
    DatabaseModule,
    HelperModule,
    RequestFactoryModule,
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_TOKEN,
      signOptions: {
        expiresIn: Number(process.env.SECRET_TIME_ACCESS_TOKEN),
      },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [DataController],
  providers: [
    DataService,
    DataRepository,
    LoggerService,
    DataMapper,
    ...dataProviders,
  ],
  exports: [DataService, DataRepository],
})
export class DataModule {}
