export type PaginateQuery<T> = {
  page?: number;
  limit?: number;
  sortBy?: T[];
  search?: string;
  [key: `filter.${string}`]: string;
};

export type ResponseMeta = {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
};

export const getPreviousPageParam = <T extends { meta: ResponseMeta }>(page?: T): number | undefined =>
  !page?.meta || page?.meta?.currentPage === 1 ? undefined : page.meta.currentPage - 1;

export const getNextPageParam = <T extends { meta: ResponseMeta }>(page?: T): number | undefined =>
  !page?.meta || page?.meta?.currentPage >= page.meta?.totalPages ? undefined : page.meta.currentPage + 1;
