import { HelperService } from '../helper/helper.service'
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'

/* 
  This interceptor is used to configure the channel id (from the HTTP request header) as an attribute of the request context, 
  suitable for situations where the JWT token cannot be provided!
*/
@Injectable()
export class RequestInterceptor implements NestInterceptor {
  constructor(private readonly _helperService: HelperService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<any>()

    return next.handle()
  }
}
