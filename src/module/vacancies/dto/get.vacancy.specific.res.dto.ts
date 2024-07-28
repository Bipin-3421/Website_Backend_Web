import { Vacancy } from 'common/entities/vacancy.entity';
export class GetSpecificVacancyResDto {
  message: string;
  data: Vacancy | null;
}
