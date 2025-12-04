import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { ChangeEvent } from 'react';
import { Placement } from '@floating-ui/utils';
import { ResponseMeta as ResponseMeta$1, PaginateQuery as PaginateQuery$1 } from '@/utils/paginate';
import { StorageInterface as StorageInterface$1 } from '@/pagination/StorageInterface';
import { ColumnType as ColumnType$1 } from '@/pagination/PaginatedTable';
import * as react_hook_form from 'react-hook-form';
import { FieldErrors, FieldValues, UseFormProps, UseFormSetError, FieldPath, FieldError, Merge, RegisterOptions, UseFormRegister, Control } from 'react-hook-form';
import { ReadonlyURLSearchParams } from 'next/navigation';
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

declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => react_jsx_runtime.JSX.Element;
declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => react_jsx_runtime.JSX.Element;
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
declare const ArchiveButton: (props: {
    size?: "xs" | "sm" | "lg" | "xl";
    onClick?: (e: MouseEvent) => void;
    href?: string;
    tooltipId?: string;
}) => react_jsx_runtime.JSX.Element;
declare const ActionButton: ({ tooltipId, icon, tooltip, className, size, ...props }: {
    size?: "xs" | "sm" | "lg" | "xl";
    href?: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    tooltipId?: string;
    icon: React__default.ElementType;
    tooltip: React__default.ReactNode;
    prefetch?: boolean;
}) => react_jsx_runtime.JSX.Element;

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

declare const Pagination: ({ page, visiblePages, onClick, size, className, }: {
    className?: string;
    size?: "sm" | "xs";
    onClick?: (page: number) => void;
    page: ResponseMeta$1;
    visiblePages: number;
}) => react_jsx_runtime.JSX.Element;

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
    meta: ResponseMeta$1;
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
        store?: StorageInterface$1<TModel["data"][number]>;
        stored?: {
            name?: string;
            value: Record<string, {
                name: string;
                enabled: boolean;
            }[]>;
        };
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

interface StorageInterface<T = unknown> {
    getConfigs(title: string | undefined, columns: ColumnType$1<T>[]): Promise<Record<string, {
        name: string;
        enabled: boolean;
    }[]>>;
    setConfigs(title: string, configs: Record<string, {
        name: string;
        enabled: boolean;
    }[]>): Promise<void>;
    getConfigName(title: string): Promise<string>;
    setConfigName(title: string, configName: string): Promise<void>;
    setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void>;
    getDisplayAs(title: string): Promise<"grid" | "list">;
    getConfig(title: string, columns: ColumnType$1<T>[]): Promise<{
        name: string;
        enabled: boolean;
    }[]>;
}
declare class LocalStorage<T> implements StorageInterface<T> {
    setDisplayAs(title: string, displayAs: "grid" | "list"): Promise<void>;
    getDisplayAs(title: string): Promise<"grid" | "list">;
    getConfig(title: string | undefined, columns: ColumnType$1<T>[]): Promise<{
        name: string;
        enabled: boolean;
    }[]>;
    getConfigName(title: string): Promise<string>;
    getConfigs(title: string, columns: ColumnType$1<T>[]): Promise<Record<string, {
        name: string;
        enabled: boolean;
    }[]>>;
    setConfigName(title: string, configName: string): Promise<void>;
    setConfigs(title: string, configs: Record<string, {
        name: string;
        enabled: boolean;
    }[]>): Promise<void>;
}

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
    from?: Date;
    to?: Date;
    required?: boolean;
    disabled?: boolean;
    value: Date | null;
    className?: string;
    toggleClassName?: string;
    placeholder?: string;
    onChange: (date: Date | null) => unknown;
};
declare const DateInput: ({ onChange, value, className, toggleClassName, required, disabled, size, placeholder, from, to, ...rest }: DateInputProps) => react_jsx_runtime.JSX.Element;

type SelectPaginatedFromApiProps<TModel extends {
    meta: ResponseMeta$1;
    data: {
        id: number;
    }[];
}> = {
    size?: "sm" | "xs";
    name?: string;
    inputRef?: any;
    queryFn: (query: PaginateQuery$1<any>) => Promise<TModel>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    value: TModel["data"][0] | number | null;
    className?: string;
    onChange: (model: TModel["data"][0] | null) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    valueFormat?: (model: TModel["data"][0]) => string;
    groupBy?: (model: TModel["data"][0]) => string;
    heading?: React__default.ReactNode;
    footer?: React__default.ReactNode;
    searchFromChars?: number;
    optionsClassName?: string;
    portalEnabled?: boolean;
};
declare function PortalSSR(props: {
    enabled?: boolean;
    children: React__default.ReactNode;
}): string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;
declare const SelectPaginatedFromApi: <TModel extends {
    meta: ResponseMeta$1;
    data: {
        id: number;
    }[];
}>({ onChange, disabled, required, inputRef, name, value, size, searchFromChars, className, groupBy, queryKey, queryFn, placeholder, empty, portalEnabled, optionsClassName, valueFormat, heading, footer, ...rest }: SelectPaginatedFromApiProps<TModel>) => react_jsx_runtime.JSX.Element;

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

type SelectFromApiProps<TModel extends {
    id: number;
}> = {
    portalEnabled?: boolean;
    size?: "sm" | "xs";
    inputClassName?: string;
    name?: string;
    inputRef?: any;
    queryFn: () => Promise<TModel[]>;
    queryKey: ReadonlyArray<any>;
    placeholder?: string;
    optionsClassName?: string;
    value: number | null;
    className?: string;
    onChange: (model: TModel) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    valueFormat?: (model: TModel) => string;
    filter?: (model: TModel, query: string) => boolean;
};
declare const SelectFromApi: <TModel extends {
    id: number;
}>({ onChange, disabled, required, inputRef, name, value, size, portalEnabled, className, queryKey, queryFn, placeholder, optionsClassName, empty, valueFormat, inputClassName, filter, ...rest }: SelectFromApiProps<TModel>) => react_jsx_runtime.JSX.Element;

