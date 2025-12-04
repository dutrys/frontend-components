import { SelectProps } from "./Select";
export type SelectFromApiProps<TModel = unknown> = {
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    value: number | string | null;
    onChange: (model: TModel | null) => void;
    optionLabel?: (model: TModel) => string;
    optionValue?: (model: TModel) => string | number;
    filter?: (model: TModel, query: string) => boolean;
} & Omit<SelectProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;
export declare const SelectFromApi: <TModel = unknown>({ name, value, queryKey, queryFn, optionLabel, optionValue, filter, ...rest }: SelectFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectFromApi.d.ts.map