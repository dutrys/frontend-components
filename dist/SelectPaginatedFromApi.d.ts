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
}>({ onChange, disabled, required, value, className, queryKey, allowEmpty, queryFunction, placeholder, valueFormat, inputClassName, ...rest }: {
    inputClassName?: string;
    queryFunction?: (query: PaginateQuery<any>) => Promise<TModel | undefined>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    value: number | null;
    className?: string;
    allowEmpty?: boolean | string;
    onChange: (model: TModel["data"][0]) => void;
    disabled?: boolean;
    required?: boolean;
    valueFormat?: (model: TModel["data"][0]) => string;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectPaginatedFromApi.d.ts.map