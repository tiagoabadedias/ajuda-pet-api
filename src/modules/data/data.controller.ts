import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post, Query, Req, ValidationPipe } from '@nestjs/common'
import { DataService } from './data.service'
import { DataDto, DataQueryDto } from './dto/data.dto'

@Controller('data')
@ApiTags('Data')
@ApiResponse({ status: 403, description: 'Forbidden resource.' })
@ApiResponse({ status: 500, description: 'Internal server error.' })
export class DataController {
  constructor(private readonly _dataService: DataService) {}

  @Get('query')
  @ApiOperation({ summary: 'Search for datas by params' })
  @ApiResponse({ status: 200, description: 'Result.' })
  async getDataQuery(@Req() request: Request, @Query(new ValidationPipe({ whitelist: true, transform: true })) query: DataQueryDto): Promise<any> {
    let where = {}

    if (query.type && query.type !== 'TODOS') where['data.typePet'] = query.type
    if (query.sex && query.sex !== 'TODOS') where['data.sex'] = query.sex
    if (query.searchTerm) where['data.observation'] = { $regex: query.searchTerm, $options: 'i' }

    console.log(query)
    let data = await this._dataService.findQuery(where)

    return data
  }

  @Post('pet')
  @ApiOperation({ summary: 'create data' })
  @ApiCreatedResponse({ description: 'data created sucessfully' })
  @ApiBody({ description: 'Create an data', type: DataDto })
  async createData(@Body(ValidationPipe) body: DataDto): Promise<any> {
    return await this._dataService.create(body)
  }
}
