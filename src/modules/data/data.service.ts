import { DataRepository } from './data.repository'
import { Injectable } from '@nestjs/common'
import { DataDto } from './dto/data.dto'
import { Data } from './data.schema'
import { randomUUID } from 'crypto'
const AWS = require('aws-sdk')

@Injectable()
export class DataService {
  constructor(private readonly _dataRepository: DataRepository) {}

  async findQuery(findQuery: Record<string, any>): Promise<Data[]> {
    console.log(findQuery)
    return await this._dataRepository.find(findQuery)
  }

  async create(payload: DataDto): Promise<any> {
    const BUCKET_NAME = process.env.BUCKET_NAME
    const accessKeyId = process.env.ACCESSKEY
    const secretAccessKey = process.env.SECRET_ACCESS_KEY

    const s3 = new AWS.S3({
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    })

    var typeSplit = payload.data.url.split(';')
    var type = typeSplit[0].split(':')
    var base = typeSplit[1].split(',')

    let buf = new Buffer(
      payload.data.url.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    )

    const params = {
      Bucket: BUCKET_NAME,
      Key: randomUUID(),
      Body: buf,
      ContentEncoding: base[0],
      ContentType: type[1],
      ACL: 'public-read',
    }

    let image = await s3
      .upload(params, async function (err: any, data: any) {
        if (err) {
          throw err
        }
        console.log(payload)
        console.log(`File uploaded successfully. ${data.image.Location}`)
        return data.image
      })
      .promise()

    payload.data['link'] = image.Location
    delete payload.data.url
    let dataEntity = await this._dataRepository.create(payload)
    console.log(dataEntity)
    // let data = payload

    return dataEntity
  }
}
