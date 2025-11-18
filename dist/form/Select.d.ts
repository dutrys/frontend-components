import React from "react";
export type SelectProps = {
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
    header?: React.ReactNode;
    beforeOptions?: React.ReactNode;
    afterOptions?: React.ReactNode;
    options: {
        label: string;
        value: number | string;
    }[];
};
export declare const Select: ({ onChange, disabled, required, inputRef, options, name, value, size, className, placeholder, empty, beforeOptions, header, afterOptions, ...rest }: SelectProps) => import("react/jsx-runtime").JSX.Element;
export declare const SelectOption: ({ value, size, children, ...rest }: {
    children: React.ReactNode;
    value: unknown;
    size?: "xs" | "sm";
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Select.d.ts.map