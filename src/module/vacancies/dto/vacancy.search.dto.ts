import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { IsDate, IsEnum, IsISO8601, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { JobStatus } from 'common/enum/job.status.enum';
import { Transform } from 'class-transformer';

export class VacancyFilterDto extends IntersectionType(PaginationDto) {
  @IsString()
  @Optional()
  designation?: string;

  @Optional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsString()
  @Optional()
  position?: string;

  @IsString()
  @Optional()
  @IsEnum(JobStatus)
  status?: JobStatus;

  @Optional()
  @IsISO8601()
  datePostedFrom?: Date;

  @Optional()
  @IsISO8601()
  datePostedTo?: Date;

  @Optional()
  @IsDate()
  @Transform(({ value }) => {
    return new Date(value);
  })
  deadLineFrom?: Date;

  @Optional()
  @IsDate()
  @Transform(({ value }) => {
    return new Date(value);
  })
  deadLineTo?: Date;

  @Optional()
  openingPosition?: number;

  @Optional()
  experience?: number;
}
