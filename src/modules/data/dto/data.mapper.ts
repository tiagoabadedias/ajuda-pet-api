export class DataMapper {
  toDto(entity: any) {
    const itemDto: any = {}
    itemDto['venue'] = entity.A
    itemDto['update'] = entity.G

    return itemDto
  }

  toEntity(entity: any) {
    const itemDto: any = {}
    itemDto['venue'] = entity.A
    itemDto['update'] = entity.G

    return itemDto
  }
}
