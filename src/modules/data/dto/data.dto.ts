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

export class DataDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  data: JSON

  @IsNotEmpty()
  @IsString()
  type: string

  @IsNotEmpty()
  @IsString()
  organizationId: string
}

export class DataQueryDto {
  @IsOptional()
  @IsString()
  type: string

  @IsOptional()
  @IsString()
  organizationId: string
}

export class DataParamsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsMongoId({
    message: 'Invalid Data ID',
  })
  id: string
}
