import { Vacancy } from 'common/entities/vacancy.entity';
import { PaginationResponseDTO } from 'common/dto/response.dto';
export class GetVacancyResponseDto {
  message: string;
  data: Vacancy | null;
}

export class ListVacanciesReponseDto {
  message: string;
  data: Vacancy[];
  Pagination: PaginationResponseDTO;
}
