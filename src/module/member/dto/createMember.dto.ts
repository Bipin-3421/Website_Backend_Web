import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsNotEmpty, IsEnum } from 'class-validator';
import { MemberRole } from 'common/enum/memberRole.enum';

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
