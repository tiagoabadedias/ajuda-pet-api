import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { UserUpdateDto } from './dto/user.dto'
import { User } from './user.schema'
import { Model } from 'mongoose'

@Injectable()
export class UserRepository {
  constructor(@Inject('UserModel') private userModel: Model<User>) {}

  async findOne(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id })
  }

  async findOneByAuthenticatorId(authenticatorId: string): Promise<User> {
    return await this.userModel.findOne({ authenticatorId })
  }

  async find(filters: Record<string, any>): Promise<User[]> {
    return this.userModel.find({ ...filters })
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email })
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user)
    return await newUser.save()
  }

  async update(id: string, user: UserUpdateDto): Promise<User> {
    const filter = { _id: id }

    const updatedUser = await this.userModel.findOneAndUpdate(filter, user, {
      new: true,
    })

    if (!updatedUser) {
      throw new UnauthorizedException()
    }

    return updatedUser
  }

  async setResetPasswordToken(
    id: string,
    token: string,
    expirationTime: Date,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { resetPassword: { token, expirationTime } },
      { new: true },
    )

    return updatedUser
  }

  async resetRecoverPasswordTokenByUserId(id: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      { resetPassword: null },
      { new: true },
    )

    return updatedUser
  }
}
