import { ApiRequestContext } from './modules/shared/contextRequest/contextRequest.interface'
import { RequestContextModule } from '@medibloc/nestjs-request-context'
import { LoggerModule } from './modules/shared/logger/logger.module'
import { JwtStrategy } from './modules/shared/jwt/jwt-strategy'
import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { PassportModule } from '@nestjs/passport'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { DataModule } from './modules/data/data.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    DataModule,
    LoggerModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.SECRET_ACCESS_TOKEN,
    }),
    RequestContextModule.forRoot({
      contextClass: ApiRequestContext,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}
