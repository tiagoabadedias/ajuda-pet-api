import { Method } from '../utils/abstract.requestFactory.enum'
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'

export class RequestParamsDto {
  @IsNotEmpty()
  @IsEnum(Method)
  method: Method

  @IsNotEmpty()
  @IsString()
  url: string = ''

  @IsOptional()
  @IsObject()
  data?: Record<string, any> | string = {}

  @IsOptional()
  @IsObject()
  headers?: Record<string, any> = {}

  @IsOptional()
  @IsPositive()
  timeout?: number = 10000

  @IsOptional()
  @IsObject()
  auth?: Record<string, any> | any = null
}
