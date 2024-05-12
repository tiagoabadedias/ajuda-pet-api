import { UserResponseDto, UserPaginatedDto, UserEntityDto } from './user.dto'
import { User } from '../user.schema'
import { Types } from 'mongoose'
import * as bcrypt from 'bcrypt'

export class UserMapper {
  toDto(entity: User) {
    const entityDto: UserResponseDto = new UserResponseDto()

    entityDto.id = entity._id?.toString()
    entityDto.name = entity.name
    entityDto.email = entity.email

    entityDto.organizationId = entity.organizationId

    entityDto.inactive = entity.inactive

    entityDto.createdAt = entity.createdAt
    entityDto.updatedAt = entity.updatedAt

    return entityDto
  }

  toUserPaginatedDto(entity: Record<string, any>): UserPaginatedDto {
    const entityDto = new UserPaginatedDto()

    entityDto.items = entity.map((item) => this.toDto(item))
    entityDto.meta = entity.meta

    return entityDto
  }

  async toEntity(entityDto: Record<string, any>) {
    const entity: User = new User()

    if (entityDto._id) {
      entity._id = new Types.ObjectId(entityDto._id)
    }

    entity.name = entityDto.name
    entity.email = entityDto.email

    entity.password = await bcrypt.hash(entityDto.password, 10)

    entity.roles = entityDto.roles
    entity.organizationId = entityDto.organizationId

    entity.inactive = entityDto.inactive

    return entity
  }

  toEntityDto(entity: User) {
    const entityDto: UserEntityDto = new UserEntityDto()

    entityDto.id = entity._id.toString()
    entityDto.name = entity.name
    entityDto.email = entity.email

    entityDto.organizationId = entity.organizationId

    entityDto.inactive = entity.inactive

    entityDto.resetPassword = entity.resetPassword
    entityDto.password = entity.password

    entityDto.createdAt = entity.createdAt
    entityDto.updatedAt = entity.updatedAt

    return entityDto
  }
}
