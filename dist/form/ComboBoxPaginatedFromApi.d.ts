import React from "react";
import { PaginateQuery, ResponseMeta } from "../utils/paginate";
import { ComboBoxProps } from "./ComboBox";
export type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta;
    data: unknown[];
}> = {
    name?: string;
    queryFn: (query: Omit<PaginateQuery<any>, "sortBy">) => Promise<TModel>;
    queryKey: ReadonlyArray<any>;
    value: TModel["data"][0] | string | number | null;
    optionValue?: (model: TModel["data"][0]) => string | number;
    searchFromChars?: number;
    onInitialChange?: (model: TModel["data"][0]) => void;
    /** How long loaded pages are reused before refetching, e.g. when the select is mounted again */
    staleTime?: number;
} & Omit<ComboBoxProps<TModel["data"][0]>, "value" | "options">;
export declare const ComboBoxPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: unknown[];
}>({ onChange, name, value, searchFromChars, queryKey, queryFn, optionLabel, optionValue, onInitialChange, staleTime, ...rest }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "defaultValue" | "type" | "value" | "children" | "onChange"> & SelectPaginatedFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated use ComboBoxPaginatedFromApi
 */
export declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: unknown[];
}>({ onChange, name, value, searchFromChars, queryKey, queryFn, optionLabel, optionValue, onInitialChange, staleTime, ...rest }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "defaultValue" | "type" | "value" | "children" | "onChange"> & SelectPaginatedFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ComboBoxPaginatedFromApi.d.ts.map