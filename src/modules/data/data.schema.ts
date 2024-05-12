import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type DataDocument = Data & Document

@Schema({ timestamps: true })
export class Data {
  _id: Types.ObjectId

  @Prop({ required: false, type: JSON })
  data: JSON

  @Prop()
  origin: String

  @Prop()
  type: String

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const DataSchema = SchemaFactory.createForClass(Data)
