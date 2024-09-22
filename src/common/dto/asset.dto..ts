import { IsString, IsUUID } from 'class-validator';

export class AssetDTO {
  @IsString()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
