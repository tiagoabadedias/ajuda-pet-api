import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RequestFactoryService } from './requestFactory.service'
import { AbstractRequestFactory } from '../abstract/abstract.requestFactory'
import { HelperModule } from '../helper/helper.module'

@Module({
  imports: [HttpModule, HelperModule],
  providers: [
    {
      provide: AbstractRequestFactory,
      useClass: RequestFactoryService,
    },
  ],
  exports: [AbstractRequestFactory],
})
export class RequestFactoryModule {}
