import { IsNumber } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';

export class MessageResponseDto {
  message: string;
}

export class MessageResponseWithIdDto {
  message: string;
  data: {
    id: string;
  };
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
