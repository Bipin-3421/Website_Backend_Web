import { IsEnum, IsISO8601, IsString, Length } from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { JobStatus } from 'common/enum/job.status.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVacancyRequestDto {
  @IsString()
  @Optional()
  designation: string | undefined;

  @IsString()
  @Optional()
  position: string | undefined;

  @IsISO8601()
  @Optional()
  datePosted: Date | undefined;

  @IsISO8601()
  @Optional()
  deadline: Date | undefined;

  @Optional()
  @Transform(({ value }) => {
    return Number(value);
  })
  experience: number | undefined;

  @Optional()
  jobType: JobType | undefined;

  @IsString()
  @Optional()
  openingPosition: number | undefined;

  @Length(10, 200)
  @Optional()
  description: string;

  @Optional()
  @Length(10, 200)
  skill: string;

  @Optional()
  department: string;

  @Optional()
  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;

  @Optional()
  @IsEnum(JobStatus)
  status: JobStatus;
}
