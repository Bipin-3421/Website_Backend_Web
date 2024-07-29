import { IsUUID } from 'class-validator';

export class VacancyIdDto {
  @IsUUID()
  vacancyId: string;
}
