import React, { useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import cx from "classnames";
import { useQuery } from "@tanstack/react-query";
import { SelectPaginatedFromApi, SelectPaginatedFromApiProps } from "../form/SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";

export type FilterOperator =
  | "$eq"
  | "$gt"
  | "$gte"
  | "$in"
  | "$null"
  | "$lt"
  | "$lte"
  | "$btw"
  | "$ilike"
  | "$sw"
  | "$contains"
  | "$not"
  | "$and"
  | "$or";

export type FilterOperators = Record<string, FilterOperator[]>;

/**
 * Values of a filter picked from a paginated api instead of typed, e.g. `calendarTemplateId`.
 * Props of SelectPaginatedFromApi which Search does not control itself.
 */
export type SearchFilterOptions<T extends { meta: ResponseMeta; data: unknown[] }> = Pick<
  SelectPaginatedFromApiProps<T>,
  "queryKey" | "queryFn"
> &
  Partial<
    Pick<
      SelectPaginatedFromApiProps<T>,
      | "optionLabel"
      | "optionValue"
      | "groupBy"
      | "searchFromChars"
      | "staleTime"
      | "placeholder"
      | "empty"
      | "header"
      | "beforeOptions"
      | "afterOptions"
      | "hideNoItemsOption"
      | "minWidth"
      | "maxHeight"
      | "portalEnabled"
    >
  >;

/** Filter which can be added in Search */
export type FilterField = {
  operators: FilterOperator[];
  /** Values picked from a paginated api instead of typed, e.g. `() => ({ queryKey, queryFn })` */
  pagination?: () => SearchFilterOptions<any>;
};

export type FilterFields = Record<string, FilterField>;

const baseOperators = ["$eq", "$in", "$ilike", "$null"] as const;
type BaseOperator = (typeof baseOperators)[number];

export type SearchOperator = BaseOperator | `$not:${BaseOperator}`;

export type SearchFilter = {
  key: string;
  operator: SearchOperator;
  value: string;
};

const operatorLabels: Record<SearchOperator, string> = {
  $eq: "=",
  "$not:$eq": "!=",
  $in: "IN",
  "$not:$in": "NOT IN",
  $ilike: "~=",
  "$not:$ilike": "!~=",
  $null: "IS NULL",
  "$not:$null": "IS NOT NULL",
};

/** Operators which do not take a value, e.g. `filter.id=$null` */
const isValueless = (operator: SearchOperator) => operator === "$null" || operator === "$not:$null";

/** Operators which take a comma separated list, e.g. `filter.id=$in:1,2,3` */
const isList = (operator: SearchOperator) => operator === "$in" || operator === "$not:$in";

const availableOperators = (operators: FilterOperator[]): SearchOperator[] => {
  const result: SearchOperator[] = [];
  for (const operator of baseOperators) {
    if (operators.includes(operator)) {
      result.push(operator);
      if (operators.includes("$not")) {
        result.push(`$not:${operator}`);
      }
    }
  }
  return result;
};

const parseFilterValue = (raw: string): Omit<SearchFilter, "key"> | null => {
  // `$not:` variants first, so `$not:$eq:1` does not get matched as something else
  const operators = Object.keys(operatorLabels).sort((a, b) => b.length - a.length) as SearchOperator[];
  for (const operator of operators) {
    if (isValueless(operator) ? raw === operator : raw.startsWith(`${operator}:`)) {
      return { operator, value: isValueless(operator) ? "" : raw.slice(operator.length + 1) };
    }
  }
  if (!raw.startsWith("$")) {
    return { operator: "$eq", value: raw };
  }
  return null;
};

export const parseSearchFilters = (
  filterFields: FilterFields,
  searchParams: URLSearchParams | { get: (key: string) => string | null },
): SearchFilter[] => {
  const filters: SearchFilter[] = [];
  for (const key of Object.keys(filterFields)) {
    const raw = searchParams.get(`filter.${key}[]`) ?? searchParams.get(`filter.${key}`);
    const parsed = raw ? parseFilterValue(raw) : null;
    if (parsed && availableOperators(filterFields[key].operators).includes(parsed.operator)) {
      filters.push({ key, ...parsed });
    }
  }
  return filters;
};

/**
 * Converts filters to query params. Filters which were removed are cleared, but only when the current
 * query param is one Search can represent, so filters set elsewhere (e.g. by Filter on a field without
 * the operator in `filterFields`) are left intact.
 */
export const searchFiltersToParams = (
  filterFields: FilterFields,
  filters: SearchFilter[],
  searchParams: URLSearchParams | { get: (key: string) => string | null },
): Record<string, string | string[]> => {
  // arrays are written by setPartialParams as `filter.key[]=...`
  const params: Record<string, string | string[]> = {};
  for (const key of parseSearchFilters(filterFields, searchParams).map((f) => f.key)) {
    params[`filter.${key}`] = "";
  }
  for (const filter of filters) {
    if (isValueless(filter.operator)) {
      params[`filter.${filter.key}`] = [filter.operator];
    } else {
      const value = isList(filter.operator)
        ? filter.value
            .split(",")
            .map((v) => v.trim())
            .filter((v) => v !== "")
            .join(",")
        : filter.value;
      if (value !== "") {
        params[`filter.${filter.key}`] = [`${filter.operator}:${value}`];
      }
    }
  }
  return params;
};

export const Search = ({
  filterFields,
  search,
  setSearch,
  filters,
  setFilters,
}: {
  filterFields: FilterFields;
  search: string;
  setSearch: (search: string) => void;
  filters: SearchFilter[];
  setFilters: (filters: SearchFilter[]) => void;
}) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [highlighted, setHighlighted] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  /** Suggestions opened with ctrl+space, shown even before anything is typed */
  const [forced, setForced] = useState(false);
  /** Filters are shown in a box over the content below, otherwise they are collapsed into a single icon */
  const [expanded, setExpanded] = useState(false);
  const collapsed = !expanded && filters.length > 0;

  const currentWord = search.split(" ").pop() ?? "";

  const suggestions = useMemo(() => {
    const word = currentWord.toLowerCase();
    if (word === "" && !forced) {
      return [];
    }
    return Object.entries(filterFields)
      .filter(
        ([key, { operators }]) =>
          availableOperators(operators).length > 0 &&
          !filters.some((f) => f.key === key) &&
          key.toLowerCase().startsWith(word),
      )
      .map(([key]) => key);
  }, [currentWord, filterFields, filters, forced]);

  const isOpen = isFocused && suggestions.length > 0;

  const addFilter = (key: string) => {
    const existing = filters.some((f) => f.key === key);
    if (!existing) {
      setFilters([...filters, { key, operator: availableOperators(filterFields[key].operators)[0], value: "" }]);
    }
    setExpanded(true);
    setSearch(search.slice(0, search.length - currentWord.length).trimEnd());
    setHighlighted(0);
    setForced(false);
  };

  const updateFilter = (index: number, filter: Partial<SearchFilter>) =>
    setFilters(filters.map((f, i) => (i === index ? { ...f, ...filter } : f)));

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
    inputRef.current?.focus();
  };

  const onChange = (value: string) => {
    const word = value.split(" ").pop() ?? "";
    if (word.endsWith(":")) {
      const typed = word.slice(0, -1).toLowerCase();
      const key = Object.keys(filterFields).find(
        (k) => k.toLowerCase() === typed && availableOperators(filterFields[k].operators).length > 0,
      );
      if (key) {
        if (!filters.some((f) => f.key === key)) {
          setFilters([...filters, { key, operator: availableOperators(filterFields[key].operators)[0], value: "" }]);
        }
        setExpanded(true);
        setSearch(value.slice(0, value.length - word.length).trimEnd());
        return;
      }
    }
    setSearch(value);
    setHighlighted(0);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey && (e.key === " " || e.code === "Space")) {
      e.preventDefault();
      setForced(true);
      setHighlighted(0);
      return;
    }
    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((highlighted + 1) % suggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((highlighted - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        addFilter(suggestions[Math.min(highlighted, suggestions.length - 1)]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsFocused(false);
        setForced(false);
        return;
      }
    }
    if (e.key === "Backspace" && search === "" && expanded && filters.length > 0) {
      e.preventDefault();
      removeFilter(filters.length - 1);
    }
  };

  return (
    <div className="relative w-full min-w-0 h-6">
      <div
        className={cx({ "absolute right-0 top-0 z-40 min-w-full w-96 max-w-[calc(100vw-4rem)]": expanded })}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setExpanded(false);
          }
        }}
      >
        <div
          className={cx(
            "join-item input input-xs flex w-full gap-1 px-0.5 focus-within:outline-0 focus-within:border-gray-500",
            expanded ? "h-auto min-h-6 flex-wrap py-0.5 shadow-lg" : "overflow-hidden",
          )}
          onMouseDown={(e) => {
            // clicking on filter names or empty space would blur the input and collapse the box
            if (!(e.target as HTMLElement).closest("input, select, button")) {
              e.preventDefault();
            }
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              inputRef.current?.focus();
            }
          }}
        >
          {collapsed ? (
            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-1 h-4.5 px-1.5 rounded-selector bg-base-200 text-xs font-semibold leading-none cursor-pointer hover:bg-base-300"
              title={filters.map((f) => f.key).join(", ")}
              onClick={() => {
                setExpanded(true);
                inputRef.current?.focus();
              }}
              data-testid="search-filters-collapsed"
            >
              <FunnelIcon className="size-3" />
              {filters.length}
            </button>
          ) : (
            filters.map((filter, i) => (
              <SearchFilterChip
                key={filter.key}
                filter={filter}
                operators={availableOperators(filterFields[filter.key]?.operators ?? [])}
                options={filterFields[filter.key]?.pagination?.()}
                onChange={(f) => updateFilter(i, f)}
                onRemove={() => removeFilter(i)}
              />
            ))
          )}
          <input
            ref={inputRef}
            type="text"
            name="search"
            autoComplete="off"
            value={search}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setForced(false);
            }}
            // daisyUI gives inputs in `.input` full width, which as flex basis wraps the input below the filters
            className="grow basis-16 min-w-16 px-1"
            placeholder={filters.length === 0 ? t("pagination.searchPlaceholder") : undefined}
          />
        </div>
        {isOpen && (
          <ul
            className="menu menu-xs absolute left-0 top-full mt-1 w-full bg-base-100 rounded-box shadow-lg border border-base-300 z-50"
            data-testid="search-suggestions"
          >
            {suggestions.map((key, i) => (
              <li key={key}>
                <button
                  type="button"
                  className={cx({ "menu-active": i === highlighted })}
                  onMouseDown={(e) => {
                    // keep focus in the input so blur does not close the list before click
                    e.preventDefault();
                    addFilter(key);
                  }}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  <span className="font-semibold">{key}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const SearchFilterChip = <T extends { meta: ResponseMeta; data: unknown[] }>({
  filter,
  operators,
  options,
  onChange,
  onRemove,
}: {
  filter: SearchFilter;
  operators: SearchOperator[];
  options?: SearchFilterOptions<T>;
  onChange: (filter: Partial<SearchFilter>) => void;
  onRemove: () => void;
}) => {
  const t = useTranslations();
  // popover is rendered in the top layer, so it is not clipped by the search box overflow
  const id = `search-operator-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const popoverRef = useRef<HTMLUListElement>(null);
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-0.5 pl-1.5 pr-0.5 rounded-selector bg-base-200 text-xs leading-none",
        // many picked values wrap inside the chip instead of overflowing the box
        options && isList(filter.operator) ? "flex-wrap max-w-full min-h-4.5 py-px" : "h-4.5",
      )}
      data-testid={`search-filter-${filter.key}`}
    >
      <span className="font-semibold">{filter.key}</span>
      <button
        type="button"
        popoverTarget={id}
        className="px-0.5 font-mono text-base-content/60 cursor-pointer hover:text-base-content"
        style={{ anchorName: `--${id}` } as React.CSSProperties}
        title={t(`pagination.operators.${filter.operator}`)}
      >
        {operatorLabels[filter.operator]}
      </button>
      <ul
        ref={popoverRef}
        id={id}
        popover="auto"
        className="dropdown menu menu-xs open:grid! grid-cols-[auto_1fr] w-max mt-1 p-1 rounded-box bg-base-100 shadow-lg border border-base-300"
        style={{ positionAnchor: `--${id}` } as React.CSSProperties}
      >
        {operators.map((operator) => (
          <li key={operator} className="col-span-2 grid! grid-cols-subgrid">
            <button
              type="button"
              className={cx("col-span-2 grid-cols-subgrid", { "menu-active": operator === filter.operator })}
              onClick={() => {
                // a list value does not fit a single value operator, keep only the first one
                onChange(
                  isList(filter.operator) && !isList(operator)
                    ? { operator, value: filter.value.split(",")[0].trim() }
                    : { operator },
                );
                popoverRef.current?.hidePopover();
              }}
            >
              <span className="font-mono">{operatorLabels[operator]}</span>
              {t(`pagination.operators.${operator}`)}
            </button>
          </li>
        ))}
      </ul>
      {!isValueless(filter.operator) && options && (
        <SearchFilterSelects filter={filter} options={options} onChange={(value) => onChange({ value })} />
      )}
      {!isValueless(filter.operator) && !options && (
        <input
          type="text"
          autoFocus={filter.value === ""}
          value={filter.value}
          onChange={(e) => onChange({ value: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && filter.value === "") {
              e.preventDefault();
              onRemove();
            }
          }}
          size={Math.max(filter.value.length, 4)}
          placeholder={isList(filter.operator) ? "1,2,3" : undefined}
          className="h-3.5 min-w-0 rounded-selector bg-base-100 px-1.5 outline-0"
        />
      )}
      <button
        type="button"
        className="btn btn-ghost btn-circle size-4 min-h-0 text-base-content/50 hover:text-error"
        onClick={onRemove}
      >
        <XMarkIcon className="size-3" />
      </button>
    </span>
  );
};

/** One select for `$eq`; for `$in` picked values are listed and one select at the end adds another */
const SearchFilterSelects = <T extends { meta: ResponseMeta; data: unknown[] }>({
  filter,
  options,
  onChange,
}: {
  filter: SearchFilter;
  options: SearchFilterOptions<T>;
  onChange: (value: string) => void;
}) => {
  const optionValue = options.optionValue ?? ((model) => (model as any).id);
  // picked models are kept, so labels are not refetched by id
  const [models, setModels] = useState<Record<string, unknown>>({});
  const select = (value: string | null, onPick: (picked: string) => void, autoFocus: boolean, required: boolean) => (
    <SelectPaginatedFromApi
      // chips are mounted again each time the filters are expanded
      staleTime={5 * 60 * 1000}
      minWidth={200}
      {...options}
      size="xs"
      required={required}
      optionValue={optionValue}
      value={value === null ? null : ((models[value] as any) ?? value)}
      autoFocus={autoFocus}
      onChange={(model) => {
        const picked = model ? `${optionValue(model)}` : "";
        if (model) {
          setModels({ ...models, [picked]: model });
        }
        onPick(picked);
      }}
      outerClassName="shrink-0"
      className="h-3.5 w-15 min-h-0 rounded-selector border-0 focus-within:outline-0 bg-base-100 px-1.5 text-xs [&_svg]:size-3 [&_input]:w-full [&_input]:min-w-0 [&_input]:truncate"
    />
  );

  if (!isList(filter.operator)) {
    return select(
      filter.value === "" ? null : filter.value,
      onChange,
      filter.value === "",
      filter.operator === "$not:$eq" || filter.operator === "$eq",
    );
  }

  const values = filter.value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "");

  return (
    <>
      {values.map((value) => (
        <SearchFilterValue
          key={value}
          value={value}
          model={models[value]}
          options={options}
          onRemove={() => onChange(values.filter((v) => v !== value).join(","))}
        />
      ))}
      <React.Fragment key={values.length}>
        {select(
          null,
          (picked) => {
            if (picked && !values.includes(picked)) {
              onChange([...values, picked].join(","));
            }
          },
          values.length === 0,
          ["$not:$eq", "$eq"].indexOf(filter.operator) !== -1,
        )}
      </React.Fragment>
    </>
  );
};

/** Picked `$in` value with a remove button shown on hover */
const SearchFilterValue = <T extends { meta: ResponseMeta; data: unknown[] }>({
  value,
  model,
  options,
  onRemove,
}: {
  value: string;
  model: unknown;
  options: SearchFilterOptions<T>;
  onRemove: () => void;
}) => {
  const optionLabel = options.optionLabel ?? ((model) => (model as any).name);
  const optionValue = options.optionValue ?? ((model) => (model as any).id);
  const { data } = useQuery({
    // same key as SelectPaginatedFromApi uses for fetching by id, so both share the cache
    queryKey: [...options.queryKey, "byId", value],
    queryFn: () => options.queryFn({ "filter.id": [value] }),
    enabled: !model,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const found = model ?? data?.data.find((m: unknown) => `${optionValue(m)}` === value);

  return (
    <span className="group/value relative inline-flex shrink-0 items-center h-3.5 max-w-40 rounded-selector bg-base-100 px-1.5">
      <span className="truncate">{found ? optionLabel(found, false) : value}</span>
      <button
        type="button"
        className="absolute right-0 inset-y-0 hidden group-hover/value:flex items-center px-0.5 rounded-selector bg-base-100 cursor-pointer text-base-content/50 hover:text-error"
        onClick={onRemove}
      >
        <XMarkIcon className="size-3" />
      </button>
    </span>
  );
};
