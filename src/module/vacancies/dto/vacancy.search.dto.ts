import { Optional } from 'common/decorator/optional.decorator';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { JobStatus } from 'common/enum/jobStatus.enum';
import { PaginationParamDTO } from 'common/dto/pagination.dto';
import { SearchParamDTO } from 'common/dto/search.dto';

export class VacancyFilterDto extends IntersectionType(
  PaginationParamDTO,
  SearchParamDTO,
) {
  @IsUUID()
  @Optional()
  designationId?: string;

  @IsString()
  @Optional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @IsString()
  @Optional()
  jobLevel?: string;

  @Optional()
  datePostedFrom?: Date;

  @Optional()
  datePostedTo?: Date;

  @Optional()
  deadlineFrom?: Date;

  @Optional()
  deadlineTo?: Date;
}
