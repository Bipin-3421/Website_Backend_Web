import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @ApiProperty({
    type: String,
    example: 'John',
    description: 'The first name of the user',
    maxLength: 20,
    minLength: 2,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    type: String,
    maxLength: 20,
    minLength: 2,
    example: 'Doe',
    description: 'The last name of the user',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    type: Boolean,
    description: 'The active status of the user',
    required: false,
  })
  @IsOptional()
  isActive: boolean;
}
