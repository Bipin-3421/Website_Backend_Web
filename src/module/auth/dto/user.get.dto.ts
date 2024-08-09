import { PaginationResponseDTO } from 'common/dto/response.dto';
import { User } from 'common/entities/user.entity';

export class ListGetUsersResponseDTO {
  message: string;

  data: User[];

  pagination: PaginationResponseDTO;
}
