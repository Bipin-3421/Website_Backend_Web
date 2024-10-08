import { Optional } from 'common/decorator/optional.decorator'
import { IsDateString } from 'class-validator'

export class DateFilterDTO {
  @IsDateString()
  @Optional()
  dateFrom?: Date

  @IsDateString()
  @Optional()
  dateTo?: Date
}
