import { LoggerService } from './modules/shared/logger/logger.service'
import { ApiExcludeController } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'

@Controller()
@ApiExcludeController()
export class AppController {
  _loggerService: LoggerService

  constructor(private readonly loggerService: LoggerService) {
    this._loggerService = loggerService
  }

  @Get()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  home() {
    this._loggerService.log('home.controller home')

    return { status: 200, description: 'API Base is running! Access the /api route to read the documentation or /docs' }
  }
}
