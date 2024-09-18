import { IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { Optional } from './decorator/optional.decorator';

export class SearchParamDTO {
  @IsString()
  @Optional()
  search: string | undefined;
}

export class PaginationParamDTO {
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  @Optional()
  take: number | undefined;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  @Min(0)
  @Optional()
  page: number | undefined;
}

export class PaginationResponseDTO {
  @IsNumber()
  @Optional()
  previousPage: number | null;

  @IsNumber()
  @Optional()
  nextPage: number | null;

  @IsNumber()
  total: number;

  @IsNumber()
  count: number;
}
