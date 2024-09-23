import { PaginationResponseDTO } from 'common/dto/pagination.dto';
import { User } from 'common/entities/user.entity';

export class ListGetUsersResponseDTO {
  message: string;

  data: User[];

  pagination: PaginationResponseDTO;
}
