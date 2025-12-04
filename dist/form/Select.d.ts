import React from "react";
export declare function PortalSSR(props: {
    enabled?: boolean;
    children: React.ReactNode;
}): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
export type SelectProps<T> = {
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
    header?: React.ReactNode;
    beforeOptions?: React.ReactNode;
    afterOptions?: React.ReactNode;
    options: T[];
    minWidth?: number;
    maxHeight?: number;
    optionLabel: (model: T) => string;
    groupBy?: (model: T) => string;
    onQueryChange?: (query: string) => void;
    afterInput?: React.ReactNode;
    hideNoItemsOption?: boolean;
};
export declare const Select: <T = unknown>({ onChange, disabled, required, inputRef, options, name, portalEnabled, optionLabel, value, size, className, placeholder, groupBy, empty, beforeOptions, header, afterOptions, onQueryChange, minWidth, maxHeight, afterInput, hideNoItemsOption, ...rest }: SelectProps<T>) => import("react/jsx-runtime").JSX.Element;
export declare const SelectOption: ({ value, size, children, className, ...rest }: {
    children: React.ReactNode;
    value: unknown;
    className?: string;
    size?: "xs" | "sm";
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Select.d.ts.map