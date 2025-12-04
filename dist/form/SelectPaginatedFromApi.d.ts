import { PaginateQuery, ResponseMeta } from "@/utils/paginate";
import { SelectProps } from "@/form/Select";
export type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta;
    data: Record<string, unknown>[];
}> = {
    name?: string;
    queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
    queryKey: ReadonlyArray<any>;
    value: TModel["data"][0] | string | number | null;
    optionValue?: (model: TModel["data"][0]) => string | number;
    searchFromChars?: number;
} & Omit<SelectProps<TModel["data"][0]>, "value">;
export declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: Record<string, unknown>[];
}>({ onChange, name, value, searchFromChars, queryKey, queryFn, optionLabel, optionValue, ...rest }: SelectPaginatedFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map