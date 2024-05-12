import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsString,
  IsMongoId,
  ValidateIf,
  IsPositive,
  IsObject,
} from 'class-validator'
import {
  userExampleValues,
  userPaginatedExampleValues,
} from '../utils/user.constants'

export class UserDto {
  @ApiProperty({ example: userExampleValues.name })
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  organizationId: string

  @ApiProperty({ example: userExampleValues.password })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiProperty({ example: userExampleValues.email })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string
}

export class UserCreationFromExternalSignInPayloadDto {
  @ApiProperty({ example: userExampleValues.name })
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  organizationId: string

  @ApiProperty({ example: userExampleValues.email })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: userExampleValues.inactive })
  @IsOptional()
  @IsBoolean()
  inactive: boolean
}

export class UserPaginatedDto {
  @ApiProperty({ example: userPaginatedExampleValues.items })
  @IsArray()
  @Type(() => UserResponseDto)
  items: UserResponseDto[]

  @ApiProperty({ example: userPaginatedExampleValues.meta })
  meta: {
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export class UserResponseDto {
  @ApiProperty({ example: userExampleValues.id })
  @IsNotEmpty()
  @IsMongoId()
  id: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationId: string

  @ApiProperty({ example: userExampleValues.name })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({ example: userExampleValues.email })
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ example: userExampleValues.inactive })
  @IsNotEmpty()
  @IsBoolean()
  inactive: boolean

  @ApiProperty({ example: userExampleValues.createdAt })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date

  @ApiProperty({ example: userExampleValues.updatedAt })
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date
}

export class UserEntityDto extends UserResponseDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string

  @IsObject()
  @IsOptional()
  resetPassword?: Record<string, any>
}

export class UserUpdateDto {
  @ApiPropertyOptional({ example: userExampleValues.externalId })
  @IsOptional()
  @IsString()
  externalId: string

  @ApiPropertyOptional({ example: userExampleValues.name })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiPropertyOptional({ example: userExampleValues.password })
  @ValidateIf((o) => !!o.password)
  @IsNotEmpty()
  @IsString()
  oldpassword: string

  @ApiPropertyOptional({ example: userExampleValues.password })
  @ValidateIf((o) => !!o.oldpassword)
  @IsNotEmpty()
  @IsString()
  password: string

  @ApiPropertyOptional({ example: userExampleValues.email })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiPropertyOptional({ example: userExampleValues.inactive })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  inactive: boolean
}

export class UserQueryDto {
  @ApiPropertyOptional({ example: userExampleValues.email })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  itemsPerPage: number | null = 10

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page: number | null = 1
}

export class UserParamsDto {
  @ApiProperty({ example: userExampleValues.id })
  @IsNotEmpty()
  @IsMongoId({
    message: 'Invalid User ID',
  })
  id: string
}
