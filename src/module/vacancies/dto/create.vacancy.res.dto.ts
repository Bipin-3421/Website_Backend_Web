import { IsNotEmpty, IsString } from 'class-validator';

export class CreateVacancyResDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  data: string;
}
