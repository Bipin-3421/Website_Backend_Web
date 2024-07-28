import {
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';

export class CreateVacancyReqDto {
  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  designation: string;

  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  position: string;

  @IsDateString()
  @IsNotEmpty()
  datePosted: Date;

  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @Length(3, 50)
  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsNumber()
  @IsNotEmpty()
  experience: number;

  @IsNotEmpty()
  jobType: JobType;

  @IsNotEmpty()
  @Min(0)
  @Max(10)
  openingPosition: number;
}
