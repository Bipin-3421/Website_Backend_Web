import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsNotEmpty,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';
import { AssetDTO } from 'common/dto/asset.dto';
import { MemberRole } from 'common/enum/memberRole.enum';
import {
  PaginationParamDTO,
  PaginationResponseDTO,
} from 'common/dto/pagination.dto';
import { SearchParamDTO } from 'common/dto/search.dto';

export class CreateMemberRequestDTO {
  @Length(1, 50)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  designation: string;

  @IsEnum(MemberRole)
  role: MemberRole;

  @ApiProperty({
    description: 'image of the member',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}

export class ListMemberDTO {
  id: string;

  name: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;

  phoneNumber: string;

  designation: string;

  role: MemberRole;

  image: AssetDTO | null;
}

export class singleMemberResponseDTO {
  message: string;

  data: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    phoneNumber: string;
    designation: string;
    role: MemberRole;
    image: AssetDTO | null;
  };
}

export class ListMemberResponseDTO {
  message: string;

  data: ListMemberDTO[];

  pagination: PaginationResponseDTO;
}

export class ListMemberQueryDTO extends IntersectionType(
  SearchParamDTO,
  PaginationParamDTO,
) {
  @Optional()
  role?: MemberRole;
}

export class MemberParamDTO {
  @IsUUID()
  memberId: string;
}

export class UpdateMemberRequestDTO {
  @Length(1, 50)
  @IsNotEmpty()
  @IsString()
  @Optional()
  name?: string;

  @IsString()
  @Optional()
  @IsEmail()
  email?: string;

  @IsString()
  @Optional()
  phoneNumber?: string;

  @Length(1, 50)
  @IsString()
  @Optional()
  designation?: string;

  @IsEnum(MemberRole)
  @IsString()
  @Optional()
  role?: MemberRole;

  @ApiProperty({
    description: 'image of the member',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @Optional()
  image?: Express.Multer.File;
}

export class MemberLoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class MemberVerifyDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}

export class VerifyResponseDTO {
  message: string;

  data: {
    accessToken: string;
  };
}
