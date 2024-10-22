import { IsEnum, IsString } from 'class-validator'
import { Optional } from 'common/decorator/optional.decorator'
import { ApplicationStatus } from 'common/enum/applicant.status.enum'

export class PatchApplicantDto {
  @IsEnum(ApplicationStatus)
  @Optional()
  status?: ApplicationStatus

  @IsString()
  @Optional()
  comment?: string
}
