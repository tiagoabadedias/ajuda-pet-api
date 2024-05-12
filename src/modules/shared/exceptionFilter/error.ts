import { ApiProperty } from '@nestjs/swagger'
import { HttpStatus } from '@nestjs/common'

export class Error {
  constructor(messageOriginal: any, messageFormated: any) {
    this.error = messageOriginal
    this.message = messageFormated
    this.statusCode = HttpStatus.NOT_ACCEPTABLE
  }

  @ApiProperty()
  statusCode: HttpStatus

  @ApiProperty()
  message: any

  @ApiProperty()
  error: string
}
