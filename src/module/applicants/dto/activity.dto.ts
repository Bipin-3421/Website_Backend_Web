import { IsString, IsUUID } from 'class-validator'

export class CreateActivityDTO {
  @IsString()
  comment: string

  @IsUUID()
  applicantId: string
}
