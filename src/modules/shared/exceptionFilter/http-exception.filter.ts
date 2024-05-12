import { Error as MongooseError, mongo as Mongo } from 'mongoose'
import { LoggerService } from '../logger/logger.service'
import { Request, Response } from 'express'
import { MongoServerError } from 'mongodb'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Error } from './error'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly _logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let message: any = 'Internal Server Error',
      code = 'InternalServerErrorException',
      status = 500

    if (exception instanceof HttpException) {
      message = (exception as any).response.message
      status = (exception as any).getStatus()
      code = (exception as any).name
    }

    switch (exception.constructor) {
      case MongooseError.ValidationError:
        message = (exception as any).message
        status = HttpStatus.BAD_REQUEST
        code = 'ValidationError'
        break

      case MongoServerError:
      case Mongo.MongoServerError:
        switch ((exception as any).code) {
          case 11000: {
            const fields = Object.keys((exception as any).keyValue)

            message = `There is already a record in the database with the '${fields}' provided`
            status = HttpStatus.CONFLICT
            code = 'DatabaseError'

            break
          }

          default:
            break
        }

        break

      case HttpException:
      default:
        break
    }

    this._logger.error({
      message,
      stack: (exception as any).stack,
      request: `${request.method} ${request.url}`,
    })

    const error = new Error(null, null)

    error.error = code
    error.statusCode = status
    error.message = Array.isArray(message) ? message : [message]

    response.status(status).json(error)
  }
}
