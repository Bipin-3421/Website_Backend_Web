import { IsString, IsOptional } from 'class-validator';

export class SearchParamDTO {
  @IsString()
  @IsOptional()
  search: string | undefined;
}
