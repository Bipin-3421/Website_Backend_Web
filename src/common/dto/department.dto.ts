import { IsString, IsUUID } from 'class-validator';

export class DepartmentDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
