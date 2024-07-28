import { Vacancy } from 'common/entities/vacancy.entity';

export class GetVacancyDto {
  message: string;

  data: Vacancy[];
}
