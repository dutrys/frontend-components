import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react_hook_form from 'react-hook-form';
import { FieldValues, UseFormProps, UseFormSetError, FieldPath, FieldError, RegisterOptions, UseFormRegister, Control } from 'react-hook-form';
import * as React$1 from 'react';
import React__default from 'react';
import { NumericFormatProps } from 'react-number-format/types/types';
import { PaginateQuery as PaginateQuery$1 } from '@/utils/paginate';

declare const DatePicker: ({ onChange, value, inputClassName, toggleClassName, required, allowEmpty, disabled, placeholder, }: {
    required?: boolean;
    disabled?: boolean;
    value: Date | null;
    inputClassName?: string;
    toggleClassName?: string;
    allowEmpty?: boolean;
    placeholder?: string;
    onChange: (date: Date | null) => unknown;
}) => react_jsx_runtime.JSX.Element;

declare function DateTimePicker({ value, onChange, allowEmpty, disabled, required, from, to, placeholder, inputClassName, toggleClassName, }: {
    required?: boolean;
    disabled?: boolean;
    allowEmpty?: boolean;
    inputClassName?: string;
    placeholder?: string;
    toggleClassName?: string;
    from?: Date;
    to?: Date;
    value: Date | null;
    onChange: (value: Date | null) => void;
}): react_jsx_runtime.JSX.Element;

declare const InputErrors: ({ errors, className, }: {
    className?: string;
    errors: any;
}) => react_jsx_runtime.JSX.Element | null;
type ServerError<T> = {
    errors: Record<keyof T, string[]>;
};
declare const isServerError: (error: any) => error is ServerError<any>;
declare function useFormSubmit<T extends FieldValues, R = unknown>(doSubmitCallback: (data: T) => Promise<ServerError<T> | R>, formOptions: UseFormProps<T>, options?: {
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError<T>) => void;
}): {
    handleSubmit: () => (e?: React__default.BaseSyntheticEvent) => Promise<void>;
    isLoading: boolean;
    setIsLoading: React__default.Dispatch<React__default.SetStateAction<boolean>>;
    watch: react_hook_form.UseFormWatch<T>;
    getValues: react_hook_form.UseFormGetValues<T>;
    getFieldState: react_hook_form.UseFormGetFieldState<T>;
    setError: UseFormSetError<T>;
    clearErrors: react_hook_form.UseFormClearErrors<T>;
    setValue: react_hook_form.UseFormSetValue<T>;
    trigger: react_hook_form.UseFormTrigger<T>;
    formState: react_hook_form.FormState<T>;
    resetField: react_hook_form.UseFormResetField<T>;
    reset: react_hook_form.UseFormReset<T>;
    unregister: react_hook_form.UseFormUnregister<T>;
    control: react_hook_form.Control<T, any>;
    register: react_hook_form.UseFormRegister<T>;
    setFocus: react_hook_form.UseFormSetFocus<T>;
};
declare function addServerErrors<T extends FieldValues>(errors: {
    [P in keyof T]?: string[];
}, setError: UseFormSetError<T>): void;

type PaginateQuery<T> = {
    page?: number;
    limit?: number;
    sortBy?: T[];
    search?: string;
    [key: `filter.${string}`]: string;
};

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
declare const TextInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    type?: string;
}) => react_jsx_runtime.JSX.Element;
declare const SelectInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    children: React.ReactNode;
}) => react_jsx_runtime.JSX.Element;
declare const TextareaInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName>) => react_jsx_runtime.JSX.Element;
declare const CheckboxInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName>) => react_jsx_runtime.JSX.Element;
declare const DateInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const SelectPaginatedFromApiInput: <T extends {
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
}) => react_jsx_runtime.JSX.Element;
declare const DateTimeInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
    from?: Date;
    to?: Date;
}) => react_jsx_runtime.JSX.Element;
declare const TimeInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const NumberInput: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ options, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    options?: NumericFormatProps;
}) => react_jsx_runtime.JSX.Element;
declare const Label: ({ text, required }: {
    required?: boolean;
    size?: "sm";
    text: React.ReactNode;
}) => react_jsx_runtime.JSX.Element;

declare const LoadingComponent: ({ style, className, loadingClassName, size, }: {
    className?: string;
    loadingClassName?: string;
    size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
    style?: React__default.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, showOnHover, showOnClick, showOnFocus, popoverWidth, bgColor, borderColor, }: {
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    popoverWidth?: string;
    title: (ref: (node: HTMLElement | null) => void, props: Record<string, unknown>) => React$1.ReactNode;
    children: (close: () => void) => React$1.ReactNode;
    onShow?: (show: boolean) => void;
    bgColor?: string;
    borderColor?: string;
}) => react_jsx_runtime.JSX.Element;

declare const SelectPaginatedFromApi: <TModel extends {
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
    queryFunction?: (query: PaginateQuery$1<any>) => Promise<TModel | undefined>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    value: number | null;
    className?: string;
    allowEmpty?: boolean | string;
    onChange: (model: TModel["data"][0]) => void;
    disabled?: boolean;
    required?: boolean;
    valueFormat?: (model: TModel["data"][0]) => string;
}) => react_jsx_runtime.JSX.Element;

export { CheckboxInput, DateInput, DatePicker, DateTimeInput, DateTimePicker, InputErrors, Label, LoadingComponent, NumberInput, Popover, SelectInput, SelectPaginatedFromApi, SelectPaginatedFromApiInput, type ServerError, TextInput, TextareaInput, TimeInput, addServerErrors, isServerError, useFormSubmit };
