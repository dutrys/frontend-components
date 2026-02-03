import { NumericFormatProps } from "react-number-format";
import { PaginateQuery, ResponseMeta } from "../utils/paginate";
export declare enum FilterType {
    TEXT = "text",
    BOOLEAN = "boolean",
    PAGINATION = "pagination",
    DATE_RANGE = "date-range",
    NUMBER_RANGE = "number-range"
}
type FilterTextColumn = {
    type: FilterType.TEXT | FilterType.DATE_RANGE | FilterType.BOOLEAN;
    label: string;
};
type FilterNumberRangeColumn = {
    type: FilterType.NUMBER_RANGE;
    label: string;
    options?: NumericFormatProps;
};
export type FilterPaginationColumn<T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}> = {
    type: FilterType.PAGINATION;
    label: string;
    queryKey: ReadonlyArray<unknown>;
    queryFn: (query: PaginateQuery<unknown>) => Promise<T>;
    optionLabel: (model: T["data"][number]) => string;
    groupBy?: (model: T["data"][number]) => string;
};
type FilterColumn<T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}> = FilterTextColumn | FilterNumberRangeColumn | FilterPaginationColumn<T>;
export declare const FilterButton: ({ className, filter, onSubmitParams, onParseParams, }: {
    onParseParams?: (params: Record<string, unknown>) => Record<string, unknown>;
    onSubmitParams?: (params: Record<string, unknown>) => Record<string, unknown>;
    filter: Record<string, FilterColumn<any>>;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FilterButton.d.ts.map