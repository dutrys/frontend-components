import { SelectProps } from "@/form/Select";
export type SelectFromApiProps<TModel extends Record<string, unknown>> = {
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    value: number | string | null;
    onChange: (model: TModel | null) => void;
    optionLabel?: (model: TModel) => string;
    optionValue?: (model: TModel) => string | number;
    filter?: (model: TModel, query: string) => boolean;
} & Omit<SelectProps<TModel>, "onChange" | "optionLabel" | "value">;
export declare const SelectFromApi: <TModel extends Record<string, unknown>>({ name, value, queryKey, queryFn, optionLabel, optionValue, filter, ...rest }: SelectFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SelectFromApi.d.ts.map