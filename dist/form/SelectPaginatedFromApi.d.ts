import React from "react";
import { PaginateQuery, ResponseMeta } from "@/utils/paginate";
export type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta;
    data: {
        id: number;
    }[];
}> = {
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
export declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: {
        id: number;
    }[];
}>({ onChange, disabled, required, inputRef, name, value, size, searchFromChars, className, queryKey, queryFn, placeholder, empty, valueFormat, heading, footer, ...rest }: SelectPaginatedFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map