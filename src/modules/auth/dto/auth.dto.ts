import { userExampleValues } from '../../user/utils/user.constants'
import { UserEntityDto } from '../../user/dto/user.dto'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsObject,
  IsBoolean,
  IsDate,
  IsOptional,
  IsArray,
  IsPositive,
} from 'class-validator'
import {
  accessPermissionValidationExample,
  authExampleValues,
} from '../utils/auth.constants'

export class AuthCredentialsDto {
  @ApiProperty({ example: userExampleValues.email })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: userExampleValues.password })
  @IsNotEmpty()
  @IsString()
  password: string
}

export class AuthRefreshTokenResponseDto {
  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @ApiProperty({ example: authExampleValues.refreshToken })
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}

export class AuthResponseDto {
  @ApiProperty({ example: authExampleValues.user })
  @IsNotEmpty()
  @IsObject()
  user: Record<string, any>

  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @ApiProperty({ example: authExampleValues.refreshToken })
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}

export class AuthVerifyTokenDto {
  @ApiProperty({ example: authExampleValues.isValid })
  @IsNotEmpty()
  @IsBoolean()
  isValid: boolean
}

export class AuthDto {
  id: string
  token: string
  isExpired: boolean
}

export class AuthRefreshTokenDto {
  @ApiProperty({ example: authExampleValues.refreshToken })
  @IsNotEmpty()
  @IsString()
  refreshToken: string

  @ApiProperty({ example: userExampleValues.realm })
  @IsNotEmpty()
  @IsString()
  realm: string
}

export class AuthTokenDto {
  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  externalToken: string
}

export class AuthForgotPasswordDto {
  @ApiProperty({ example: userExampleValues.email })
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class AccessPermissionDto {
  @ApiProperty({ example: userExampleValues.permission })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  permissions?: Array<string>

  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  token: string
}

export class AccessPermissionValidationDto {
  @ApiProperty({ example: accessPermissionValidationExample.permission })
  @IsNotEmpty()
  @IsBoolean()
  permission: boolean

  @ApiProperty({ example: null })
  @IsNotEmpty()
  @IsObject()
  @Type(() => UserEntityDto)
  user: UserEntityDto
}

export class AuthRecoverPasswordDto {
  @ApiProperty({ example: userExampleValues.email })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: userExampleValues.password })
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ example: userExampleValues.realm })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  realm: string

  @ApiProperty({ example: userExampleValues.resetPasswordToken })
  @IsNotEmpty()
  @IsString()
  resetPasswordToken: string
}

export class AccessValidationUsingExternalTokenPayloadDto {
  @ApiProperty({ example: userExampleValues.permission })
  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  permissions?: Array<string>

  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  externalToken: string
}

export class AccessValidationUsingExternalTokenResponseDto {
  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @ApiProperty({ example: accessPermissionValidationExample.permission })
  @IsNotEmpty()
  @IsBoolean()
  permission: boolean
}

export class SignInUsingExternalTokenResponseDto {
  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  accessToken: string
}

export class SignInWithExternalClientPayloadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  clientSecret: string
}

export class SignInWithExternalClientResponseDto {
  @ApiProperty({ example: authExampleValues.accessToken })
  @IsNotEmpty()
  @IsString()
  accessToken: string

  @ApiProperty({ example: authExampleValues.expiresAt })
  @IsNotEmpty()
  @IsDate()
  expiresAt: Date
}

export class ExternalUserCredentialsCacheSettingPayload {
  @IsNotEmpty()
  @IsString()
  externalToken: string

  @IsNotEmpty()
  @IsString()
  accessToken: string

  @IsNotEmpty()
  @IsObject()
  userPayload: Record<string, any>

  @IsOptional()
  @IsPositive()
  expirationTime?: number
}

export class AccessTokenCacheSettingPayload {
  @IsNotEmpty()
  @IsString()
  externalToken: string

  @IsNotEmpty()
  @IsString()
  accessToken: string

  @IsOptional()
  @IsPositive()
  expirationTime?: number
}

export class UserPayloadCacheSettingPayload {
  @IsNotEmpty()
  @IsString()
  externalToken: string

  @IsNotEmpty()
  @IsObject()
  userPayload: Record<string, any>

  @IsOptional()
  @IsPositive()
  expirationTime?: number
}
