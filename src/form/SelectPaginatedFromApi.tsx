import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import { getNextPageParam, getPreviousPageParam, PaginateQuery, ResponseMeta } from "../utils/paginate";
import { LoadingComponent } from "../Loading";
import { Select, SelectProps } from "./Select";
import { captureException } from "@sentry/nextjs";

export type SelectPaginatedFromApiProps<TModel extends { meta: ResponseMeta; data: unknown[] }> = {
  name?: string;
  queryFn: (query: Omit<PaginateQuery<any>, "sortBy">) => Promise<TModel>;
  queryKey: ReadonlyArray<any>;
  value: TModel["data"][0] | string | number | null;
  optionValue?: (model: TModel["data"][0]) => string | number;
  searchFromChars?: number;
  onInitialChange?: (model: TModel["data"][0]) => void;
  /** How long loaded pages are reused before refetching, e.g. when the select is mounted again */
  staleTime?: number;
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
  onInitialChange,
  staleTime,
  ...rest
}: Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size" | "multiple" | "defaultValue" | "type" | "value" | "children" | "onChange"
> &
  SelectPaginatedFromApiProps<TModel>) => {
  const [query, setQuery] = useState("");
  const [valueModel, setValueModel] = useState<TModel["data"][0] | null>(typeof value === "object" ? value : null);
  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TModel>({
    getPreviousPageParam,
    getNextPageParam,
    enabled: !rest.disabled,
    queryKey: [
      ...queryKey,
      JSON.stringify({
        disabled: rest.disabled,
        fetchSelected: value && typeof value === "object" ? optionValue(value) : undefined,
      }),
      query.length < searchFromChars ? "" : query,
    ],
    initialPageParam: 1,
    retry: rest.disabled && !value ? 0 : undefined,
    staleTime,
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

  useEffect(() => {
    if (!value) {
      setQuery("");
    }
  }, [value]);

  // value given as id: take the model from loaded pages, otherwise fetch it by id once (cached by react-query)
  const idValue =
    value !== null && value !== undefined && value !== "" && typeof value !== "object" ? `${value}` : null;
  const loadedModel =
    idValue === null
      ? undefined
      : valueModel && `${optionValue(valueModel)}` === idValue
        ? valueModel
        : data?.pages?.flatMap((p) => p?.data || []).find((v) => `${optionValue(v)}` === idValue);
  const { data: byId } = useQuery({
    queryKey: [...queryKey, "byId", idValue],
    queryFn: () => queryFn({ "filter.id": [idValue as string] }),
    enabled: idValue !== null && !loadedModel && !isLoading,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!value) {
      if (valueModel) {
        setValueModel(null);
      }
      return;
    }
    if (typeof value === "object") {
      setValueModel(value);
      onInitialChange?.(value);
      return;
    }
    if (loadedModel) {
      if (loadedModel !== valueModel) {
        setValueModel(loadedModel);
        onInitialChange?.(loadedModel);
      }
      return;
    }
    if (!byId) {
      return;
    }
    if (byId.data.length !== 1 || (byId.data[0] && `${optionValue(byId.data[0])}` !== idValue)) {
      captureException(`Expected 1 model, but pagination filtering does not work in your backend api`, {
        extra: { pager: byId },
      });
      const item = byId.data.find((v) => `${optionValue(v)}` === idValue);
      if (item) {
        console.error(
          `Found model #${optionValue(item)}. ${optionLabel(item, true)}, but pagination filtering does not work in your backend api`,
        );
        setValueModel(item);
        onInitialChange?.(item);
      } else {
        console.error(
          `No model found for ${JSON.stringify(value)}, but pagination filtering does not work in your backend api`,
          byId,
        );
      }
      return;
    }
    setValueModel(byId.data[0]);
    onInitialChange?.(byId.data[0]);
  }, [value, loadedModel, byId]);

  const t = useTranslations();

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <Select<TModel["data"][0]>
      {...rest}
      disabled={rest.disabled}
      onChange={(v) => {
        setValueModel(v);
        onChange(v);
      }}
      onQueryChange={setQuery}
      options={data?.pages.flatMap((d) => d?.data || []) ?? []}
      value={valueModel}
      optionLabel={optionLabel}
      afterInput={isLoading && !rest.disabled ? <LoadingComponent loadingClassName="size-4 text-primary" /> : undefined}
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
