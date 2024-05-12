import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

const winstonConfig: WinstonModuleOptions = {
  levels: winston.config.npm.levels,
  level: 'verbose',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new DailyRotateFile({
      level: 'verbose',
      filename: 'base-api_%DATE%.log',
      dirname: './logs', ///var/log
      options: { flags: 'a' },
      datePattern: 'YYYY_MM_DD',
      zippedArchive: true,
      maxSize: '30m',
      maxFiles: '1d',
    }),
  ],
}

export class LoggerService {
  _logger: any

  constructor() {
    this._logger = winston.createLogger(winstonConfig)
  }

  async log(message: any) {
    this._logger.info(message)
  }

  async warn(message: any) {
    this._logger.warn(message)
  }

  async error(message: any) {
    this._logger.error(message)
  }
}
