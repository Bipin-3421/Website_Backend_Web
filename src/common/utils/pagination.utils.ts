export const takePagination = (page: number, take: number, total: number) => {
  const nextPage = page + 1;
  return {
    previousPage: page <= 0 ? null : page - 1,
    nextPage: nextPage * take >= total ? null : nextPage,
    count: take,
    total: total,
  };
};
