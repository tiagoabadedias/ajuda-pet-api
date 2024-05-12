import { RequestFactoryModule } from '../shared/requestFactory/requestFactory.module'
import { DatabaseModule } from '../shared/database/database.module'
import { LoggerService } from '../shared/logger/logger.service'
import { HelperModule } from '../shared/helper/helper.module'
import { Module, forwardRef } from '@nestjs/common'
import { UserRepository } from './user.repository'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'
import { userProviders } from './user.providers'
import { UserMapper } from './dto/user.mapper'
import { UserService } from './user.service'
import { JwtModule } from '@nestjs/jwt'

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
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserMapper,
    LoggerService,
    ...userProviders,
  ],
  exports: [UserService, UserRepository, UserMapper],
})
export class UserModule {}
