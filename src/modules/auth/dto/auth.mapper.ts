import { UserEntityDto } from '../../user/dto/user.dto'
import { Injectable } from '@nestjs/common'

import {
  AccessPermissionValidationDto,
  AuthCredentialsDto,
  AuthVerifyTokenDto,
} from './auth.dto'

@Injectable()
export class AuthMapper {
  public mapSignInCredentialsPayload(credentials: AuthCredentialsDto): any {
    const payload: any = {}
    payload.username = credentials.email
    payload.password = credentials.password

    return payload
  }

  public mapTokenVerificationResponse(payload: any): AuthVerifyTokenDto {
    const response = new AuthVerifyTokenDto()

    response.isValid = payload.isValid

    return response
  }

  public mapAccessPermissionValidationResponse(
    validation: boolean,
    user: UserEntityDto,
  ): AccessPermissionValidationDto {
    const response = new AccessPermissionValidationDto()

    response.permission = validation

    if (user) response.user = user

    return response
  }
}
