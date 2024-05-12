import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { LoggerService } from './logger.service'

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const module = context.getClass().name
    const method = context.getHandler().name

    this.log(context.switchToHttp().getRequest(), module, method)
    return next.handle()
  }

  private log(request: any, module: string, method: string) {
    this.logger.log({
      timestamp: new Date().toISOString(),
      method: request.method,
      route: request.route.path,
      data: request.body,
      from: request.ip,
      module: module,
      function: method,
    })
  }
}
