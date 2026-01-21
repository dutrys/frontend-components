import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import { getNextPageParam, getPreviousPageParam, PaginateQuery, ResponseMeta } from "../utils/paginate";
import { LoadingComponent } from "../Loading";
import { Select, SelectProps } from "./Select";

export type SelectPaginatedFromApiProps<TModel extends { meta: ResponseMeta; data: unknown[] }> = {
  name?: string;
  queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
  queryKey: ReadonlyArray<any>;
  value: TModel["data"][0] | string | number | null;
  optionValue?: (model: TModel["data"][0]) => string | number;
  searchFromChars?: number;
} & Omit<SelectProps<TModel["data"][0]>, "value" | "options">;

export const SelectPaginatedFromApi = <TModel extends { meta: ResponseMeta; data: unknown[] }>({
  onChange,
  name,
  value,
  searchFromChars = 3,
  queryKey,
  queryFn,
  optionLabel = (model) => (model as any).name,
  optionValue = (model) => (model as any).id,
  ...rest
}: SelectPaginatedFromApiProps<TModel>) => {
  const [query, setQuery] = useState(value ? `${value}` : "");
  const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TModel>({
    getPreviousPageParam,
    getNextPageParam,
    enabled: !rest.disabled,
    queryKey: [...queryKey, rest.disabled, query.length < searchFromChars ? "" : query],
    initialPageParam: 1,
    retry: rest.disabled ? 0 : undefined,
    queryFn: ({ queryKey, pageParam }) => {
      if (rest.disabled) {
        return Promise.reject();
      }
      const page = typeof pageParam === "number" ? pageParam : undefined;
      const search = queryKey[queryKey.length - 1] || "";
      if (typeof search !== "string" || search === "" || search.length < searchFromChars) {
        return queryFn({ page });
      }

      return queryFn({ search, page });
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const t = useTranslations();

  useEffect(() => {
    void refetch();
  }, [refetch, query]);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  useEffect(() => {
    if (!isLoading) {
      const selected = (data?.pages || [])
        .map((d) => d?.data || [])
        .flat()
        .find((b: TModel["data"][0]) => optionValue(b) === value);
      if (selected) {
        onChange(selected);
      }
    }
  }, [isLoading]);

  return (
    <Select<TModel["data"][0]>
      {...rest}
      disabled={rest.disabled}
      onChange={onChange}
      onQueryChange={setQuery}
      options={data?.pages.flatMap((d) => d?.data || []) ?? []}
      value={
        typeof value === "number" || typeof value === "string"
          ? ((data?.pages || [])
              .map((d) => d?.data || [])
              .flat()
              .find((b: TModel["data"][0]) => optionValue(b) === value) ?? null)
          : (value ?? null)
      }
      optionLabel={optionLabel}
      afterInput={isLoading ? <LoadingComponent loadingClassName="size-4 text-primary" /> : undefined}
      hideNoItemsOption={isLoading}
      afterOptions={
        <>
          {rest.afterOptions}
          {isFetchingNextPage || isLoading ? (
            <LoadingComponent className="my-2" />
          ) : (
            hasNextPage && (
              <div className="text-center">
                <button ref={ref} className="btn btn-ghost btn-xs my-1 btn-wide" onClick={() => fetchNextPage()}>
                  {t("infiniteScroll.loadMore")}
                </button>
              </div>
            )
          )}
        </>
      }
    />
  );
};
