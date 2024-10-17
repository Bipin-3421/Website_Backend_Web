import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsString, IsNumber } from 'class-validator'
import { Optional } from 'common/decorator/optional.decorator'

export class CreateApplicantDto {
  @ApiProperty({ description: 'The name of the applicant' })
  @IsString()
  name: string

  @ApiProperty({ description: 'The email of the applicant' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'The phone number of the applicant' })
  @Optional()
  phone: string

  @ApiProperty({ description: 'The address of the applicant' })
  @IsString()
  address: string

  @ApiProperty({
    description: 'The cv of the applicant',
    type: 'string',
    format: 'binary'
  })
  cv: Express.Multer.File

  @ApiProperty({ description: 'The github url of the applicant' })
  @IsString()
  @Optional()
  githubUrl?: string

  @ApiProperty({ description: 'The portfolio url of the applicant' })
  @IsString()
  @Optional()
  portfolioUrl?: string

  @ApiProperty({ description: 'The desingation of the applicant' })
  @IsString()
  designationId: string

  @ApiProperty({ description: 'The work experience of the applicant' })
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value)
  })
  workExperience: number

  @ApiProperty({ description: 'The level of the applicant' })
  @IsString()
  level: string

  @ApiProperty({ description: 'The referal source of the applicant' })
  @IsString()
  @Optional()
  referralSource?: string

  @ApiProperty({ description: 'The vacancy id of the applicant' })
  @IsString()
  vacancyId: string
}
