import { ApiBody, ApiTags, ApiResponse, ApiOperation, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthTokenDto, AuthResponseDto, AuthCredentialsDto, AuthVerifyTokenDto } from './dto/auth.dto'
import { Controller, Post, Body, ValidationPipe, HttpCode, UseInterceptors } from '@nestjs/common'
import { RequestInterceptor } from '../shared/interceptors/request.interceptor'
import { LoggerService } from '../shared/logger/logger.service'
import { AuthService } from './auth.service'

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({ status: 401, description: 'Unauthorized.' })
@ApiResponse({ status: 500, description: "Internal Server error, let's review it here :)." })
@UseInterceptors(RequestInterceptor)
export class AuthController {
  constructor(private readonly _authService: AuthService, private readonly _loggerService: LoggerService) {}

  @Post('/signin')
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiCreatedResponse({ description: 'Authentication succeeded.', type: AuthResponseDto })
  @ApiBody({ type: AuthCredentialsDto })
  async signIn(@Body(new ValidationPipe({ whitelist: true, transform: true })) authCredentialsDto: AuthCredentialsDto): Promise<any> {
    this._loggerService.log(`auth.controller signIn ${authCredentialsDto}`)
    return this._authService.signIn(authCredentialsDto)
  }

  @Post('/tokenUnlimited')
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Create a new token with unlimited time' })
  @ApiCreatedResponse({ description: 'Authentication succeeded.', type: AuthResponseDto })
  async tokenUnlimited(@Body(new ValidationPipe({ whitelist: true, transform: true })) authTokenDto: AuthTokenDto): Promise<AuthCredentialsDto> {
    return this._authService.createTokenUnlimited(authTokenDto)
  }

  @Post('/verify-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify authentication token' })
  @ApiResponse({ status: 200, description: 'Token is valid.' })
  async check(@Body(new ValidationPipe({ whitelist: true, transform: true })) authTokenDto: AuthTokenDto): Promise<AuthVerifyTokenDto> {
    this._loggerService.log(`auth.controller verify Token ${authTokenDto}`)
    return this._authService.verifyToken(authTokenDto)
  }
}
