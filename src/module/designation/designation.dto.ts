import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsUUID } from 'class-validator';

export class CreateDesignationDTO {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @ApiProperty({
    description: 'image of the designation',
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;

  @IsString()
  @Length(1, 200)
  description: string;
}
