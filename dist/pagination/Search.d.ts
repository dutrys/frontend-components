export type FilterOperator = "$eq" | "$gt" | "$gte" | "$in" | "$null" | "$lt" | "$lte" | "$btw" | "$ilike" | "$sw" | "$contains" | "$not" | "$and" | "$or";
export type FilterOperators = Record<string, FilterOperator[]>;
declare const baseOperators: readonly ["$eq", "$in", "$ilike", "$null"];
type BaseOperator = (typeof baseOperators)[number];
export type SearchOperator = BaseOperator | `$not:${BaseOperator}`;
export type SearchFilter = {
    key: string;
    operator: SearchOperator;
    value: string;
};
export declare const parseSearchFilters: (filterOperators: FilterOperators, searchParams: URLSearchParams | {
    get: (key: string) => string | null;
}) => SearchFilter[];
/**
 * Converts filters to query params. Filters which were removed are cleared, but only when the current
 * query param is one Search can represent, so filters set elsewhere (e.g. by Filter on a field without
 * the operator in `filterOperators`) are left intact.
 */
export declare const searchFiltersToParams: (filterOperators: FilterOperators, filters: SearchFilter[], searchParams: URLSearchParams | {
    get: (key: string) => string | null;
}) => Record<string, string | string[]>;
export declare const Search: ({ filterOperators, search, setSearch, filters, setFilters, }: {
    filterOperators: FilterOperators;
    search: string;
    setSearch: (search: string) => void;
    filters: SearchFilter[];
    setFilters: (filters: SearchFilter[]) => void;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Search.d.ts.map