import { DataRepository } from './data.repository'
import { Injectable } from '@nestjs/common'
import { DataDto } from './dto/data.dto'
import { Data } from './data.schema'

@Injectable()
export class DataService {
  constructor(private readonly _dataRepository: DataRepository) {}

  async findQuery(findQuery: Record<string, any>): Promise<Data[]> {
    console.log(findQuery)
    return await this._dataRepository.find(findQuery)
  }

  async create(payload: DataDto): Promise<any> {
    const data = payload

    let dataEntity = await this._dataRepository.create(data)

    return dataEntity
  }
}
