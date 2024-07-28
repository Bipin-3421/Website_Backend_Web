import { IsString } from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { Optional } from 'common/decorator/optional.decorator';

export class UpdateVacancyRequestDto {
  @IsString()
  @Optional()
  designation: string | undefined;

  @IsString()
  @Optional()
  position: string | undefined;

  @IsString()
  @Optional()
  datePosted: Date | undefined;

  @IsString()
  @Optional()
  deadline: Date | undefined;

  @IsString()
  @Optional()
  salary: string | undefined;

  @IsString()
  @Optional()
  experience: number | undefined;

  @IsString()
  @Optional()
  jobType: JobType | undefined;

  @IsString()
  @Optional()
  openingPosition: number | undefined;
}
