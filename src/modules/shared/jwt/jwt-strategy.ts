import { ApiRequestContext } from '../contextRequest/contextRequest.interface'
import { RequestContext } from '@medibloc/nestjs-request-context'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_ACCESS_TOKEN,
      passReqToCallback: true,
    })
  }

  async validate(req: any, payload: any): Promise<any> {
    const apiRequestContext: ApiRequestContext = RequestContext.get()

    apiRequestContext.organizationId = payload.user.organizationId
    apiRequestContext.userId = payload.user.id
    apiRequestContext.userEmail = payload.user.email
    apiRequestContext.userName = payload.user.name
    apiRequestContext.authorization = req.headers['authorization']

    return payload
  }
}
