import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateVacancyRequestDto {
  @Length(1, 50)
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
  deadLine: Date;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  experience: number;

  @IsNotEmpty()
  @IsEnum(JobType)
  jobType: JobType;

  @IsNotEmpty()
  openingPosition: number;

  @IsNotEmpty()
  @Length(10, 200)
  @IsString()
  description: string;

  @IsNotEmpty()
  @Length(10, 200)
  @IsString()
  skill: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