interface IInputRegisterProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends IInputProps<TName> {
    options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
    register: UseFormRegister<TFieldValues>;
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
declare const CheckboxFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: Omit<IInputRegisterProps<TFieldValues, TName>, "required"> & {
    labelClassName?: string;
    checkbox?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const DateFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, control, error, desc, disabled, useDate, ...props }: Omit<IInputProps<TName>, "size"> & Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const SelectPaginatedFromApiFormField: <T extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ fieldSetClassName, label, disabled, ...props }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange">) => react_jsx_runtime.JSX.Element;
declare const SelectFromApiField: <T extends {
    id: number;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, error, className, fieldSetClassName, ...rest }: IInputProps<TName> & SelectFromApiProps<T>) => react_jsx_runtime.JSX.Element;
declare const SelectFromApiFormField: <T extends {
    id: number;
}, TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, error, className, onChange, fieldSetClassName, ...rest }: IInputProps<TName> & Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T) => unknown;
}) => react_jsx_runtime.JSX.Element;
declare const DateTimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ label, desc, control, name, disabled, error, className, fieldSetClassName, useDate, ...rest }: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
} & DateTimePickerProps) => react_jsx_runtime.JSX.Element;
declare const TimeFormField: <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
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
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}>({ label, fieldSetClassName, className, desc, error, ...props }: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => react_jsx_runtime.JSX.Element;
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
declare const Required: () => react_jsx_runtime.JSX.Element;
declare const SaveButton: ({ isLoading, icon, disabled, className, onClick, size, children, type, ...props }: {
    type?: "submit" | "button";
    size?: "sm";
    onClick?: () => unknown;
    className?: string;
    icon?: React__default.ElementType;
    children?: React__default.ReactNode;
    isLoading?: boolean;
    disabled?: boolean;
}) => react_jsx_runtime.JSX.Element;
declare const IndeterminateCheckbox: ({ checked, className, indeterminate, onChange, }: {
    onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
    checked: boolean;
    className: string;
    indeterminate?: boolean;
}) => react_jsx_runtime.JSX.Element;

declare const TimePicker: ({ className, value, onChange, placeholder, required, disabled, }: {
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
    onChange: (e: any) => void;
    className?: string;
    value: string | undefined | null;
}) => react_jsx_runtime.JSX.Element;

type SelectProps = {
    size?: "sm" | "xs";
    name?: string;
    inputRef?: any;
    placeholder?: string;
    value: {
        label: string;
        value: number | string;
    } | null;
    className?: string;
    onChange: (model: {
        label: string;
        value: number | string;
    } | null) => void;
    disabled?: boolean;
    required?: boolean;
    empty?: string;
    header?: React__default.ReactNode;
    beforeOptions?: React__default.ReactNode;
    afterOptions?: React__default.ReactNode;
    options: {
        label: string;
        value: number | string;
    }[];
};
declare const Select: ({ onChange, disabled, required, inputRef, options, name, value, size, className, placeholder, empty, beforeOptions, header, afterOptions, ...rest }: SelectProps) => react_jsx_runtime.JSX.Element;
declare const SelectOption: ({ value, size, children, className, ...rest }: {
    children: React__default.ReactNode;
    value: unknown;
    className?: string;
    size?: "xs" | "sm";
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
type MenuItem = {
    href: string;
    name: string;
    icon: React__default.ComponentType<{
        className?: string;
    }>;
};
type MenuItemWithSubmenu = Omit<MenuItem, "href"> & {
    href?: string;
    onClick?: () => void;
    items?: MenuItem[] | (() => React__default.ReactNode);
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

export { ActionButton, type ActionColumn, Archive, ArchiveButton, ArchiveButtonWithDialog, BulkActions, BulkDropDownActions, CheckboxFormField, type ColumnType, ConfirmSave, type DateColumn, DateFormField, DateInput, type DateInputProps, DateTime, DateTimeFormField, DateTimePicker, type DateTimePickerProps, EditButton, FilterLink, type FunctionColumn, GeneralErrors, GeneralErrorsInToast, HeaderResponsive, HeaderResponsivePaginated, HumanDate, type IInputProps, IndeterminateCheckbox, InputErrors, Label, LoadingComponent, LocalStorage, type MenuItem, type MenuItemWithSubmenu, type MoreActionType, MoreActions, NumberFormField, type PaginateQuery, PaginatedTable, Pagination, ParallelDialog, Popover, PortalSSR, RadioBoxFormField, Required, type ResponseMeta, SaveButton, ScreenSize, Select, SelectFormField, SelectFromApi, SelectFromApiField, SelectFromApiFormField, type SelectFromApiProps, SelectOption, SelectPaginatedFromApi, SelectPaginatedFromApiField, SelectPaginatedFromApiFormField, type SelectPaginatedFromApiProps, type SelectProps, type ServerError, SidebarLayout, SidebarMenu, type SimpleColumn, type StorageInterface, TOOLTIP_GLOBAL_ID, TOOLTIP_PARALLEL_ID, TOOLTIP_SIDEBAR_ID, TableLink, TextFormField, TextareaFormField, TimeFormField, TimePicker, Toaster, ViewButton, addServerErrors, getNextPageParam, getPreviousPageParam, isActionColumn, isFunctionColumn, isParamActive, isServerError, mapToDot, setPartialParams, useFormSubmit, useScreenSize };
