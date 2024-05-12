import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ContentType } from "../utils/helper.enum"

export class RequestHeader {
  @IsNotEmpty()
  @IsEnum(ContentType)
  'Content-Type': string

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  Authorization?: string
}