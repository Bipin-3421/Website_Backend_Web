import { IsNumber } from 'class-validator';
import { Optional } from 'common/decorator/optional.decorator';

export class MessageResponseDTO {
  message: string;
}

export class MessageResponseWithIdDTO {
  message: string;

  data: {
    id: string;
  };
}
