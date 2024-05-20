import { HttpExceptionFilter } from './modules/shared/exceptionFilter/http-exception.filter'
import { LoggerInterceptor } from './modules/shared/logger/logger.interceptor'
import { LoggerService } from './modules/shared/logger/logger.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { RedocModule, RedocOptions } from 'nestjs-redoc'
import { VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser'

declare const module: any

async function bootstrap() {
  const logger = new LoggerService()
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  })

  app.useGlobalInterceptors(new LoggerInterceptor(logger))
  app.useGlobalFilters(new HttpExceptionFilter(logger))

  app.enableVersioning({
    type: VersioningType.URI,
  })

  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  app.enableCors({
    origin: [
      'http://localhost:4200/',
      'http://localhost:4200',
      'https://ajudapet-rs.vercel.app/',
      'https://ajudapet-rs.vercel.app',
      'http://ajudapet-rs.vercel.app/',
      'http://ajudapet-rs.vercel.app',
      'https://meupet.ajudatche.com/',
      'https://meupet.ajudatche.com',
      'http://meupet.ajudatche.com/',
      'http://meupet.ajudatche.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: process.env.CORS_HEADERS,
  })

  const config = new DocumentBuilder()
    .setTitle('API Auth')
    .setDescription('Documentation API')
    .setVersion(process.env.DOC_VERSION)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  const redocOptions: RedocOptions = {
    title: 'API Base',
    favicon: process.env.DOC_LOGO_URL,
    logo: {
      url: process.env.DOC_LOGO_URL,
      backgroundColor: '#FFF',
      altText: process.env.DOC_LOGO_ALTTEXT,
      href: process.env.DOC_LOGO_HREF,
    },
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
    noAutoAuth: false,
  }

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  await RedocModule.setup('/docs', app, document, redocOptions)
  await SwaggerModule.setup('/api', app, document)

  await app.listen(process.env.PORT)
}
bootstrap()
