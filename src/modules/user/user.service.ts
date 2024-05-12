import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { HelperService } from '../shared/helper/helper.service'
import {
  UserDto,
  UserQueryDto,
  UserResponseDto,
  UserUpdateDto,
  UserPaginatedDto,
  UserEntityDto,
} from './dto/user.dto'
import { UserRepository } from './user.repository'
import { UserMapper } from './dto/user.mapper'
import { User } from './user.schema'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class UserService {
  private _saltRounds = parseInt(process.env.SALT_ROUNDS)

  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _userMapper: UserMapper,
    private readonly _helperService: HelperService,

    @Inject(forwardRef(() => AuthService))
    private readonly _authService: AuthService,
  ) {}

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne(id)

    if (!user) throw new NotFoundException('User not found')

    return this._userMapper.toDto(user)
  }

  async getUserEntityById(id: string) {
    const user = await this._userRepository.findOne(id)

    if (!user) throw new NotFoundException('User not found')

    return this._userMapper.toEntityDto(user)
  }

  async getUserEntityByEmail(email: string): Promise<UserEntityDto> {
    const user = await this._userRepository.findOneByEmail(email)
    return user ? this._userMapper.toEntityDto(user) : null
  }

  async getUsers(query: UserQueryDto): Promise<UserPaginatedDto> {
    const filters = this._helperService.buildMongoQuery(query, ['roles'])

    const users = await this._userRepository.find(filters)

    return this._userMapper.toUserPaginatedDto(users)
  }

  async create(payload: UserDto): Promise<UserResponseDto> {
    payload.organizationId = payload.organizationId
      ? payload.organizationId
      : await this._helperService.getOrganizationId()

    const user = await this._userMapper.toEntity(payload)

    let userEntity = await this._userRepository.create(user)

    return this._userMapper.toDto(userEntity)
  }

  async update(id: string, userDto: UserUpdateDto): Promise<UserResponseDto> {
    const user = await this._userRepository.findOne(id)

    if (!user) throw new NotFoundException('User not found')

    const updatedUser = await this._userRepository.update(id, userDto)

    return this._userMapper.toDto(updatedUser)
  }

  async setResetPasswordToken(
    id: string,
    token: string,
    expirationTime: Date,
  ): Promise<User> {
    const updatedUser = await this._userRepository.setResetPasswordToken(
      id,
      token,
      expirationTime,
    )

    if (!updatedUser) throw new NotFoundException('User not found')

    return updatedUser
  }

  async resetRecoverPasswordTokenByUserId(id: string): Promise<User> {
    const updatedUser =
      await this._userRepository.resetRecoverPasswordTokenByUserId(id)

    if (!updatedUser) throw new NotFoundException('User not found')

    return updatedUser
  }

  /* ---- Auxiliary Methods ---- */

  async encryptPassword(password: string): Promise<string> {
    const encryptedPassword = await bcrypt.hash(password, this._saltRounds)
    return encryptedPassword
  }

  async verifyPassword(
    password: string,
    encryptedPassword: string,
  ): Promise<boolean> {
    const isValid = await bcrypt.compare(password, encryptedPassword)
    return isValid
  }
}
