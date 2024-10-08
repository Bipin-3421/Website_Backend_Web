import { IsUUID } from 'class-validator'

export class VacancyIdDTO {
  @IsUUID()
  vacancyId: string
}
