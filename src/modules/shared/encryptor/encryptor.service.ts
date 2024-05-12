import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { HelperService } from '../helper/helper.service'
import { createSign } from 'crypto'

@Injectable()
export class EncryptorService {
  private _defaultEncryptionAlgorithm = 'rsa-sha256'
  private _privateKey: string = process.env.PRIVATE_KEY_FOR_ENCRYPTION || null

  constructor(private readonly _helperService: HelperService) {}

  private getPrivateKeyForEncryption() {
    if (!this._privateKey) {
      throw new UnprocessableEntityException(
        'It was not possible to get the private key for data encryptation',
      )
    }

    return this._helperService.formatKeyUsingRSAPrivateKeyPattern(
      this._privateKey,
    )
  }

  private getEncryptationAlgorithm() {
    return this._defaultEncryptionAlgorithm
  }

  public createSignatureForData(data: any) {
    const privateKey = this.getPrivateKeyForEncryption()
    const encryptationAlgorith = this.getEncryptationAlgorithm()

    const signer = createSign(encryptationAlgorith)

    signer.update(Buffer.from(JSON.stringify(data)))

    const signature = signer.sign(privateKey, 'hex')

    return signature
  }
}
