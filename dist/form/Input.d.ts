import { Control, FieldValues, FieldPath, FieldError, RegisterOptions, UseFormRegister, Merge } from "react-hook-form";
import { DateTimePickerProps } from "./DateTimePicker";
import { DateInputProps, DateRangeInputProps } from "./DateInput";
import { SelectPaginatedFromApiProps } from "./SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";
import { TimePickerProps } from "./TimePicker";
import { NumericFormatProps } from "react-number-format/types/types";
import React, { ChangeEvent } from "react";
import { SelectFromApiProps } from "./SelectFromApi";
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
interface IInputRegisterOnlyProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
}
interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName>, IInputRegisterOnlyProps<TFieldValues, TName> {
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
export declare const IndeterminateCheckbox: ({ checked, className, indeterminate, onChange, disabled, id, }: {
    id?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => unknown;
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
type CheckboxFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues = FieldValues> = Omit<IInputProps<TName>, "required" | "value"> & {
    labelClassName?: string;
    checkbox?: boolean;
    checked?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
    indeterminate?: boolean;
};
export declare const CheckboxField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: CheckboxFieldProps<TName, TFieldValues>) => import("react/jsx-runtime").JSX.Element;
export declare const CheckboxFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: Omit<CheckboxFieldProps<TName, TFieldValues>, "checked" | "onChange"> & IInputRegisterOnlyProps<TFieldValues, TName>) => import("react/jsx-runtime").JSX.Element;
export declare const DateField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, error, desc, disabled, ...props }: Omit<IInputProps<TName>, "size"> & DateInputProps) => import("react/jsx-runtime").JSX.Element;
export declare const DateFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, useDate, ...props }: Omit<IInputProps<TName>, "size"> & Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateRangeField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, error, desc, ...props }: Omit<IInputProps<TName>, "size"> & DateRangeInputProps) => import("react/jsx-runtime").JSX.Element;
export declare const SelectPaginatedFromApiFormField: <T extends {
    data: unknown[];
    meta: ResponseMeta;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ optionValue, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange" | "options">) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFromApiField: <T = unknown, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, error, className, fieldSetClassName, ...rest }: IInputProps<TName> & SelectFromApiProps<T>) => import("react/jsx-runtime").JSX.Element;
export declare const SelectFromApiFormField: <T = unknown, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, onChange, optionValue, ...props }: IInputProps<TName> & Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T | null) => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const DateTimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, disabled, error, className, fieldSetClassName, useDate, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
} & DateTimePickerProps) => import("react/jsx-runtime").JSX.Element;
export declare const TimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, control, className, ...props }: Omit<TimePickerProps, "onChange" | "value"> & IInputProps<TName> & {
    control: Control<TFieldValues>;
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
    data: unknown[];
    meta: ResponseMeta;
}>({ label, fieldSetClassName, className, desc, error, ...props }: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => import("react/jsx-runtime").JSX.Element;
export declare const Required: () => import("react/jsx-runtime").JSX.Element;
export declare const SaveButton: ({ isLoading, icon, disabled, className, onClick, size, color, children, type, ...props }: {
    type?: "submit" | "button";
    size?: "sm";
    color?: "btn-primary" | "btn-secondary" | "btn-warning" | "btn-error" | "btn-success" | "btn-neutral" | "btn-info";
    onClick?: () => unknown;
    className?: string;
    icon?: React.ElementType;
    children?: React.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Input.d.ts.map