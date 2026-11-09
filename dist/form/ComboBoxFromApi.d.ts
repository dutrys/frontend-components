import { ComboBoxProps } from "./ComboBox";
export type ComboBoxFromApiProps<TModel = unknown> = {
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    value: number | string | null;
    onChange: (model: TModel | null) => void;
    optionLabel?: (model: TModel, inOptions: boolean) => string;
    optionValue?: (model: TModel) => string | number;
    filter?: (model: TModel, query: string) => boolean;
} & Omit<ComboBoxProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;
export declare const ComboBoxFromApi: <TModel = unknown>({ name, value, queryKey, queryFn, optionLabel, optionValue, filter, ...rest }: ComboBoxFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated use ComboBoxFromApi
 */
export declare const SelectFromApi: <TModel = unknown>({ name, value, queryKey, queryFn, optionLabel, optionValue, filter, ...rest }: ComboBoxFromApiProps<TModel>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ComboBoxFromApi.d.ts.map