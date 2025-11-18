import * as React from "react";
export type DateInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "value" | "defaultValue" | "defaultChecked" | "onChange"> & {
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
export declare const DateInput: ({ onChange, value, className, toggleClassName, required, disabled, size, placeholder, from, to, ...rest }: DateInputProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DateInput.d.ts.map