import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';

export class CreateVacancyRequestDto {
  @IsString()
  @IsNotEmpty()
  designation: string;

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
  openingPosition: number;
}
