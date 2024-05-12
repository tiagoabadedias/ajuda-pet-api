import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { Data } from './data.schema'
import { Model } from 'mongoose'
import { DataDto } from './dto/data.dto'

@Injectable()
export class DataRepository {
  constructor(@Inject('DataModel') private dataModel: Model<Data>) {}

  async find(filters: Record<string, any>): Promise<Data[]> {
    return await this.dataModel.find({ ...filters })
  }

  async findAll(): Promise<Data[]> {
    return await this.dataModel.find()
  }

  async findQuery(findQuery: Record<string, any>): Promise<Data[]> {
    return await this.dataModel.find(findQuery)
  }

  async insertMany(data: any): Promise<any> {
    return await this.dataModel.insertMany(data)
  }

  async create(data: any): Promise<Data> {
    const newData = new this.dataModel(data)
    return await newData.save()
  }

  async update(id: string, data: DataDto): Promise<Data> {
    const filter = { _id: id }

    const updatedData = await this.dataModel.findOneAndUpdate(filter, data, {
      new: true,
    })

    if (!updatedData) {
      throw new UnauthorizedException()
    }

    return updatedData
  }
}
