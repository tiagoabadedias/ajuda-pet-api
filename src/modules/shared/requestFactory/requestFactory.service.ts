import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { AbstractRequestFactory } from '../abstract/abstract.requestFactory'
import { RequestParamsDto } from '../abstract/dto/abstract.requestFactory.dto'
import { HelperService } from '../helper/helper.service'

@Injectable()
export class RequestFactoryService implements AbstractRequestFactory {
  private _timeout = 5000

  constructor(
    private readonly _httpService: HttpService,
    private readonly _helperService: HelperService
  ) {}

  async request(config: RequestParamsDto): Promise<any> {
    const { method, url, data, headers, timeout, auth } = config

    const params = await this.setRequestParams({
      method,
      url,
      data,
      headers,
      timeout: timeout || this._timeout,
      auth,
    })

    return await firstValueFrom(this._httpService.request(params))
      .then((result) => this.responseHandler(result))
      .catch((err) => this.errorHandler(err))
  }

  private async setRequestParams(config: RequestParamsDto): Promise<Record<string, any>> {
    let { method, url, data, headers, timeout, auth } = config

    headers = !headers || !Object.keys(headers).length 
      ? await this._helperService.getContextHeaders() : headers

    const initialParams = { url, method, data, headers, timeout, auth }

    const params = Object.keys(initialParams).reduce((acc, key) => {
      if (initialParams[key] == null) delete initialParams[key]
      return acc
    }, initialParams)

    return params
  }

  private responseHandler(response: Record<string, any>): Record<string, any> {
    const data = response?.data
      ? {
          data: response.data,
          headers: response.headers,
          status: response.status,
        }
      : {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        }
      
    return data
  }

  private errorHandler(error: Record<string, any>): void {
    let errorObject, errorStatus

    if (error.code) {
      switch (error.code) {
        case 'ECONNABORTED':
          errorObject = {
            status: HttpStatus.REQUEST_TIMEOUT,
            message: `Timeout Error: ${this._timeout} ms timeout exceeded.`,
          }
          errorStatus = HttpStatus.REQUEST_TIMEOUT
          break

        case 'ECONNREFUSED':
          errorObject = {
            status: HttpStatus.FAILED_DEPENDENCY,
            message: `Request External API Error: Internal error communicating with the external API`,
          }
          errorStatus = HttpStatus.FAILED_DEPENDENCY
          break

        default:
          errorObject = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            message: `Request Error: Unknown Error`,
          }
          errorStatus = HttpStatus.INTERNAL_SERVER_ERROR
          break
      }
    } else if (error.response && error.response.status >= 500) {
      errorObject = {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Request External API Error: Unknown Error`,
      }
      errorStatus = HttpStatus.INTERNAL_SERVER_ERROR
    } else {
      errorObject = error.response.data
      errorStatus = error.response.status
    }

    throw new HttpException(errorObject, errorStatus)
  }
}
