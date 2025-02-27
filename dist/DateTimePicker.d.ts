import * as React from "react";
export declare function DateTimePicker({ value, onChange, allowEmpty, disabled, required, from, to, placeholder, inputClassName, toggleClassName, }: {
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
}): React.JSX.Element;
//# sourceMappingURL=DateTimePicker.d.ts.map