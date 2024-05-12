import { Module } from '@nestjs/common'
import { HelperModule } from '../helper/helper.module'
import { EncryptorService } from './encryptor.service'

@Module({
  imports: [HelperModule],
  providers: [EncryptorService],
  exports: [EncryptorService],
})
export class EncryptorModule {}
