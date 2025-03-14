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
}>({ onChange, disabled, required, inputRef, name, value, size, className, queryKey, queryFn, placeholder, optionsClassName, empty, valueFormat, inputClassName, ...rest }: {
    size?: "sm" | "xs";
    inputClassName?: string;
    name?: string;
    inputRef?: any;
    queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
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