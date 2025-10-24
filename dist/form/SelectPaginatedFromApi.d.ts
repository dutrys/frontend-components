import React from "react";
import { PaginateQuery, ResponseMeta } from "@/utils/paginate";
export type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta;
    data: {
        id: number;
    }[];
}> = {
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
};
export declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: {
        id: number;
    }[];
}>({ onChange, disabled, required, inputRef, name, value, size, className, queryKey, queryFn, placeholder, optionsClassName, empty, valueFormat, inputClassName, heading, footer, ...rest }: SelectPaginatedFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map