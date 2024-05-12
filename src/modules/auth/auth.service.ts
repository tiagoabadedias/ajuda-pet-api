import {
  AuthTokenDto,
  AuthForgotPasswordDto,
  AuthRecoverPasswordDto,
  AuthCredentialsDto,
  AuthVerifyTokenDto,
} from './dto/auth.dto'
import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { LoggerService } from '../shared/logger/logger.service'
import { UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { randomBytes } from 'crypto'
import jwt_decode from 'jwt-decode'
import { AuthMapper } from './dto/auth.mapper'
import * as bcrypt from 'bcrypt'
import moment = require('moment')

@Injectable()
export class AuthService {
  private _resetTokenExpiration
  private _recoverPasswordUrl

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly _userService: UserService,
    @Inject(forwardRef(() => LoggerService))
    private readonly _loggerService: LoggerService,
    private readonly _mapper: AuthMapper,
    private readonly _jwtService: JwtService,
    private readonly jwtService: JwtService,
  ) {
    this._resetTokenExpiration = parseInt(process.env.RESET_TOKEN_EXPIRATION)
    this._recoverPasswordUrl = process.env.RECOVER_PASSWORD_URL
  }

  /* ----- Main Methods ----- */

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    this._loggerService.log('auth.service signIn')

    const user = await this._userService.getUserEntityByEmail(
      authCredentialsDto.email,
    )

    if (!user) {
      throw new UnauthorizedException(
        'The email or password provided is invalid',
      )
    } else {
      this._loggerService.log('auth.service signIn ' + user)

      const isValidPassword = await bcrypt.compare(
        authCredentialsDto.password,
        user.password,
      )
      if (!isValidPassword) {
        throw new UnauthorizedException(
          'The email or password provided is invalid',
        )
      }

      let userToken = {
        email: authCredentialsDto.email,
        name: user.name,
        id: user.id,
      }

      const accessToken = this.jwtService.sign(userToken)

      return { accessToken }
    }
  }
  async createAuth(user: any) {
    const accessToken = await this._jwtService.sign(user)

    const refresh = await this.generateRefreshToken(user._id.toHexString())

    return { accessToken, refreshToken: refresh.refreshToken }
  }

  public async generateRefreshToken(UserId: string): Promise<any> {
    const refreshToken = await this._jwtService.sign(
      { user: { id: UserId } },
      {
        secret: process.env.SECRET_ACCESS_TOKEN,
        expiresIn: Number(process.env.SECRET_TIME_ACCESS_TOKEN),
      },
    )
    const refreshTokenExp = moment(new Date())
      .add(2, 'minute')
      .format('YYYY/MM/DD HH:mm:ss')

    return { refreshToken, refreshTokenExp }
  }

  // Deprecated Method!
  async createTokenUnlimited(
    authTokenDto: AuthTokenDto,
  ): Promise<AuthCredentialsDto> {
    let tokenDecode
    const verifyToken = await this.verifyToken(authTokenDto)

    if (verifyToken.isValid) {
      try {
        tokenDecode = jwt_decode(authTokenDto.externalToken)
      } catch (error) {
        throw new UnauthorizedException(error)
      }

      const token = this._jwtService.sign(
        { user: tokenDecode.user },
        { expiresIn: '999y' },
      )
      tokenDecode.accessToken = token
      delete tokenDecode.user.email
      delete tokenDecode.exp
      delete tokenDecode.iat
      return tokenDecode
    } else {
      throw new UnauthorizedException('Invalid token.')
    }
  }

  async verifyToken(payload: AuthTokenDto): Promise<AuthVerifyTokenDto> {
    try {
      const { externalToken: token } = payload

      return this._mapper.mapTokenVerificationResponse(payload)
    } catch (error) {
      throw new UnauthorizedException(error)
    }
  }

  async forgotPassword(
    payload: AuthForgotPasswordDto,
  ): Promise<Record<string, any>> {
    const { email } = payload

    const response = { processed: true }

    const user = await this._userService.getUserEntityByEmail(email)

    if (!user) return response

    const { resetPasswordToken, expirationTime } =
      this.generateResetPasswordToken()

    await this._userService.setResetPasswordToken(
      user.id,
      resetPasswordToken,
      expirationTime,
    )

    const messageParams = {
      recipient: email,
      subject: 'Password Recovery',
      text: `Password recovery link:  <a href="${this._recoverPasswordUrl}/new-password?token=${resetPasswordToken}&email=${email}">${this._recoverPasswordUrl}/new-password?token=${resetPasswordToken}&email=${email}</a>`,
      html: `<p>Password recovery link: <a href="${this._recoverPasswordUrl}/new-password?token=${resetPasswordToken}&email=${email}">${this._recoverPasswordUrl}/new-password?token=${resetPasswordToken}&email=${email}</a></p>`,
    }

    return response
  }

  async recoverPassword(
    payload: AuthRecoverPasswordDto,
  ): Promise<Record<string, any>> {
    const { email, password, resetPasswordToken, realm } = payload

    const user = await this._userService.getUserEntityByEmail(email)

    if (!user) {
      throw new BadRequestException(
        'The reset token or user credentials provided are invalid',
      )
    }

    const { resetPassword, id } = user

    const isValid = !user.resetPassword
      ? false
      : this.verifyResetPasswordToken(
          resetPasswordToken,
          resetPassword.token,
          resetPassword.expirationTime,
        )

    if (!isValid) {
      throw new BadRequestException(
        'The reset token or user credentials provided are invalid',
      )
    }

    await this._userService.resetRecoverPasswordTokenByUserId(id)

    return {
      newPassword: password,
    }
  }

  private generateResetPasswordToken(): Record<string, any> {
    const expirationTime = new Date(
      Date.now() + this._resetTokenExpiration * 1000,
    )

    const resetPasswordToken = randomBytes(5).toString('hex')

    return {
      expirationTime,
      resetPasswordToken,
    }
  }

  private verifyResetPasswordToken(
    resetToken: string,
    token: string,
    expirationTime: Date,
  ): boolean {
    return resetToken === token && expirationTime >= new Date()
  }
}
