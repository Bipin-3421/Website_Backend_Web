import { PaginationDto } from 'common/dto/vacancy.search.dto';

export const takePagination = (
  res: any[],
  query: PaginationDto,
  total: number,
) => {
  const nextPage = query.page ? query.page + 1 : 1;
  const take = query.take ? query.take : 10;
  return {
    previousPage: query.page ? query.page - 1 : null,
    nextPage: nextPage * take < total ? nextPage : null,
    count: res.length,
    total: total,
  };
};
