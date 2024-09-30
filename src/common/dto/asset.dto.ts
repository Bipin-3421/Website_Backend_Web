import { IsString, IsUUID } from 'class-validator';

export class AssetDTO {
  @IsString()
  @IsUUID()
  id: string | null;

  @IsString()
  name: string | null;

  @IsString()
  url: string | null;
}
