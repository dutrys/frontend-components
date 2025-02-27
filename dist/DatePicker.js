import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import styles from "./DatePicker.module.css";
import { ClockIcon, XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Popover } from "./Popover";
import { useParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { enGB, lt } from "react-day-picker/locale";
const formatDate = (date) => {
    if (!date) {
        return "";
    }
    return format(date, "yyyy-MM-dd");
};
export const DatePicker = ({ onChange, value, inputClassName = "input input-bordered", toggleClassName = "", allowEmpty, disabled, placeholder, }) => {
    const [dateString, setDateString] = useState(value ? formatDate(value) : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? formatDate(value) : "");
    }, [value]);
    return (_jsxs("div", { className: `w-full ${inputClassName}`, children: [_jsx(Popover, { showOnClick: true, showOnFocus: true, showOnHover: false, popoverWidth: "", title: (ref, props) => (_jsx("input", { ref: ref, ...props, value: dateString, className: "grow", disabled: disabled, placeholder: placeholder, onChange: (e) => {
                        if (e.target.value.length > 10) {
                            return;
                        }
                        setDateString(e.target.value);
                        if (e.target.value.length !== 10) {
                            return;
                        }
                        const date = parse(e.target.value, "yyyy-MM-dd", new Date());
                        if (isValid(date)) {
                            onChange(date);
                        }
                    }, onBlur: () => {
                        const date = parse(dateString, "yyyy-MM-dd", new Date());
                        if (isValid(date)) {
                            onChange(date);
                        }
                    } })), children: (close) => (_jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, selected: value || undefined, onSelect: (day) => {
                        onChange(day || null);
                        close();
                    } })) }), allowEmpty ? (_jsx("button", { disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? _jsx(XMarkIcon, { className: "size-4" }) : _jsx(ClockIcon, { className: "size-4" }) })) : (_jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: _jsx(CalendarIcon, { className: "size-4" }) }))] }));
};
//# sourceMappingURL=DatePicker.js.map