import { IsString, IsEmail } from 'class-validator';

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

export class SingleContactResponseDTO {
  message: string;
  data: {
    id: string;
  };
}

export class GetContactDTO {
  id: string;
  createdAt: Date;
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

export class GetContactResponseDTO {
  message: string;
  data: GetContactDTO;
}

export class DeleteContactDTO {
  message: string;
}
