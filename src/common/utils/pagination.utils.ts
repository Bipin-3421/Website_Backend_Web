import { PaginationDto } from 'common/dto/pagination.dto';

export const takePagination = (
  res: any[],
  query: PaginationDto,
  total: number,
) => {
  const previousPage = query.page ? query.page - 1 : null;
  const preNextPage: number = query.page ? query.page + 1 : 1;

  const nextPage = (preNextPage: number, take: number): number | null => {
    if (preNextPage * take > total) {
      return null;
    }

    return preNextPage;
  };
  const take = query.take ? query.take : 10;

  return {
    previousPage: previousPage == -1 ? null : previousPage,
    nextPage: Number(nextPage(preNextPage, take)),
    count: res.length,
    total: total,
  };
};
