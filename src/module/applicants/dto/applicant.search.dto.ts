import { IntersectionType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { PaginationDto } from 'common/dto/pagination.dto';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';

export class ApplicantSearchParamDto {
  @Optional()
  @IsEnum(ApplicationStatus)
  applicantStatus?: ApplicationStatus;
}

export class ApplicantFilterDto extends IntersectionType(
  ApplicantSearchParamDto,
  PaginationDto,
) {}
