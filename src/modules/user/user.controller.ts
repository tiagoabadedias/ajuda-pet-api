import { UserDto, UserQueryDto, UserResponseDto, UserUpdateDto, UserParamsDto, UserPaginatedDto } from './dto/user.dto'
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Param, Post, Put, Query, UseGuards, ValidationPipe } from '@nestjs/common'
import { JwtAuthGuard } from '../shared/auth/auth.guard'
import { UserService } from './user.service'

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard)
@ApiResponse({ status: 403, description: 'Forbidden resource.' })
@ApiResponse({ status: 500, description: 'Internal server error.' })
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Search for users by params' })
  @ApiResponse({ status: 200, description: 'Result.', type: UserPaginatedDto })
  async getRoles(@Query(new ValidationPipe({ whitelist: true, transform: true })) query: UserQueryDto): Promise<UserPaginatedDto> {
    return this._userService.getUsers(query)
  }

  @Get(':id')
  @ApiOperation({ summary: 'search user by id' })
  @ApiResponse({ status: 200, description: 'Search an user by id', type: UserResponseDto })
  async getUserById(@Param(new ValidationPipe({ transform: true })) params: UserParamsDto): Promise<UserResponseDto> {
    return await this._userService.getUserById(params.id)
  }

  @Post()
  @ApiOperation({ summary: 'create user' })
  @ApiCreatedResponse({ description: 'user created sucessfully', type: UserResponseDto })
  @ApiBody({ description: 'Create an user', type: UserDto })
  async createUser(@Body(ValidationPipe) body: UserDto): Promise<UserResponseDto> {
    return await this._userService.create(body)
  }

  @Put(':id')
  @ApiOperation({ summary: 'update user by id' })
  @ApiResponse({ status: 200, description: 'Update an user', type: UserResponseDto })
  async updateUser(@Param(new ValidationPipe({ transform: true })) params: UserParamsDto, @Body(new ValidationPipe({ transform: true })) body: UserUpdateDto): Promise<UserResponseDto> {
    return await this._userService.update(params.id, body)
  }
}
