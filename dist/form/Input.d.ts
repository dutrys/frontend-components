import { Control, FieldValues, FieldPath, FieldError, RegisterOptions, UseFormRegister, Merge } from "react-hook-form";
import { PaginateQuery, ResponseMeta } from "../utils/paginate";
import { NumericFormatProps } from "react-number-format/types/types";
import React, { ChangeEvent } from "react";
interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
}
export declare const TextInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ required, disabled, error, className, id, type, register, label, size, options, desc, name, fieldSetClassName, ref, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    type?: string;
    ref?: (input: HTMLInputElement | null) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ id, disabled, fieldSetClassName, label, register, required, name, error, desc, options, size, className, children, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextareaInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    maxLength?: number;
}) => import("react/jsx-runtime").JSX.Element;
export declare const RadioBox: <T extends string>({ name, options, label, value, onChange, }: {
    name: string;
    value: T;
    label?: string;
    options: Record<T, string>;
    onChange: (value: T) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const CheckboxInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName>) => import("react/jsx-runtime").JSX.Element;
export declare const DateInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, useDate, allowEmpty, label, error, disabled, desc, required, size, className, fieldSetClassName, name, from, to, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
    from?: Date;
    to?: Date;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiInput: <T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, fieldSetClassName, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    queryKey: ReadonlyArray<any>;
    queryFn: (query: PaginateQuery<any>) => Promise<T>;
    valueFormat: (model: T["data"][0]) => string;
    onChange?: (model: T["data"][0]) => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFromApiInput: <T extends {
    id: number;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, fieldSetClassName, filter, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    queryKey: ReadonlyArray<any>;
    queryFn: () => Promise<T[]>;
    valueFormat: (model: T) => string;
    onChange?: (model: T) => unknown;
    filter?: (model: T) => boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateTimeInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, required, disabled, error, useDate, className, size, allowEmpty, from, to, fieldSetClassName, ...rest }: IInputProps<TName> & {
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
    meta: ResponseMeta;
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
    error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
    required?: boolean;
    className?: string;
    fieldSetClassName?: string;
    disabled?: boolean;
    desc?: React.ReactNode;
    size?: "xs" | "sm";
}
export declare const Required: () => import("react/jsx-runtime").JSX.Element;
export declare const SaveButton: ({ isLoading, text, icon, disabled, className, onClick, size, type, ...props }: {
    type?: "submit" | "button";
    size?: "sm";
    onClick?: () => unknown;
    className?: string;
    icon?: React.ElementType;
    text?: string;
    isLoading?: boolean;
    disabled?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const IndeterminateCheckbox: ({ checked, className, indeterminate, onChange, }: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
    checked: boolean;
    className: string;
    indeterminate?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map