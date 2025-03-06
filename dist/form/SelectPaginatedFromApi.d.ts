import { PaginateQuery } from "@/utils/paginate";
export declare const SelectPaginatedFromApi: <TModel extends {
    meta: {
        currentPage: number;
        totalItems: number;
        totalPages: number;
    };
    data: {
        id: number;
    }[];
}>({ onChange, disabled, required, value, className, queryKey, queryFunction, placeholder, valueFormat, inputClassName, ...rest }: {
    inputClassName?: string;
    queryFunction?: (query: PaginateQuery<any>) => Promise<TModel | null>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    value: number | null;
    className?: string;
    onChange: (model: TModel["data"][0]) => void;
    disabled?: boolean;
    required?: boolean;
    valueFormat?: (model: TModel["data"][0]) => string;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map