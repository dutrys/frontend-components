import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PaginateQuery } from "@/utils/paginate";
import cx from "classnames";
import { LoadingComponent } from "@/Loading";
import { useInView } from "react-intersection-observer";

const SEARCH_FROM_QUERY_LENGTH = 3;

export const SelectPaginatedFromApi = <
  TModel extends { meta: { currentPage: number; totalItems: number; totalPages: number }; data: { id: number }[] },
>({
  onChange,
  disabled,
  required,
  inputRef,
  value,
  size,
  className,
  queryKey,
  queryFn,
  placeholder,
  optionsClassName,
  empty,
  valueFormat = (model) => (model as any).name,
  inputClassName = "w-full mx-0 input input-bordered",
  ...rest
}: {
  size?: "sm" | "xs";
  inputClassName?: string;
  inputRef?: any;
  queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
  queryKey: ReadonlyArray<any>;
  placeholder?: string;
  optionsClassName?: string;
  value: number | null;
  className?: string;
  onChange: (model: TModel["data"][0]) => void;
  disabled?: boolean;
  required?: boolean;
  empty?: string;
  valueFormat?: (model: TModel["data"][0]) => string;
}) => {
  const [query, setQuery] = useState("");
  const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery<TModel>({
    getPreviousPageParam: ({ meta }) => (meta.currentPage === 1 ? undefined : meta.currentPage - 1),
    getNextPageParam: ({ meta }) => (meta.currentPage >= meta.totalPages ? undefined : meta.currentPage + 1),
    enabled: !disabled,
    queryKey: [...queryKey, query.length < SEARCH_FROM_QUERY_LENGTH ? "" : query],
    initialPageParam: 1,
    queryFn: ({ queryKey, pageParam }) => {
      let page = typeof pageParam === "number" ? pageParam : undefined;
      const search = queryKey[queryKey.length - 1] || "";
      if (typeof search !== "string" || search === "" || search.length < SEARCH_FROM_QUERY_LENGTH) {
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

  return (
    <Combobox<TModel["data"][0] | null>
      immediate
      data-testid="select"
      disabled={disabled}
      value={
        (data?.pages || [])
          .map((d) => d?.data || [])
          .flat()
          .find((b: TModel["data"][0]) => b.id === value) || null
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
            className={cx(inputClassName, {
              "input-sm": size === "sm",
              "input-xs": size === "xs",
            })}
            displayValue={(model: TModel["data"][0]) => (model ? valueFormat(model) : "")}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton data-testid="select-input-btn" className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ComboboxOptions
            className={`absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm ${optionsClassName || ""}`}
          >
            {!required && data && data?.pages?.[0]?.meta?.totalItems !== 0 && (
              <ComboboxOption
                data-testid="select-option-empty"
                key="empty"
                className={({ focus }) =>
                  `relative select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`
                }
                value={null}
              >
                <span className={cx("block truncate", { "text-xs": "xs" === size || "sm" === size })}>
                  {empty || t("selectFromApi.empty")}
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
                ?.map((d) => d.data || [])
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
