import {
  IsEnum,
  IsISO8601,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';
import { JobStatus } from 'common/enum/job.status.enum';

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

  @IsNumberString()
  @Optional()
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
  image: Express.Multer.File;

  @Optional()
  @IsEnum(JobStatus)
  status: JobStatus;
}
