import { NumericFormatProps } from "react-number-format";
import { PaginateQuery, ResponseMeta } from "../utils/paginate";
export declare const FilterNumberRange: ({ filter, fieldsetClassName, from, to, options, onConvertValueSubmit, onCovertFromValue, }: {
    fieldsetClassName?: string;
    filter: string;
    from: string;
    to: string;
    options?: NumericFormatProps;
    onConvertValueSubmit: (value: number | null) => string | number;
    onCovertFromValue: (value: number | null) => number;
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterDateRange: ({ filter, fieldsetClassName, from, to, options, }: {
    fieldsetClassName?: string;
    filter: string | [string, string];
    from: string;
    to: string;
    options?: NumericFormatProps;
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterText: ({ filter, label, fieldsetClassName, isLike, }: {
    fieldsetClassName?: string;
    filter: string;
    label: string;
    isLike?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterPagination: <T extends {
    data: unknown[];
    meta: ResponseMeta;
}>({ filter, label, queryFn, queryKey, optionLabel, optionValue, groupBy, fieldsetClassName, }: {
    filter: string;
    fieldsetClassName?: string;
    label: string;
    queryKey: ReadonlyArray<unknown>;
    queryFn: (query: Omit<PaginateQuery<unknown>, "sortBy">) => Promise<T>;
    optionLabel: (model: T["data"][number]) => string;
    optionValue?: (model: T["data"][number]) => string | number;
    groupBy?: (model: T["data"][number]) => string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterSelectOptions: ({ filter, label, options, fieldsetClassName, }: {
    fieldsetClassName?: string;
    filter: string;
    label: string;
    options: {
        label: string;
        value: string;
    }[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterOptionsExpandable: ({ filter, label, options, isVisible, }: {
    isVisible: boolean;
    fieldsetClassName?: string;
    filter: string;
    label: string;
    options: {
        label: string;
        value: string;
    }[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const FilterOptions: ({ filter, options, isVisible, equals, }: {
    equals?: boolean;
    isVisible: boolean;
    fieldsetClassName?: string;
    filter: string;
    options: {
        label: string;
        value: string;
    }[];
}) => import("react/jsx-runtime").JSX.Element | import("react/jsx-runtime").JSX.Element[];
//# sourceMappingURL=Filter.d.ts.map