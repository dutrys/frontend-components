import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { dateToTimeString, timeToDate } from "@/utils/datetime";
export const TimePicker = ({ className, value, onChange, placeholder, required, disabled, }) => {
    const formatValue = (value) => value ? dateToTimeString(timeToDate(value) || new Date(), "HH:mm") : undefined;
    const [innerValue, setInnerValue] = useState(formatValue(value) || "");
    useEffect(() => {
        setInnerValue(formatValue(value) || "");
    }, [value]);
    return (_jsx("input", { placeholder: placeholder, type: "text", disabled: disabled, required: required, className: className, value: innerValue, onBlur: () => {
            if (innerValue.match(/^\d{2}:\d{2}$/)) {
                onChange({ target: { value: dateToTimeString(timeToDate(innerValue, "HH:mm") || new Date(), "HH:mm:ss") } });
            }
            else {
                setInnerValue(formatValue(value) || "");
            }
        }, onChange: (e) => setInnerValue(e.target.value) }));
};
//# sourceMappingURL=TimePicker.js.map