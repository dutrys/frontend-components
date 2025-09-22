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
  partialParams: Record<string, string | string[]>,
  searchParams: ReadonlyURLSearchParams | null,
): string => {
  const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
  Object.keys(partialParams).forEach((key) => {
    const value = partialParams[key];
    if (value === "" || !value) {
      params.delete(key);
      params.delete(`${key}[]`);
    } else if (Array.isArray(value)) {
      params.delete(key);
      params.delete(`${key}[]`);
      for (const item of value) {
        params.append(`${key}[]`, item);
      }
    } else {
      params.delete(`${key}[]`);
      params.set(key, value);
    }
  });
  return `?${params}`;
};

export const isParamActive = (
  link: Record<string, string | string[]>,
  searchParams: ReadonlyURLSearchParams,
): boolean => {
  for (const key of Object.keys(link)) {
    if (link[key] === "" && !searchParams.has(key)) {
      continue;
    }
    if (Array.isArray(link[key])) {
      if (!link[key].every((item) => searchParams.getAll(`${key}[]`).includes(item))) {
        return false;
      }
    } else if (link[key] !== searchParams.get(key)) {
      return false;
    }
  }

  return true;
};
