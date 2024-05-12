import { RequestFactoryModule } from '../shared/requestFactory/requestFactory.module'
import { LoggerModule } from '../shared/logger/logger.module'
import { HelperModule } from '../shared/helper/helper.module'
import { forwardRef, Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../user/user.module'
import { AuthMapper } from './dto/auth.mapper'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => LoggerModule),
    forwardRef(() => UserModule),
    forwardRef(() => RequestFactoryModule),
    HelperModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_TOKEN,
      signOptions: {
        expiresIn: Number(process.env.SECRET_TIME_ACCESS_TOKEN),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthMapper],
  exports: [AuthService],
})
export class AuthModule {}
