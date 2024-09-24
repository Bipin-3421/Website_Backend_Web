import { IntersectionType, PartialType } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty, IsUUID } from 'class-validator';
import {
  PaginationParamDTO,
  PaginationResponseDTO,
} from 'common/dto/pagination.dto';
import { SearchParamDTO } from 'common/dto/search.dto';

export class CreateDepartmentDTO {
  @IsString()
  @Length(1, 30)
  @IsNotEmpty()
  name: string;
}

export class ListDepartmentQueryDTO extends IntersectionType(
  SearchParamDTO,
  PaginationParamDTO,
) {}

export class ListDepartmentDTO {
  id: string;
  department: string;
  createdAt: Date;
}

export class ListDepartmentResponseDTO {
  message: string;
  data: ListDepartmentDTO[];
  pagination: PaginationResponseDTO;
}

export class DepartmentParamDTO {
  @IsUUID()
  departmentId: string;
}

export class UpdateDepartmentDTO extends PartialType(CreateDepartmentDTO) {}
