import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ComboBox, ComboBoxProps } from "./ComboBox";
import { LoadingComponent } from "../Loading";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";
import cx from "classnames";

export type ComboBoxFromApiProps<TModel = unknown> = {
  queryFn: () => Promise<TModel[]>;
  queryKey: ReadonlyArray<any>;
  value: number | string | null;
  onChange: (model: TModel | null) => void;
  optionLabel?: (model: TModel, inOptions: boolean) => string;
  optionValue?: (model: TModel) => string | number;
  filter?: (model: TModel, query: string) => boolean;
} & Omit<ComboBoxProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;

const ITEMS_PER_PAGE = 50;

export const ComboBoxFromApi = <TModel = unknown,>({
  name,
  value,
  queryKey,
  queryFn,
  optionLabel = (model) => (model as any).name,
  optionValue = (model) => (model as any).id,
  filter,
  ...rest
}: ComboBoxFromApiProps<TModel>) => {
  const t = useTranslations();
  const [query, setQuery] = useState("");

  const { isLoading, data } = useQuery<TModel[]>({
    enabled: !rest.disabled,
    queryKey,
    queryFn,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const onQueryChange = useCallback((q: string) => {
    setQuery(q);
    setCurrentPage(1);
  }, []);
  const matches =
    filter ?? ((model: TModel, q: string) => optionLabel(model, true).toLowerCase().includes(q.trim().toLowerCase()));
  const options = data ? data.filter((model) => matches(model, query)) : [];
  const hasNextPage = currentPage * ITEMS_PER_PAGE < options.length;
  const fetchNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [hasNextPage]);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage) {
      setCurrentPage((p) => p + 1);
    }
  }, [inView, hasNextPage]);

  const loadingClassName = cx("text-primary", {
    "loading-sm": !rest.size,
    "loading-xs": rest.size === "xs" || rest.size === "sm",
  });
  return (
    <ComboBox<TModel>
      {...rest}
      disabled={rest.disabled}
      onChange={rest.onChange}
      optionLabel={optionLabel}
      options={options.slice(0, currentPage * ITEMS_PER_PAGE)}
      onQueryChange={onQueryChange}
      afterInput={isLoading ? <LoadingComponent loadingClassName={loadingClassName} /> : undefined}
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
            <LoadingComponent className="my-2" loadingClassName={loadingClassName} />
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

/**
 * @deprecated use ComboBoxFromApi
 */
export const SelectFromApi = ComboBoxFromApi;
