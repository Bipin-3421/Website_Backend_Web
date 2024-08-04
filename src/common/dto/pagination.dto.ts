import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';

export class PaginationDto {
  @Optional()
  @Transform(({ value }) => (value ? parseInt(value) : value))
  @IsNumber()
  take: number = 10;

  @Optional()
  @IsNumber()
  @Transform(({ value }) => (value ? parseInt(value) : value))
  page: number = 10;
}
