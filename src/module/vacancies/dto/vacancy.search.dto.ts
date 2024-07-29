import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { IsEnum, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class VacancySearchParamDto {
  @IsString()
  @Optional()
  query?: string;

  @Optional()
  @IsEnum(JobType)
  jobType?: JobType;
}

export class VacancyFilterDto extends IntersectionType(
  VacancySearchParamDto,
  PaginationDto,
) {}
