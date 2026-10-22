import { SelectPaginatedFromApiProps } from "../form/SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";
export type FilterOperator = "$eq" | "$gt" | "$gte" | "$in" | "$null" | "$lt" | "$lte" | "$btw" | "$ilike" | "$sw" | "$contains" | "$not" | "$and" | "$or";
export type FilterOperators = Record<string, FilterOperator[]>;
/**
 * Values of a filter picked from a paginated api instead of typed, e.g. `calendarTemplateId`.
 * Props of SelectPaginatedFromApi which Search does not control itself.
 */
export type SearchFilterOptions<T extends {
    meta: ResponseMeta;
    data: unknown[];
}> = Pick<SelectPaginatedFromApiProps<T>, "queryKey" | "queryFn"> & Partial<Pick<SelectPaginatedFromApiProps<T>, "optionLabel" | "optionValue" | "groupBy" | "searchFromChars" | "staleTime" | "placeholder" | "empty" | "header" | "beforeOptions" | "afterOptions" | "hideNoItemsOption" | "minWidth" | "maxHeight" | "portalEnabled">>;
/** Filter which can be added in Search */
export type FilterField = {
    operators: FilterOperator[];
    /** Values picked from a paginated api instead of typed, e.g. `() => ({ queryKey, queryFn })` */
    pagination?: () => SearchFilterOptions<any>;
};
export type FilterFields = Record<string, FilterField>;
declare const baseOperators: readonly ["$eq", "$in", "$ilike", "$null", "$gt", "$gte", "$lt", "$lte", "$btw"];
type BaseOperator = (typeof baseOperators)[number];
/** Operators which can be negated with `$not:` */
declare const negatableOperators: readonly ["$eq", "$in", "$ilike", "$null"];
type NegatableOperator = (typeof negatableOperators)[number];
export type SearchOperator = BaseOperator | `$not:${NegatableOperator}`;
export type SearchFilter = {
    key: string;
    operator: SearchOperator;
    value: string;
};
export declare const parseSearchFilters: (filterFields: FilterFields, searchParams: URLSearchParams | {
    get: (key: string) => string | null;
}) => SearchFilter[];
/**
 * Converts filters to query params. Filters which were removed are cleared, but only when the current
 * query param is one Search can represent, so filters set elsewhere (e.g. by Filter on a field without
 * the operator in `filterFields`) are left intact.
 */
export declare const searchFiltersToParams: (filterFields: FilterFields, filters: SearchFilter[], searchParams: URLSearchParams | {
    get: (key: string) => string | null;
}) => Record<string, string | string[]>;
export declare const Search: ({ filterFields, search, setSearch, filters, setFilters, }: {
    filterFields: FilterFields;
    search: string;
    setSearch: (search: string) => void;
    filters: SearchFilter[];
    setFilters: (filters: SearchFilter[]) => void;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Search.d.ts.map