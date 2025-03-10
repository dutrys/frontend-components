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
}>({ onChange, disabled, required, inputRef, value, className, queryKey, queryFunction, placeholder, optionsClassName, empty, valueFormat, inputClassName, ...rest }: {
    inputClassName?: string;
    inputRef?: any;
    queryFunction?: (query: PaginateQuery<any>) => Promise<TModel | null>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    optionsClassName?: string;
    value: number | null;
    className?: string;
    onChange: (model: TModel["data"][0]) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    valueFormat?: (model: TModel["data"][0]) => string;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map