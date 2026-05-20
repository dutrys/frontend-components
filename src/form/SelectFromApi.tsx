import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectProps } from "./Select";
import { LoadingComponent } from "../Loading";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

export type SelectFromApiProps<TModel = unknown> = {
  queryFn: () => Promise<TModel[]>;
  queryKey: ReadonlyArray<any>;
  value: number | string | null;
  onChange: (model: TModel | null) => void;
  optionLabel?: (model: TModel) => string;
  optionValue?: (model: TModel) => string | number;
  filter?: (model: TModel, query: string) => boolean;
} & Omit<SelectProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;

const ITEMS_PER_PAGE = 50;

export const SelectFromApi = <TModel = unknown,>({
  name,
  value,
  queryKey,
  queryFn,
  optionLabel = (model) => (model as any).name,
  optionValue = (model) => (model as any).id,
  filter,
  ...rest
}: SelectFromApiProps<TModel>) => {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const { isLoading, data, refetch } = useQuery<TModel[]>({
    enabled: !rest.disabled,
    queryKey: [...queryKey, rest.disabled],
    queryFn: () => {
      if (rest.disabled) {
        return Promise.reject();
      }
      return queryFn();
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const hasNextPage = currentPage * ITEMS_PER_PAGE < (data?.length ?? 0);
  const fetchNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [hasNextPage]);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    void refetch();
  }, [refetch, query]);

  useEffect(() => {
    if (inView && hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [inView, hasNextPage]);

  const options = filter && data ? data.filter((model) => filter(model, query)) : (data ?? []);
  return (
    <Select<TModel>
      {...rest}
      disabled={rest.disabled}
      onChange={rest.onChange}
      optionLabel={optionLabel}
      options={options.slice(0, currentPage * ITEMS_PER_PAGE)}
      onQueryChange={setQuery}
      afterInput={isLoading ? <LoadingComponent loadingClassName="size-4 text-primary" /> : undefined}
      hideNoItemsOption={isLoading}
      value={
        typeof value === "number" || typeof value === "string"
          ? ((data || []).find((b: TModel) => optionValue(b) === value) ?? null)
          : (value ?? null)
      }
      afterOptions={
        <>
          {rest.afterOptions}
          {isLoading ? (
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
