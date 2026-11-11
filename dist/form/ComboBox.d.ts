import React from "react";
export declare const PortalSSR: (props: {
    enabled?: boolean;
    children: React.ReactNode;
}) => string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
export type ComboBoxProps<T> = {
    size?: "sm" | "xs" | "lg";
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
    header?: React.ReactNode;
    beforeOptions?: React.ReactNode;
    afterOptions?: React.ReactNode;
    options: T[];
    minWidth?: number;
    maxHeight?: number;
    optionLabel?: (model: T, inOptions: boolean) => string;
    groupBy?: (model: T) => string;
    onQueryChange?: (query: string) => void;
    afterInput?: React.ReactNode;
    hideNoItemsOption?: boolean;
    outerClassName?: string;
    filter?: (model: T, q: string) => boolean;
};
export declare const ComboBox: <T = unknown>({ onChange, disabled, required, inputRef, options, name, portalEnabled, optionLabel, value, size, className, placeholder, groupBy, empty, beforeOptions, header, afterOptions, onQueryChange, minWidth, maxHeight, afterInput, hideNoItemsOption, autoFocus, outerClassName, filter, ...rest }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "onChange" | "defaultValue" | "type" | "value" | "children"> & ComboBoxProps<T>) => import("react/jsx-runtime").JSX.Element;
export declare const ComboBoxOption: ({ value, size, children, className, ...rest }: {
    children: React.ReactNode;
    value: unknown;
    className?: string;
    size?: "xs" | "sm" | "lg";
}) => import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated use ComboBox
 */
export declare const Select: <T = unknown>({ onChange, disabled, required, inputRef, options, name, portalEnabled, optionLabel, value, size, className, placeholder, groupBy, empty, beforeOptions, header, afterOptions, onQueryChange, minWidth, maxHeight, afterInput, hideNoItemsOption, autoFocus, outerClassName, filter, ...rest }: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size" | "multiple" | "onChange" | "defaultValue" | "type" | "value" | "children"> & ComboBoxProps<T>) => import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated use ComboBoxOption
 */
export declare const SelectOption: ({ value, size, children, className, ...rest }: {
    children: React.ReactNode;
    value: unknown;
    className?: string;
    size?: "xs" | "sm" | "lg";
}) => import("react/jsx-runtime").JSX.Element;
/**
 * @deprecated use ComboBoxProps
 */
export type SelectProps<T> = ComboBoxProps<T>;
//# sourceMappingURL=ComboBox.d.ts.map