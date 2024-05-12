import { HelperService } from './helper.service'
import { Module } from '@nestjs/common'

@Module({
  providers: [HelperService],
  exports: [HelperService],
})
export class HelperModule {}
