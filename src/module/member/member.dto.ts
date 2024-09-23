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

  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @Length(1, 50)
  @IsString()
  designation: string;

  @IsEnum(MemberRole)
  @IsString()
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
  image: AssetDTO;
  imageId: string;
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
  role: MemberRole;
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

  @Length(10, 10, { message: 'Phone number must be exactly 10 digits' })
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
  })
  @Optional()
  image?: Express.Multer.File;
}
