import { useQuery } from "@tanstack/react-query";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { PaginateQuery } from "@/utils/paginate";

const PAGINATE_LIMIT = 50;

export const SelectPaginatedFromApi = <
  TModel extends { meta: { currentPage: number; totalItems: number; totalPages: number }; data: { id: number }[] },
>({
  onChange,
  disabled,
  required,
  value,
  className,
  queryKey,
  allowEmpty,
  queryFunction,
  placeholder,
  valueFormat = (model) => (model as any).name,
  inputClassName = "w-full mx-0 input input-bordered",
  ...rest
}: {
  inputClassName?: string;
  queryFunction?: (query: PaginateQuery<any>) => Promise<TModel | undefined>;
  queryKey: ReadonlyArray<any>;
  placeholder?: string;
  value: number | null;
  className?: string;
  allowEmpty?: boolean | string;
  onChange: (model: TModel["data"][0]) => void;
  disabled?: boolean;
  required?: boolean;
  valueFormat?: (model: TModel["data"][0]) => string;
}) => {
  const [query, setQuery] = useState("");
  const { isLoading, data, refetch } = useQuery({
    enabled: !disabled,
    queryKey: [...queryKey, query],
    queryFn: ({ queryKey }) => {
      if (!queryFunction) {
        return null;
      }
      const search = queryKey[queryKey.length - 1] || "";
      if (search === "") {
        return queryFunction({ limit: 100 });
      }

      return search.length >= PAGINATE_LIMIT ? queryFunction({ search, limit: 100 }) : null;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const t = useTranslations("SelectFromApi");

  useEffect(() => {
    void refetch();
  }, [refetch, query]);

  return (
    <Combobox<TModel["data"][0] | null>
      immediate
      data-testid="select"
      disabled={disabled}
      value={(data?.data || []).find((b: TModel["data"][0]) => b.id === value) || null}
      onChange={onChange}
      {...rest}
    >
      <div className={`relative ${className}`}>
        <div className="w-full relative input p-0">
          <ComboboxInput
            required={required}
            data-testid="select-input"
            placeholder={placeholder}
            onFocus={(e) => e?.target?.select()}
            className={inputClassName}
            displayValue={(model: TModel["data"][0]) => (model ? valueFormat(model) : "")}
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton data-testid="select-input-btn" className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ComboboxOptions className="absolute z-10 mt-2 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/50 focus:outline-hidden sm:text-sm">
            {allowEmpty && (
              <ComboboxOption
                data-testid="select-option-empty"
                key="empty"
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-4 pr-4 ${
                    active ? "bg-primary-600 text-white" : "text-gray-900"
                  }`
                }
                value={undefined}
              >
                <span className="block truncate">{typeof allowEmpty === "string" ? allowEmpty : t("empty")}</span>
              </ComboboxOption>
            )}
            {isLoading || !data?.data || data?.data?.length === 0 ? (
              <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                {query.length > 0 && query.length < PAGINATE_LIMIT
                  ? t("enter more symbols", { value: PAGINATE_LIMIT })
                  : isLoading || data?.data === null
                    ? t("searching")
                    : t("nothing found")}
              </div>
            ) : (
              data?.data.map((model: TModel["data"][0], i: number) => (
                <ComboboxOption
                  data-testid={`select-option-${i}`}
                  key={model.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-4 pr-4 ${
                      active ? "bg-primary-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={model}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${active ? "text-white" : ""} ${
                          selected ? "pr-3 font-bold" : "font-normal"
                        }`}
                      >
                        {valueFormat(model)}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-1 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
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
          </ComboboxOptions>
        </Transition>
      </div>
    </Combobox>
  );
};
