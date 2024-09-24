import {
  PaginationParamDTO,
  PaginationResponseDTO,
} from '../dto/pagination.dto';

export function getPaginationResponse(
  res: any[],
  total: number,
  input: PaginationParamDTO,
): PaginationResponseDTO {
  const previousPage = input.page && input.page > 0 ? input.page - 1 : null;
  const nextPage = input.page ? input.page + 1 : 1;
  const take = input.take ? input.take : 10;

  return {
    previousPage: previousPage,
    nextPage: total > nextPage * take ? nextPage : null,
    total,
    count: res.length,
  };
}
