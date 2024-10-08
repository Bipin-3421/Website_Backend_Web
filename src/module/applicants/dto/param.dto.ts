import { IsUUID } from 'class-validator'

export class ApplicantParamDTO {
  @IsUUID()
  applicantId: string
}
