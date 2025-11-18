import React, { Fragment, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import cx from "classnames";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { LoadingComponent } from "@/Loading";
import { SelectOption } from "@/form/Select";

const SEARCH_FROM_QUERY_LENGTH = 3;

export const SelectFromApi = <TModel extends { id: number }>({
  onChange,
  disabled,
  required,
  inputRef,
  name,
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
  filter,
  ...rest
}: {
  size?: "sm" | "xs";
  inputClassName?: string;
  name?: string;
  inputRef?: any;
  queryFn: () => Promise<TModel[]>;
  queryKey: ReadonlyArray<any>;
  placeholder?: string;
  optionsClassName?: string;
  value: number | null;
  className?: string;
  onChange: (model: TModel) => void;
  disabled?: boolean;
  required?: boolean;
  empty?: string;
  valueFormat?: (model: TModel) => string;
  filter?: (model: TModel) => boolean;
}) => {
  const [query, setQuery] = useState("");
  const { isLoading, data, refetch } = useQuery<TModel[]>({
    enabled: !disabled,
    queryKey: [...queryKey, disabled],
    queryFn: () => {
      if (disabled) {
        return Promise.reject();
      }
      return queryFn();
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const t = useTranslations();

  useEffect(() => {
    void refetch();
  }, [refetch, query]);

  return (
    <Combobox<TModel | null>
      immediate
      data-testid="select"
      disabled={disabled}
      value={data?.find((b: TModel) => b.id === value) || null}
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
            displayValue={(model: TModel) => (model ? valueFormat(model) : "")}
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
            {!required && query.length < SEARCH_FROM_QUERY_LENGTH && data && data?.length !== 0 && (
              <SelectOption data-testid="select-option-empty" key="empty" size={size} value={null}>
                {empty || t("selectFromApi.select")}
              </SelectOption>
            )}
            {data?.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                <span className={cx({ "text-xs": "xs" === size || "sm" === size })}>
                  {t("selectFromApi.nothingFound")}
                </span>
              </div>
            ) : (
              data
                ?.filter((m) => (filter ? filter(m) : true))
                ?.map((model: TModel, i: number) => (
                  <SelectOption data-testid={`select-option-${i}`} key={model.id} value={model} size={size}>
                    {valueFormat(model)}
                  </SelectOption>
                ))
            )}

            {isLoading && <LoadingComponent className="my-2" />}
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};
