import {
  IsDateString,
  IsEnum,
  IsString,
  Length,
  IsUUID,
  IsNumber
} from 'class-validator'
import { JobType } from '../../../common/enum/Job.type.enum'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { JobStatus } from 'common/enum/jobStatus.enum'

export class CreateVacancyRequestDto {
  @IsString()
  @Length(1, 50)
  name: string

  @IsUUID()
  designationId: string

  @IsString()
  jobLevel: string

  @IsString()
  salary: string

  @IsString()
  @Length(1, 200)
  skills: string

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value)
  })
  experience: number

  @IsEnum(JobType)
  jobType: JobType

  @IsDateString()
  deadLine: Date

  @IsNumber()
  @Transform(({ value }) => {
    return Number(value)
  })
  vacancyOpening: number

  @IsString()
  description: string

  @IsEnum(JobStatus)
  status: JobStatus

  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary'
  })
  image: Express.Multer.File
}
