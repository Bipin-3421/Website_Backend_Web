import { IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsString, IsEmail, IsNumber } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { PaginationDto } from 'common/dto/pagination.dto';
import { ApplicationStatus } from 'common/enum/applicant.status.enum';

export class ApplicantSearchParamDto {
  @Optional()
  @IsEnum(ApplicationStatus)
  applicantStatus?: ApplicationStatus;

  @Optional()
  @IsString()
  designation: string;

  @Optional()
  @IsString()
  name: string;

  @Optional()
  @IsNumber()
  phone: string;

  @Optional()
  @IsString()
  address: string;

  @Optional()
  @IsEmail()
  email: string;

  @Optional()
  @IsString()
  referalSource: string;
}

export class ApplicantFilterDto extends IntersectionType(
  ApplicantSearchParamDto,
  PaginationDto,
) {}
