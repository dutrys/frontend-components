import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Portal,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import cx from "classnames";
import { useInView } from "react-intersection-observer";
import { useFloating, autoUpdate, size as floatingSize } from "@floating-ui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { getNextPageParam, getPreviousPageParam, PaginateQuery, ResponseMeta } from "@/utils/paginate";
import { LoadingComponent } from "@/Loading";
import { SelectOption } from "@/form/Select";

export type SelectPaginatedFromApiProps<TModel extends { meta: ResponseMeta; data: { id: number }[] }> = {
  size?: "sm" | "xs";
  name?: string;
  inputRef?: any;
  queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
  queryKey: ReadonlyArray<any>;
  placeholder?: string;
  value: TModel["data"][0] | number | null;
  className?: string;
  onChange: (model: TModel["data"][0] | null) => void;
  disabled?: boolean;
  required?: boolean;
  empty?: string;
  valueFormat?: (model: TModel["data"][0]) => string;
  heading?: React.ReactNode;
  footer?: React.ReactNode;
  searchFromChars?: number;
};

export const SelectPaginatedFromApi = <TModel extends { meta: ResponseMeta; data: { id: number }[] }>({
  onChange,
  disabled,
  required,
  inputRef,
  name,
  value,
  size,
  searchFromChars = 3,
  className,
  queryKey,
  queryFn,
  placeholder,
  empty,
  valueFormat = (model) => (model as any).name,
  heading,
  footer,
  ...rest
}: SelectPaginatedFromApiProps<TModel>) => {
  const [query, setQuery] = useState(value ? `${value}` : "");
  const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TModel>({
    getPreviousPageParam,
    getNextPageParam,
    enabled: !disabled,
    queryKey: [...queryKey, disabled, query.length < searchFromChars ? "" : query],
    initialPageParam: 1,
    queryFn: ({ queryKey, pageParam }) => {
      if (disabled) {
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
        .find((b: TModel["data"][0]) => b.id === value);
      if (selected) {
        onChange(selected);
      }
    }
  }, [isLoading]);

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Combobox<TModel["data"][0] | null>
      immediate
      data-testid="select"
      disabled={disabled}
      value={
        typeof value === "number"
          ? (data?.pages || [])
              .map((d) => d?.data || [])
              .flat()
              .find((b: TModel["data"][0]) => b.id === value) || null
          : (value ?? null)
      }
      onChange={onChange}
      {...rest}
    >
      {({ open }) => (
        <div>
          <div
            className={cx("relative input input-bordered pr-1", className, {
              "w-full": !className?.includes("w-"),
              "input-sm gap-1": size === "sm",
              "input-xs gap-0.5": size === "xs",
            })}
            ref={refs.setReference}
          >
            <ComboboxInput
              required={required}
              ref={inputRef}
              data-testid="select-input"
              placeholder={placeholder}
              onFocus={(e) => e?.target?.select()}
              autoComplete="off"
              name={name}
              displayValue={(model: TModel["data"][0]) => (model ? valueFormat(model) : "")}
              onChange={(event) => setQuery(event.target.value)}
            />
            {isLoading && !disabled ? (
              <LoadingComponent
                className={cx("absolute right-6", { invisible: open })}
                loadingClassName="size-4 text-primary"
              />
            ) : (
              !required &&
              value && (
                <button className="absolute right-6 z-1 cursor-pointer" type="button" onClick={() => onChange(null)}>
                  <XMarkIcon className="size-4" />
                </button>
              )
            )}
            <ComboboxButton
              data-testid="select-input-btn"
              className=""
              onClick={(e) => {
                (e.target as HTMLButtonElement)?.parentNode?.parentNode?.querySelector("input")?.select();
              }}
            >
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
          </div>
          <Portal>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div style={{ ...floatingStyles, zIndex: 2000 }} ref={refs.setFloating}>
                <ComboboxOptions className="absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm">
                  {heading}
                  {!required && query.length < searchFromChars && data && data?.pages?.[0]?.meta?.totalItems !== 0 && (
                    <SelectOption data-testid="select-option-empty" key="empty" value={null} size={size}>
                      {empty || t("selectFromApi.select")}
                    </SelectOption>
                  )}
                  {data?.pages?.[0]?.meta?.totalItems === 0 ? (
                    <div className="cursor-default select-none py-2 px-4 text-base-content/60">
                      <span className={cx({ "text-xs": "xs" === size || "sm" === size })}>
                        {t("selectFromApi.nothingFound")}
                      </span>
                    </div>
                  ) : (
                    data?.pages
                      ?.map((d) => d?.data || [])
                      .flat()
                      .map((model: TModel["data"][0], i: number) => (
                        <SelectOption data-testid={`select-option-${i}`} key={model.id} value={model} size={size}>
                          {valueFormat(model)}
                        </SelectOption>
                      ))
                  )}

                  {footer}

                  {isFetchingNextPage || isLoading ? (
                    <LoadingComponent className="my-2" />
                  ) : (
                    hasNextPage && (
                      <div className="text-center">
                        <button
                          ref={ref}
                          className="btn btn-ghost btn-xs my-1 btn-wide"
                          onClick={() => fetchNextPage()}
                        >
                          {t("infiniteScroll.loadMore")}
                        </button>
                      </div>
                    )
                  )}
                </ComboboxOptions>
              </div>
            </Transition>
          </Portal>
        </div>
      )}
    </Combobox>
  );
};
