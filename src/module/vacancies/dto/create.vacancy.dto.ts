import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { JobStatus } from 'common/enum/jobStatus.enum';

export class CreateVacancyRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  name: string;

  @IsUUID()
  designationId: string;

  @IsString()
  @IsNotEmpty()
  jobLevel: string;

  @IsString()
  @IsNotEmpty()
  salary: string;

  @IsString()
  @Length(10, 200)
  @IsNotEmpty()
  skills: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  experience: number;

  @IsNotEmpty()
  @IsEnum(JobType)
  jobType: JobType;

  @IsDateString()
  @IsNotEmpty()
  datePosted: Date;

  @IsDateString()
  @IsNotEmpty()
  deadLine: Date;

  @IsNotEmpty()
  @IsNumber()
  vacancyOpening: number;

  @IsNotEmpty()
  @Length(10, 200)
  @IsString()
  description: string;

  @IsEnum(JobStatus)
  status: JobStatus;

  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
