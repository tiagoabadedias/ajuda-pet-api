import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId

  @Prop({
    required: true,
  })
  roles: string[]

  @Prop({
    index: true,
  })
  externalId: string

  @Prop({
    required: true,
  })
  organizationId: string

  @Prop({
    required: true,
  })
  name: string

  @Prop({
    required: true,
  })
  password: string

  @Prop({
    // required: true,
    unique: true,
    sparse: true,
  })
  email: string

  @Prop({
    default: false,
  })
  inactive: boolean

  @Prop({
    type: Object,
    default: null,
  })
  resetPassword: {
    token: string
    expirationTime: Date
  }

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
