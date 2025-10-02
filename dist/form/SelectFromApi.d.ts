export declare const SelectFromApi: <TModel extends {
    id: number;
}>({ onChange, disabled, required, inputRef, name, value, size, className, queryKey, queryFn, placeholder, optionsClassName, empty, valueFormat, inputClassName, filter, ...rest }: {
    size?: "sm" | "xs";
    inputClassName?: string;
    name?: string;
    inputRef?: any;
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    optionsClassName?: string;
    value: number | null;
    className?: string;
    onChange: (model: TModel) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    valueFormat?: (model: TModel) => string;
    filter?: (model: TModel) => boolean;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectFromApi.d.ts.map