import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { JobStatus } from 'common/enum/job.status.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVacancyRequestDto {
  @IsString()
  @Optional()
  designation?: string;

  @IsString()
  @Optional()
  position?: string;

  @Optional()
  @IsDateString()
  datePosted?: Date;

  @Optional()
  @IsDateString()
  deadline?: Date;

  @Optional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  experience?: number;

  @Optional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsString()
  @Optional()
  @IsNumber()
  openingPosition?: number;

  @Length(10, 200)
  @Optional()
  @IsString()
  description?: string;

  @Optional()
  @Length(10, 200)
  @IsString()
  skill?: string;

  @Optional()
  @IsString()
  department?: string;

  @Optional()
  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary',
  })
  image?: Express.Multer.File;

  @Optional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
