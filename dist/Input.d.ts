import { Control, FieldValues, FieldPath, FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { PaginateQuery } from "./utils/paginate";
interface IInputProps<TName extends FieldPath<FieldValues>> {
    id?: string;
    label: string;
    name: TName;
    error?: FieldError;
    required?: boolean;
    className?: string;
    disabled?: boolean;
    desc?: string;
    size?: "xs" | "sm" | "md" | "lg";
}
interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
}
export declare const TextInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    type?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextareaInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName>) => import("react/jsx-runtime").JSX.Element;
export declare const CheckboxInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName>) => import("react/jsx-runtime").JSX.Element;
export declare const DateInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiInput: <T extends {
    data: {
        id: number;
    }[];
    meta: {
        currentPage: number;
        totalItems: number;
        totalPages: number;
    };
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    queryKey: ReadonlyArray<any>;
    queryFn: (query: PaginateQuery<any>) => Promise<T>;
    valueFormat: (model: T["data"][0]) => string;
    onChange?: (model: T["data"][0]) => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateTimeInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
    from?: Date;
    to?: Date;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map