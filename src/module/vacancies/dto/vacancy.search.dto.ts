import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';
import { JobStatus } from 'common/enum/jobStatus.enum';
import { PaginationParamDTO } from 'common/dto/pagination.dto';

export class VacancyFilterDto extends IntersectionType(PaginationParamDTO) {
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
  @IsDateString()
  datePostedFrom?: Date;

  @Optional()
  @IsDateString()
  datePostedTo?: Date;

  @Optional()
  @IsDateString()
  deadLineFrom?: Date;

  @Optional()
  @IsDateString()
  deadLineTo?: Date;

  @Optional()
  @IsNumber()
  openingPosition?: number;

  @Optional()
  @IsNumber()
  experience?: number;
}
