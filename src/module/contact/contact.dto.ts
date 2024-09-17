import { PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsUUID } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { jobStatus } from 'common/enum/jobStatus.enum';
import { SearchParamDTO } from 'common/general.dto';

export class CreateContactDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  message: string;
}

export class GetContactDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: string;
}

export class ListResponseDTO {
  message: string;
  data: GetContactDTO[];
}
export class GetSingleContactDTO {
  data: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    email: string;
    phoneNumber: string;
    message: string;
    status: string;
  };
}

export class ListContactQueryDTO extends PartialType(SearchParamDTO) {}

export class UpdateContactRequestDTO {
  @IsString()
  @Optional()
  status?: jobStatus;
}

export class ContactIdDTO {
  @IsUUID()
  contactId: string;
}
