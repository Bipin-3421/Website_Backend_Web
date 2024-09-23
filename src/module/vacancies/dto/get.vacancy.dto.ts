import { Vacancy } from 'common/entities/vacancy.entity';
import { PaginationResponseDTO } from 'common/dto/pagination.dto';
export class GetVacancyResponseDto {
  message: string;
  data: Vacancy;
}

export class ListVacanciesReponseDto {
  message: string;
  data: Vacancy[];
  Pagination: PaginationResponseDTO;
}
