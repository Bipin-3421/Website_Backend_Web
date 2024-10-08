import {
  PaginationParamDTO,
  PaginationResponseDTO
} from '../dto/pagination.dto'

export function getPaginationResponse(
  entities: any[],
  total: number,
  input: PaginationParamDTO
): PaginationResponseDTO {
  const page = input.take && input.page ? input.page : 0
  const take = input.take || total

  const hasMore = total > (page + 1) * take
  const maxPage = Math.ceil(total / take) - 1

  return {
    previousPage: page === 0 ? null : Math.min(page - 1, maxPage),
    nextPage: hasMore ? page + 1 : null,
    total,
    count: entities.length
  }
}
