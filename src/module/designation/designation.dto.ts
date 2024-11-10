import { ApiProperty, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length, IsUUID } from 'class-validator'
import { Optional } from 'common/decorator/optional.decorator'
import { AssetDTO } from 'common/dto/asset.dto'

import {
  PaginationParamDTO,
  PaginationResponseDTO
} from 'common/dto/pagination.dto'
import { SearchParamDTO } from 'common/dto/search.dto'

export class CreateDesignationDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string

  @IsUUID()
  departmentId: string

  @ApiProperty({
    description: 'image of the designation',
    type: 'string',
    format: 'binary'
  })
  image: Express.Multer.File

  @IsString()
  description: string
}

export class UpdateDesignationDTO {
  @IsString()
  @Optional()
  @Length(1, 100)
  name?: string

  @ApiProperty({
    description: 'image of the designation',
    type: 'string',
    format: 'binary'
  })
  image?: Express.Multer.File

  @IsString()
  @Optional()
  description?: string
}

export class ListDesignationDTO {
  id: string

  name: string

  createdAt: Date

  department: DepartmentDTO

  image: AssetDTO

  description: string
}

export class GetDesignationResponseDTO {
  message: string

  data: {
    id: string
    name: string
    createdAt: Date
    department: DepartmentDTO
    image: AssetDTO
    description: string
  }
}

export class ListDesignationResponseDTO {
  message: string

  data: ListDesignationDTO[]

  pagination: PaginationResponseDTO
}

export class DesignationIdDTO {
  @IsUUID()
  designationId: string
}

export class ListDesignationQueryDTO extends IntersectionType(
  SearchParamDTO,
  PaginationParamDTO
) {}

class DepartmentDTO {
  @IsUUID()
  id: string

  @IsString()
  name: string
}
