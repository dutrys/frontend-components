import * as React from "react";
import { DateRange, Matcher } from "react-day-picker";
export type DateInputProps = Omit<React.ComponentPropsWithoutRef<"input">, "size" | "value" | "defaultValue" | "defaultChecked" | "onChange"> & {
    size?: "sm" | "xs";
    hideCalendarIcon?: boolean;
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
export declare const DateInput: ({ onChange, value, className, toggleClassName, required, disabled, size, placeholder, matcher, modifiers, ...rest }: DateInputProps) => import("react/jsx-runtime").JSX.Element;
export type DateRangeInputProps = Omit<DateInputProps, "onChange" | "value"> & {
    onChange: (date: DateRange | null) => unknown;
    value: DateRange | null;
    displayHelpers?: boolean;
};
export declare const DateRangeInput: ({ onChange, value, className, toggleClassName, required, disabled, size, modifiers, placeholder, matcher, hideCalendarIcon, displayHelpers, ...rest }: DateRangeInputProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DateInput.d.ts.map