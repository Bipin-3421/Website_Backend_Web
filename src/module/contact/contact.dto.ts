import { IntersectionType } from '@nestjs/swagger';
import { IsString, IsEmail, IsUUID, IsEnum } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { ContactStatus } from 'common/enum/contactStatus.enum';
import {
  PaginationParamDTO,
  PaginationResponseDTO,
  SearchParamDTO,
} from 'common/general.dto';

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

export class ListContactDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  status: string;
}

export class GetContactResponseDTO {
  message: string;
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

export class ListContactQueryDTO extends IntersectionType(
  SearchParamDTO,
  PaginationParamDTO,
) {}

export class ListContactResponseDTO {
  message: string;
  data: ListContactDTO[];
  pagination: PaginationResponseDTO;
}

export class UpdateContactRequestDTO {
  @IsString()
  @Optional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}

export class ContactIdDTO {
  @IsUUID()
  contactId: string;
}
