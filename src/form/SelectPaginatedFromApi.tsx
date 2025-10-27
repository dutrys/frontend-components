import { useInfiniteQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, use, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getNextPageParam, getPreviousPageParam, PaginateQuery, ResponseMeta } from "@/utils/paginate";
import cx from "classnames";
import { LoadingComponent } from "@/Loading";
import { useInView } from "react-intersection-observer";

export type SelectPaginatedFromApiProps<TModel extends { meta: ResponseMeta; data: { id: number }[] }> = {
  size?: "sm" | "xs";
  inputClassName?: string;
  name?: string;
  inputRef?: any;
  queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
  queryKey: ReadonlyArray<any>;
  placeholder?: string;
  optionsClassName?: string;
  value: TModel["data"][0] | number | null;
  className?: string;
  onChange: (model: TModel["data"][0]) => void;
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
  optionsClassName,
  empty,
  valueFormat = (model) => (model as any).name,
  inputClassName = "w-full mx-0 input input-bordered",
  heading,
  footer,
  ...rest
}: SelectPaginatedFromApiProps<TModel>) => {
  const [query, setQuery] = useState("");
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
          : value
            ? value
            : null
      }
      onChange={onChange}
      {...rest}
    >
      <div className={`relative ${className}`}>
        <div className="w-full relative p-0">
          <ComboboxInput
            required={required}
            ref={inputRef}
            data-testid="select-input"
            placeholder={placeholder}
            onFocus={(e) => e?.target?.select()}
            autoComplete="off"
            name={name}
            className={cx(inputClassName, {
              "input-sm": size === "sm",
              "input-xs": size === "xs",
            })}
            displayValue={(model: TModel["data"][0]) => (model ? valueFormat(model) : "")}
            onChange={(event) => setQuery(event.target.value)}
          />
          {isLoading && !disabled && (
            <LoadingComponent className="absolute z-1 inset-y-0 right-5 p-3" loadingClassName="size-4 text-primary" />
          )}
          <ComboboxButton
            data-testid="select-input-btn"
            className="absolute z-1 cursor-pointer inset-y-0 right-0 flex items-center pr-2"
            onClick={(e) => {
              (e.target as HTMLButtonElement)?.parentNode?.parentNode?.querySelector("input")?.select();
            }}
          >
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ComboboxOptions
            className={`absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm ${optionsClassName || ""}`}
          >
            {heading}
            {!required && query.length < searchFromChars && data && data?.pages?.[0]?.meta?.totalItems !== 0 && (
              <ComboboxOption
                data-testid="select-option-empty"
                key="empty"
                className={({ focus }) =>
                  `relative select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`
                }
                value={null}
              >
                <span className={cx("block truncate", { "text-xs": "xs" === size || "sm" === size })}>
                  {empty || t("selectFromApi.select")}
                </span>
              </ComboboxOption>
            )}
            {data?.pages?.[0]?.meta?.totalItems === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                <span className={cx({ "text-xs": "xs" === size || "sm" === size })}>
                  {t("selectFromApi.nothingFound")}
                </span>
              </div>
            ) : (
              data?.pages
                ?.map((d) => d?.data || [])
                .flat()
                .map((model: TModel["data"][0], i: number) => (
                  <ComboboxOption
                    data-testid={`select-option-${i}`}
                    key={model.id}
                    className={({ focus }) =>
                      `relative cursor-default select-none py-2 pl-4 pr-4 ${
                        focus ? "bg-primary text-white" : "text-gray-900"
                      }`
                    }
                    value={model}
                  >
                    {({ selected, focus }) => (
                      <>
                        <span
                          className={cx("block truncate", {
                            "text-white": focus,
                            "pr-3 font-bold": selected,
                            "font-normal": !selected,
                            "text-xs": "xs" === size || "sm" === size,
                          })}
                        >
                          {valueFormat(model)}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 right-1 flex items-center pl-3 ${
                              focus ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
            )}

            {footer}

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
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};
