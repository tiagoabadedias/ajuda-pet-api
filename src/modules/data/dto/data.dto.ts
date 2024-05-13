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
  data: any

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
  sex: string

  @IsOptional()
  @IsString()
  searchTerm: string
}

export class DataParamsDto {
  @ApiPropertyOptional()
  @IsNotEmpty()
  @IsMongoId({
    message: 'Invalid Data ID',
  })
  id: string
}
