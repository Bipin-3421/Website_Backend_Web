import { IsUUID } from 'class-validator';

export class ApplicantParamDto {
  @IsUUID()
  applicantId: string;
}
