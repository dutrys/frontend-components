import { ReadonlyURLSearchParams } from "next/navigation";

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
  sortBy: string[][];
};

export const getPreviousPageParam = <T extends { meta: ResponseMeta }>(page?: T): number | undefined =>
  !page?.meta || page?.meta?.currentPage === 1 ? undefined : page.meta.currentPage - 1;

export const getNextPageParam = <T extends { meta: ResponseMeta }>(page?: T): number | undefined =>
  !page?.meta || page?.meta?.currentPage >= page.meta?.totalPages ? undefined : page.meta.currentPage + 1;

export const setPartialParams = (
  partialParams: Record<string, any>,
  searchParams: ReadonlyURLSearchParams | null,
): string => {
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
  Object.keys(partialParams).forEach((key) => {
    const value = partialParams[key].toString();
    if (value === "" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });
  return `?${params}`;
};

export const isParamActive = (link: Record<string, string>, searchParams: ReadonlyURLSearchParams): boolean => {
  for (const key in link) {
    if (link[key] === "" && !searchParams.has(key)) {
      continue;
    }
    if (link[key] !== searchParams.get(key)) {
      return false;
    }
  }

  return true;
};
