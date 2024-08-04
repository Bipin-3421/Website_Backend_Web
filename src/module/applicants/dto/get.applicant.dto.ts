import { PaginationResponseDTO } from 'common/dto/response.dto';
import { Applicant } from 'common/entities/applicant.entity';

export class GetApplicantResponseDto {
  message: string;

  data: Applicant;
}

export class ListApplicantsResponseDto {
  message: string;

  data: Applicant[];

  pagination: PaginationResponseDTO;
}
