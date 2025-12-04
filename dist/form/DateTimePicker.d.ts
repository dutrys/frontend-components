export type DateTimePickerProps = {
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
export declare function DateTimePicker({ value, size, onChange, disabled, required, from, to, placeholder, className, toggleClassName, ...rest }: DateTimePickerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=DateTimePicker.d.ts.map