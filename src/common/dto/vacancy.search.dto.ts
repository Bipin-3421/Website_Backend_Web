import { JobType } from '../enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { IsEnum, IsString, IsNumber } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class VacancySearchParamDto {
  @IsString()
  @Optional()
  query?: string;

  @Optional()
  @IsEnum(JobType)
  jobType?: JobType;
}

export class PaginationDto {
  @Optional()
  @Transform(({ value }) => (value ? parseInt(value) : value))
  @IsNumber()
  take?: number;

  @Optional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : value))
  page?: number;
}

export class VacancyFilterDto extends IntersectionType(
  VacancySearchParamDto,
  PaginationDto,
) {}
