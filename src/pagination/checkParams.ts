import { PaginateQuery } from "@/utils";

export const checkParams = <T>(searchParams: Record<string, any>): PaginateQuery<T> => {
  const params: PaginateQuery<T> = {};
  if (typeof searchParams.limit === "string") {
    const limit = parseInt(searchParams.limit, 10);
    if (limit > 0) {
      params.limit = limit;
    }
  }

  if (typeof searchParams.page === "string") {
    const page = parseInt(searchParams.page, 10);
    if (page > 0) {
      params.page = page;
    }
  }

  if (typeof searchParams.sortBy === "string") {
    params.sortBy = searchParams.sortBy as any;
  }

  Object.keys(searchParams)
    .filter(
      (key) => key.startsWith("filter.") && (Array.isArray(searchParams[key]) || typeof searchParams[key] === "string"),
    )
    .forEach((key: any) => {
      params[key] = searchParams[key];
    });

  if (typeof searchParams.search === "string" && searchParams.search.length >= 2) {
    params.search = searchParams.search;
  }

  return params;
};
