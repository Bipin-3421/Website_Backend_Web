import { IsISO8601, IsNotEmpty, IsString, Length } from 'class-validator';
import { JobType } from '../../../common/enum/Job.type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'common/decorator/optional.decorator';
import { Transform } from 'class-transformer';

export class CreateVacancyRequestDto {
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsISO8601()
  @IsNotEmpty()
  datePosted: Date;

  @IsISO8601()
  @IsNotEmpty()
  deadLine: Date;

  @IsNotEmpty()
  @Transform(({ value }) => {
    return Number(value);
  })
  experience: number;

  @IsNotEmpty()
  jobType: JobType;

  @IsNotEmpty()
  openingPosition: number;

  @IsNotEmpty()
  @Length(10, 200)
  description: string;

  @IsNotEmpty()
  @Length(10, 200)
  skill: string;

  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary',
  })
  @Optional()
  image: Express.Multer.File;
}
