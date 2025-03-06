import { Control, FieldValues, FieldPath, FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { PaginateQuery } from "../utils/paginate";
import { NumericFormatProps } from "react-number-format/types/types";
import React from "react";
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
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, fieldSetClassName, ...rest }: IInputProps<TName> & {
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
export declare const TimeInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const NumberInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ options, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    options?: NumericFormatProps;
}) => import("react/jsx-runtime").JSX.Element;
export declare const Label: ({ text, required }: {
    required?: boolean;
    size?: "sm";
    text: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiWithLabel: <T extends {
    data: {
        id: number;
    }[];
    meta: {
        currentPage: number;
        totalItems: number;
        totalPages: number;
    };
}>({ label, queryFn, queryKey, desc, name, valueFormat, required, disabled, error, className, size, value, onChange, fieldSetClassName, ...rest }: IInputProps<any> & {
    queryKey: ReadonlyArray<any>;
    queryFn: (query: PaginateQuery<any>) => Promise<T>;
    valueFormat: (model: T["data"][0]) => string;
    onChange?: (model: T["data"][0]) => unknown;
    value: number | null;
}) => import("react/jsx-runtime").JSX.Element;
export interface IInputProps<TName extends FieldPath<FieldValues>> {
    id?: string;
    label: string;
    name: TName;
    error?: FieldError;
    required?: boolean;
    className?: string;
    fieldSetClassName?: string;
    disabled?: boolean;
    desc?: React.ReactNode;
    size?: "xs" | "sm" | "md" | "lg";
}
export declare const Required: () => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map