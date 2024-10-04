import { IsString, IsUUID } from 'class-validator';

export class AssetDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  url: string;
}
