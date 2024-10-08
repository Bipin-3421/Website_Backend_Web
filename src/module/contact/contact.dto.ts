import { IntersectionType } from '@nestjs/swagger';
import { IsString, IsEmail, IsUUID, IsEnum } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { ContactStatus } from 'common/enum/contactStatus.enum';
import {
  PaginationParamDTO,
  PaginationResponseDTO,
} from 'common/dto/pagination.dto';
import { SearchParamDTO } from 'common/dto/search.dto';
import { DateFilterDTO } from 'common/dto/date.filter';

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
  DateFilterDTO,
) {
  @Optional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}

export class ListContactResponseDTO {
  message: string;

  data: ListContactDTO[];

  pagination: PaginationResponseDTO;
}

export class UpdateContactRequestDTO {
  @Optional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;
}

export class ContactIdDTO {
  @IsUUID()
  contactId: string;
}
