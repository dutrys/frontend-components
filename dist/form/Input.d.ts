import { Control, FieldValues, FieldPath, FieldError, RegisterOptions, UseFormRegister, Merge } from "react-hook-form";
import { DateInputProps } from "./DateInput";
import { SelectPaginatedFromApiProps } from "./SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";
import { NumericFormatProps } from "react-number-format/types/types";
import React, { ChangeEvent } from "react";
import { SelectFromApiProps } from "./SelectFromApi";
interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
}
export declare const TextFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ required, disabled, error, className, id, type, register, label, size, options, desc, name, fieldSetClassName, ref, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    type?: string;
    ref?: (input: HTMLInputElement | null) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ id, disabled, fieldSetClassName, label, register, required, name, error, desc, options, size, className, children, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TextareaFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    maxLength?: number;
}) => import("react/jsx-runtime").JSX.Element;
export declare const RadioBoxFormField: <T extends string>({ name, options, label, value, onChange, }: {
    name: string;
    value: T;
    label?: string;
    options: Record<T, string>;
    onChange: (value: T) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const CheckboxFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    labelClassName?: string;
    checkbox?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, control, error, desc, useDate, ...props }: Omit<IInputProps<TName>, "size"> & Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiFormField: <T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange">) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFromApiField: <T extends {
    id: number;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, error, className, fieldSetClassName, ...rest }: IInputProps<TName> & SelectFromApiProps<T>) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFromApiFormField: <T extends {
    id: number;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, error, className, onChange, fieldSetClassName, ...rest }: IInputProps<TName> & Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T) => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateTimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, required, disabled, error, useDate, className, size, from, to, fieldSetClassName, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    from?: Date;
    to?: Date;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const NumberFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ options, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    options?: NumericFormatProps;
}) => import("react/jsx-runtime").JSX.Element;
export declare const Label: ({ text, required }: {
    required?: boolean;
    size?: "sm";
    text: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiField: <T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}>({ label, fieldSetClassName, className, desc, error, ...props }: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => import("react/jsx-runtime").JSX.Element;
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