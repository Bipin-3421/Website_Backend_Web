import { PaginationDto } from 'common/dto/pagination.dto';

export const takePagination = (
  res: any[],
  query: PaginationDto,
  total: number,
) => {
  const previousPage = query.page ? query.page - 1 : null;
  const nextPage: number = query.page ? query.page + 1 : 1;
  const take = query.take ? query.take : 10;

  return {
    previousPage: previousPage == -1 ? null : previousPage,
    nextPage: nextPage * take > total ? null : nextPage,
    count: res.length,
    total: total,
  };
};
