import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { ChangeEvent } from 'react';
import { Placement } from '@floating-ui/utils';
import { ReadonlyURLSearchParams } from 'next/navigation';
import * as react_hook_form from 'react-hook-form';
import { FieldErrors, FieldValues, UseFormProps, UseFormSetError, FieldPath, FieldError, Merge, RegisterOptions, UseFormRegister, Control } from 'react-hook-form';
import { Matcher, DateRange } from 'react-day-picker';
import { NumericFormatProps } from 'react-number-format/types/types';

declare const LoadingComponent: ({ style, className, loadingClassName, size, }: {
    className?: string;
    loadingClassName?: string;
    size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
    style?: React__default.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, showOnHover, showOnClick, showOnFocus, backgroundColor, borderColor, disabled, placement, arrowSize, }: {
    disabled?: boolean;
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    arrowSize?: {
        width: number;
        height: number;
    };
    title: (ref: ((node: HTMLElement | null) => void) | null, props: Record<string, unknown>, isOpen: boolean) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    borderColor?: `border-${string}`;
    backgroundColor?: `bg-${string}`;
    placement?: Placement;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;

type MoreActionType = {
    label: string;
    icon: React__default.ComponentType<{
        className?: string;
    }>;
    onClick?: () => Promise<string | void>;
    href?: string;
    hidden?: boolean;
    enableWhenSpaceIsAvailable?: boolean;
    disableNProgress?: boolean;
    disabled?: boolean;
    testId?: string;
};
declare const MoreActions: ({ className, actions }: {
    className?: string;
    actions: MoreActionType[];
}) => react_jsx_runtime.JSX.Element | null;

declare const BulkActions: ({ bulkActions, disabled, }: {
    disabled?: boolean;
    bulkActions: {
        children: React__default.ReactNode;
        onSelect: () => Promise<boolean | void>;
    }[];
}) => react_jsx_runtime.JSX.Element;
declare const BulkDropDownActions: ({ bulkActions, disabled, }: {
    disabled?: boolean;
    bulkActions: {
        children: React__default.ReactNode;
        onSelect: () => Promise<boolean | void>;
    }[];
}) => react_jsx_runtime.JSX.Element;

type ObjOrNode = object | ((isVisible: boolean) => React__default.ReactNode);
declare const HeaderResponsive: <T extends ObjOrNode>({ renderVisible, renderDropdown, heightClassName, elements, }: {
    heightClassName: string;
    renderVisible: (r: T, i: number) => React__default.ReactNode;
    renderDropdown: (r: T, i: number, closeFn: () => void) => React__default.ReactNode;
    elements: T[];
}) => react_jsx_runtime.JSX.Element;

type PaginateQuery<T> = {
    page?: number;
    limit?: number;
    sortBy?: T[];
    search?: string;
    [key: `filter.${string}`]: string;
};
type ResponseMeta = {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: string[][];
};
declare const getPreviousPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
declare const getNextPageParam: <T extends {
    meta: ResponseMeta;
}>(page?: T) => number | undefined;
declare const setPartialParams: (partialParams: Record<string, string | string[]>, searchParams: ReadonlyURLSearchParams | null) => string;
declare const isParamActive: (link: Record<string, string | string[]>, searchParams: ReadonlyURLSearchParams) => boolean;

declare const Pagination: ({ page, visiblePages, onClick, size, className, }: {
    className?: string;
    size?: "sm" | "xs";
    onClick?: (page: number) => void;
    page: ResponseMeta;
    visiblePages: number;
}) => react_jsx_runtime.JSX.Element;

interface PaginationSettings {
    loadByDefault?: string;
    displayAs?: string;
    columns?: Record<string, {
        name: string;
        enabled: boolean;
    }[]>;
}
interface StorageInterface<T = unknown> {
    getConfig(title: string, columns: ColumnType<T>[]): Promise<PaginationSettings>;
    setConfig(title: string, configs: PaginationSettings): Promise<void>;
}
declare class LocalStorage<T> implements StorageInterface<T> {
    getConfig(title: string, columns: ColumnType<T>[]): Promise<PaginationSettings>;
    setConfig(title: string, configs: PaginationSettings): Promise<void>;
}

type ActionColumn<TModel> = {
    type: "actions";
    actions: (model: TModel) => MoreActionType[];
    className?: string;
    hiddenByDefault?: boolean;
};
type SimpleColumn<TModel> = {
    name: keyof TModel;
    title: string;
    truncate?: number;
    type?: "code";
    pin?: true;
    translate?: string;
    className?: string;
    hiddenByDefault?: boolean;
};
type DateColumn<TModel> = {
    name: keyof TModel;
    type: "date";
    format?: string;
    title: string;
    pin?: true;
    className?: string;
    hiddenByDefault?: boolean;
};
type FunctionColumn<TModel> = {
    name: string;
    body: (data: TModel) => string | number | React__default.ReactNode;
    title: string;
    pin?: true;
    className?: string;
    hiddenByDefault?: boolean;
};
type ColumnType<TModel> = SimpleColumn<TModel> | FunctionColumn<TModel> | ActionColumn<TModel> | DateColumn<TModel>;
declare function isActionColumn<TModel>(column: ColumnType<TModel>): column is ActionColumn<TModel>;
declare function isFunctionColumn<TModel>(column: ColumnType<TModel>): column is FunctionColumn<TModel>;
declare const PaginatedTable: <TModel extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}>({ pagination, title, titleAbove, sortEnum, extraHeading, columns, caption, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, displayFilters, displayConfig, renderGridItem, rowClickHref, defaultDisplayAs, }: {
    titleAbove?: React__default.ReactNode;
    caption?: React__default.ReactNode;
    defaultDisplayAs?: "list" | "grid";
    renderGridItem?: (model: TModel["data"][number]) => React__default.ReactNode;
    bulkActions?: {
        children: React__default.ReactNode;
        onSelect: (models: number[]) => Promise<boolean | void>;
    }[];
    sortEnum: Record<string, string>;
    extraHeading?: React__default.ReactNode;
    isSearchable?: boolean;
    title?: React__default.ReactNode;
    addNew?: string;
    rowClickHref?: (model: TModel["data"][number]) => string;
    displayFilters?: {
        name: string;
        filters: string[];
    }[];
    searchableShortcuts?: ((isVisible: boolean) => React__default.ReactNode)[];
    columns: Array<ColumnType<TModel["data"][number]>>;
    pagination: TModel;
    addNewText?: string;
    displayConfig?: {
        name: string;
        store?: StorageInterface<TModel["data"][number]>;
        stored?: PaginationSettings | null;
    };
}) => react_jsx_runtime.JSX.Element;
declare const TableLink: ({ href, children, className, isLink, ...rest }: {
    className?: string;
    href: string;
    children: React__default.ReactNode;
    isLink?: boolean;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;
declare const FilterLink: ({ children, className, params, }: {
    className: string;
    children?: string;
    params: Record<string, string>;
}) => react_jsx_runtime.JSX.Element;

declare const HeaderResponsivePaginated: ({ elements, bulkActions, }: {
    elements: ({
        link: Record<string, string>;
        text: string;
    }[] | ((isVisible: boolean) => React__default.ReactNode))[];
    bulkActions?: {
        actions: {
            children: React__default.ReactNode;
            onSelect: (models: number[]) => Promise<boolean | void>;
        }[];
        selected: number[];
        setSelected: (selected: number[]) => void;
    };
}) => react_jsx_runtime.JSX.Element;

declare class ScreenSize {
    static readonly none: number;
    static readonly xs: number;
    static readonly sm: number;
    static readonly md: number;
    static readonly lg: number;
    static readonly xl: number;
}
declare const useScreenSize: () => number;

declare const GeneralErrorsInToast: <T extends Record<string, unknown>>({ errors, translateId, except, className, }: {
    except?: (keyof T)[];
    translateId?: string;
    errors: Record<string, string[]>;
    className?: string;
}) => react_jsx_runtime.JSX.Element;
declare const mapToDot: <T extends Record<string, any>>(errors: FieldErrors<T>) => Record<string, string[]>;
declare const GeneralErrors: <T extends FieldValues>(props: {
    except?: (keyof T)[];
    translateId?: string;
    errors: FieldErrors<T>;
    errorClassName?: string;
    messageClassName?: string;
    listClassName?: string;
    as?: React__default.ElementType;
    asClassName?: string;
}) => react_jsx_runtime.JSX.Element;
declare const InputErrors: ({ errors, className, }: {
    className?: string;
    errors: any;
}) => react_jsx_runtime.JSX.Element | null;
type ServerError = {
    errors: Record<string, string[]>;
};
declare const isServerError: (error: any) => error is ServerError;
declare const useFormSubmit: <T extends FieldValues, R = unknown>(doSubmitCallback: (data: T) => Promise<ServerError | R>, formOptions?: UseFormProps<T> & {
    translateErrors?: string;
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError) => void;
    loadingText?: string;
    savedText?: string;
    confirm?: boolean;
}) => {
    confirm: {
        needsConfirm: boolean;
        setNeedsConfirm: (success: boolean) => void;
        showDialog: () => void;
    } | undefined;
    handleSubmit: () => (e?: React__default.BaseSyntheticEvent) => Promise<void>;
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
declare const ConfirmSave: ({ onConfirm }: {
    onConfirm: (success: boolean) => void;
}) => react_jsx_runtime.JSX.Element;
declare const addServerErrors: <T extends FieldValues>(errors: { [P in keyof T]?: string[]; }, setError: UseFormSetError<T>) => void;

type DateTimePickerProps = {
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    toggleClassName?: string;
    from?: Date;
    to?: Date;
    value: Date | null;
    onChange: (value: Date | null) => void;
    size?: "sm" | "xs";
};
declare function DateTimePicker({ value, size, onChange, disabled, required, from, to, placeholder, className, toggleClassName, ...rest }: DateTimePickerProps): react_jsx_runtime.JSX.Element;

type DateInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "value" | "defaultValue" | "defaultChecked" | "onChange"> & {
    size?: "sm" | "xs";
    required?: boolean;
    disabled?: boolean;
    value: Date | null;
    className?: string;
    toggleClassName?: string;
    placeholder?: string;
    onChange: (date: Date | null) => unknown;
    matcher?: Matcher;
    modifiers?: Record<string, Matcher | Matcher[] | undefined> | undefined;
};
declare const DateInput: ({ onChange, value, className, toggleClassName, required, disabled, size, placeholder, matcher, modifiers, ...rest }: DateInputProps) => react_jsx_runtime.JSX.Element;
type DateRangeInputProps = Omit<DateInputProps, "onChange" | "value"> & {
    onChange: (date: DateRange | null) => unknown;
    value: DateRange | null;
};
declare const DateRangeInput: ({ onChange, value, className, toggleClassName, required, disabled, size, modifiers, placeholder, matcher, ...rest }: DateRangeInputProps) => react_jsx_runtime.JSX.Element;

declare function PortalSSR(props: {
    enabled?: boolean;
    children: React__default.ReactNode;
}): string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;
type SelectProps<T> = {
    size?: "sm" | "xs";
    name?: string;
    inputRef?: any;
    placeholder?: string;
    value: T | null;
    className?: string;
    onChange: (model: T | null) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    portalEnabled?: boolean;
    header?: React__default.ReactNode;
    beforeOptions?: React__default.ReactNode;
    afterOptions?: React__default.ReactNode;
    options: T[];
    minWidth?: number;
    maxHeight?: number;
    optionLabel?: (model: T) => string;
    groupBy?: (model: T) => string;
    onQueryChange?: (query: string) => void;
    afterInput?: React__default.ReactNode;
    hideNoItemsOption?: boolean;
};
declare const Select: <T = unknown>({ onChange, disabled, required, inputRef, options, name, portalEnabled, optionLabel, value, size, className, placeholder, groupBy, empty, beforeOptions, header, afterOptions, onQueryChange, minWidth, maxHeight, afterInput, hideNoItemsOption, ...rest }: SelectProps<T>) => react_jsx_runtime.JSX.Element;
declare const SelectOption: ({ value, size, children, className, ...rest }: {
    children: React__default.ReactNode;
    value: unknown;
    className?: string;
    size?: "xs" | "sm";
}) => react_jsx_runtime.JSX.Element;

type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta;
    data: unknown[];
}> = {
    name?: string;
    queryFn: (query: PaginateQuery<any>) => Promise<TModel>;
    queryKey: ReadonlyArray<any>;
    value: TModel["data"][0] | string | number | null;
    optionValue?: (model: TModel["data"][0]) => string | number;
    searchFromChars?: number;
} & Omit<SelectProps<TModel["data"][0]>, "value" | "options">;
declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta;
    data: unknown[];
}>({ onChange, name, value, searchFromChars, queryKey, queryFn, optionLabel, optionValue, ...rest }: SelectPaginatedFromApiProps<TModel>) => react_jsx_runtime.JSX.Element;

type TimePickerProps = {
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange: (e: any) => void;
    className?: string;
    value: string | undefined | null;
};
declare const TimePicker: ({ className, value, onChange, placeholder, required, disabled }: TimePickerProps) => react_jsx_runtime.JSX.Element;

type SelectFromApiProps<TModel = unknown> = {
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    value: number | string | null;
    onChange: (model: TModel | null) => void;
    optionLabel?: (model: TModel) => string;
    optionValue?: (model: TModel) => string | number;
    filter?: (model: TModel, query: string) => boolean;
} & Omit<SelectProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;
declare const SelectFromApi: <TModel = unknown>({ name, value, queryKey, queryFn, optionLabel, optionValue, filter, ...rest }: SelectFromApiProps<TModel>) => react_jsx_runtime.JSX.Element;

interface IInputProps<TName extends FieldPath<FieldValues>> {
    id?: string;
    label: string;
    name: TName;
    error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
    required?: boolean;
    className?: string;
    fieldSetClassName?: string;
    disabled?: boolean;
    desc?: React__default.ReactNode;
    size?: "xs" | "sm";
}
interface IInputRegisterOnlyProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
}
interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName>, IInputRegisterOnlyProps<TFieldValues, TName> {
}
declare const TextFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ required, disabled, error, className, id, type, register, label, size, options, desc, name, fieldSetClassName, ref, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    type?: string;
    ref?: (input: HTMLInputElement | null) => void;
}) => react_jsx_runtime.JSX.Element;
declare const SelectFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ id, disabled, fieldSetClassName, label, register, required, name, error, desc, options, size, className, children, ...rest }: IInputRegisterProps<TFieldValues, TName> & {
    children: React__default.ReactNode;
}) => react_jsx_runtime.JSX.Element;
declare const TextareaFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputRegisterProps<TFieldValues, TName> & {
    maxLength?: number;
}) => react_jsx_runtime.JSX.Element;
declare const RadioBoxFormField: <T extends string>({ name, options, label, value, onChange, }: {
    name: string;
    value: T;
    label?: string;
    options: Record<T, string>;
    onChange: (value: T) => void;
}) => react_jsx_runtime.JSX.Element;
declare const IndeterminateCheckbox: ({ checked, className, indeterminate, onChange, disabled, id, ref, }: {
    id?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => unknown;
    checked?: boolean;
    className?: string;
    disabled?: boolean;
    indeterminate?: boolean;
    ref?: (input: HTMLInputElement | null) => void;
}) => react_jsx_runtime.JSX.Element;
type CheckboxFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues = FieldValues> = Omit<IInputProps<TName>, "required" | "value"> & {
    labelClassName?: string;
    checkbox?: boolean;
    checked?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
    indeterminate?: boolean;
};
declare const CheckboxField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, fieldSetClassName, checkbox, className, labelClassName, size, indeterminate, ref, ...props }: {
    ref?: (input: HTMLInputElement | null) => void;
} & CheckboxFieldProps<TName, TFieldValues>) => react_jsx_runtime.JSX.Element;
declare const CheckboxFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ name, disabled, options, ...props }: Omit<CheckboxFieldProps<TName, TFieldValues>, "checked" | "onChange"> & IInputRegisterOnlyProps<TFieldValues, TName>) => react_jsx_runtime.JSX.Element;
declare const DateField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, error, desc, ...props }: Omit<IInputProps<TName>, "size"> & DateInputProps) => react_jsx_runtime.JSX.Element;
declare const DateFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, useDate, ...props }: Omit<IInputProps<TName>, "size"> & Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const DateRangeField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, error, desc, ...props }: Omit<IInputProps<TName>, "size"> & DateRangeInputProps) => react_jsx_runtime.JSX.Element;
declare const SelectPaginatedFromApiFormField: <T extends {
    data: unknown[];
    meta: ResponseMeta;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ optionValue, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange" | "options">) => react_jsx_runtime.JSX.Element;
declare const SelectFromApiField: <T = unknown, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, error, className, fieldSetClassName, ...rest }: IInputProps<TName> & SelectFromApiProps<T>) => react_jsx_runtime.JSX.Element;
declare const SelectFromApiFormField: <T = unknown, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ control, onChange, optionValue, ...props }: IInputProps<TName> & Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T | null) => unknown;
}) => react_jsx_runtime.JSX.Element;
declare const DateTimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, disabled, error, className, fieldSetClassName, useDate, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
} & DateTimePickerProps) => react_jsx_runtime.JSX.Element;
declare const TimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, control, className, ...props }: Omit<TimePickerProps, "onChange" | "value"> & IInputProps<TName> & {
    control: Control<TFieldValues>;
}) => react_jsx_runtime.JSX.Element;
declare const NumberFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ options, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    options?: NumericFormatProps;
}) => react_jsx_runtime.JSX.Element;
declare const Label: ({ text, required }: {
    required?: boolean;
    size?: "sm";
    text: React__default.ReactNode;
}) => react_jsx_runtime.JSX.Element;
declare const SelectPaginatedFromApiField: <T extends {
    data: unknown[];
    meta: ResponseMeta;
}>({ label, fieldSetClassName, className, desc, error, ...props }: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => react_jsx_runtime.JSX.Element;
declare const Required: () => react_jsx_runtime.JSX.Element;
declare const SaveButton: ({ isLoading, icon, disabled, className, onClick, size, color, children, type, ...props }: {
    type?: "submit" | "button";
    size?: "sm";
    color?: "btn-primary" | "btn-secondary" | "btn-warning" | "btn-error" | "btn-success" | "btn-neutral" | "btn-info";
    onClick?: () => unknown;
    className?: string;
    icon?: React__default.ElementType;
    children?: React__default.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
}) => react_jsx_runtime.JSX.Element;

declare const TOOLTIP_PARALLEL_ID = "parallel-tooltip";
type DialogWithBackProps = {
    onClosed?: () => void;
    title?: string;
    className?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    dialogButtons?: React.ReactNode;
    returnDefault?: string;
};
declare const ParallelDialog: ({ dialogButtons, title, children, onClosed, className, returnDefault, ...rest }: DialogWithBackProps) => react_jsx_runtime.JSX.Element;
declare const ParallelDialogButtons: ({ children }: {
    children: React.ReactNode;
}) => react_jsx_runtime.JSX.Element;

type Include<T, U> = T extends U ? T : never;
declare const Archive: <T>({ title, yes, no, message, archive, onClose, formatErrors, translateId, dialogButtons, onSuccess, children, }: {
    yes?: string;
    no?: string;
    message?: string;
    title: string;
    archive: () => Promise<T>;
    onClose?: () => void;
    children?: React__default.ReactNode;
    dialogButtons?: React__default.ReactNode;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React__default.ReactNode;
    translateId?: string;
    onSuccess?: () => unknown;
}) => react_jsx_runtime.JSX.Element;
declare const ArchiveButtonWithDialog: <T = unknown>({ title, archive, children, formatErrors, onSuccess, }: {
    children: (onClick: () => void, isLoading: boolean) => React__default.ReactNode;
    title: string;
    archive: () => Promise<T>;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React__default.ReactNode;
    onSuccess?: () => unknown;
}) => react_jsx_runtime.JSX.Element;

/**
 * Displays date with tooltip
 * if includeSeconds is passed, then it will update every:
 *  - second where difference is less than 60 seconds
 *  - 30 seconds where difference is less than an hour
 */
declare const HumanDate: ({ date, from, includeSeconds, tooltipId, disableTooltip, }: {
    disableTooltip?: boolean;
    tooltipId?: string;
    includeSeconds?: boolean;
    from?: Date;
    date: string | Date;
}) => react_jsx_runtime.JSX.Element | null;

declare const TOOLTIP_GLOBAL_ID = "global";
declare function Toaster(): react_jsx_runtime.JSX.Element;

declare const DateTime: ({ date, format }: {
    date: string;
    format?: string;
}) => string | null;

declare const TOOLTIP_SIDEBAR_ID = "sidebar";
type MenuItem<T = string> = {
    href: string;
    name: string;
    icon: React__default.ComponentType<{
        className?: string;
    }>;
    claim?: T[];
};
type MenuItemWithSubmenu<T = string> = Omit<MenuItem<T>, "href"> & {
    href?: string;
    onClick?: () => void;
    items?: MenuItem<T>[] | (() => React__default.ReactNode);
};
declare const SidebarMenu: ({ menu, active, expanded, }: {
    expanded?: boolean;
    active: (item: MenuItemWithSubmenu) => boolean;
    menu: MenuItemWithSubmenu[];
}) => react_jsx_runtime.JSX.Element;
declare const SidebarLayout: ({ sidebarExpanded, onExpandChanged, sideChildren, children, menuIcon, icon, className, }: {
    onExpandChanged: (expanded: boolean) => void;
    sidebarExpanded?: boolean;
    sideChildren: (expanded: boolean) => React__default.ReactNode;
    menuIcon: (expanded: boolean) => React__default.ReactNode;
    children: React__default.ReactNode;
    icon: React__default.ReactNode;
    className?: string;
}) => react_jsx_runtime.JSX.Element;

declare const Title: ({ children, outerHeight, truncate, paddingLeft, noBackground, }: {
    truncate?: boolean;
    outerHeight?: string;
    children: React__default.ReactNode;
    paddingLeft?: string;
    noOverlap?: boolean;
    noBackground?: boolean;
}) => react_jsx_runtime.JSX.Element;

export { type ActionColumn, Archive, ArchiveButtonWithDialog, BulkActions, BulkDropDownActions, CheckboxField, CheckboxFormField, type ColumnType, ConfirmSave, type DateColumn, DateField, DateFormField, DateInput, type DateInputProps, DateRangeField, DateRangeInput, type DateRangeInputProps, DateTime, DateTimeFormField, DateTimePicker, type DateTimePickerProps, FilterLink, type FunctionColumn, GeneralErrors, GeneralErrorsInToast, HeaderResponsive, HeaderResponsivePaginated, HumanDate, type IInputProps, IndeterminateCheckbox, InputErrors, Label, LoadingComponent, LocalStorage, type MenuItem, type MenuItemWithSubmenu, type MoreActionType, MoreActions, NumberFormField, type PaginateQuery, PaginatedTable, Pagination, type PaginationSettings, ParallelDialog, ParallelDialogButtons, Popover, PortalSSR, RadioBoxFormField, Required, type ResponseMeta, SaveButton, ScreenSize, Select, SelectFormField, SelectFromApi, SelectFromApiField, SelectFromApiFormField, type SelectFromApiProps, SelectOption, SelectPaginatedFromApi, SelectPaginatedFromApiField, SelectPaginatedFromApiFormField, type SelectPaginatedFromApiProps, type SelectProps, type ServerError, SidebarLayout, SidebarMenu, type SimpleColumn, type StorageInterface, TOOLTIP_GLOBAL_ID, TOOLTIP_PARALLEL_ID, TOOLTIP_SIDEBAR_ID, TableLink, TextFormField, TextareaFormField, TimeFormField, TimePicker, type TimePickerProps, Title, Toaster, addServerErrors, getNextPageParam, getPreviousPageParam, isActionColumn, isFunctionColumn, isParamActive, isServerError, mapToDot, setPartialParams, useFormSubmit, useScreenSize };
