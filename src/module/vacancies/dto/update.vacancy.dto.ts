import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
  Length
} from 'class-validator'
import { JobType } from '../../../common/enum/Job.type.enum'
import { Optional } from 'common/decorator/optional.decorator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { JobStatus } from 'common/enum/jobStatus.enum'

export class UpdateVacancyRequestDto {
  @IsString()
  @Optional()
  @Length(1, 50)
  name?: string

  @IsUUID()
  @Optional()
  designationid?: string

  @IsString()
  @Optional()
  jobLevel?: string

  @IsString()
  @Optional()
  salary?: string

  @IsString()
  @Optional()
  @Length(1, 200)
  skills: string

  @Optional()
  @Transform(({ value }) => {
    return Number(value)
  })
  @IsNumber()
  experience?: number

  @Optional()
  @IsEnum(JobType)
  jobType?: JobType

  @Optional()
  @IsDateString()
  deadline?: Date

  @Optional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value)
  })
  vacancyOpening?: number

  @Optional()
  @IsString()
  description?: string

  @Optional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @Optional()
  @ApiProperty({
    description: 'image of the vacany',
    type: 'string',
    format: 'binary'
  })
  image?: Express.Multer.File
}
