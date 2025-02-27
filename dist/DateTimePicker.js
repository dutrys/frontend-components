import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { format, isSameDay, isSameHour, isValid, parse } from "date-fns";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./DatePicker.module.css";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Popover } from "./Popover";
import { DayPicker } from "react-day-picker";
import { enGB, lt } from "react-day-picker/locale";
export function DateTimePicker({ value, onChange, allowEmpty, disabled, required, from, to, placeholder, inputClassName = "input input-bordered", toggleClassName = "", }) {
    const [dateString, setDateString] = useState(value ? format(value, "yyyy-MM-dd HH:mm") : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? format(value, "yyyy-MM-dd HH:mm") : "");
    }, [value]);
    const [valueTemp, setValueTemp] = useState(value);
    useEffect(() => {
        setValueTemp(value);
    }, [value]);
    const minutesRef = useRef(null);
    const hoursRef = useRef(null);
    useEffect(() => {
        setDateString(valueTemp ? format(valueTemp, "yyyy-MM-dd HH:mm") : "");
        try {
            if (valueTemp) {
                minutesRef.current
                    ?.querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                hoursRef.current
                    ?.querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        catch (_) { }
    }, [valueTemp]);
    const t = useTranslations();
    let matcher = undefined;
    if (from && to) {
        matcher = { before: from, after: to };
    }
    if (from) {
        matcher = { before: from };
    }
    if (to) {
        matcher = { after: to };
    }
    return (_jsxs("label", { className: `w-full ${inputClassName}`, children: [_jsx(Popover, { title: (ref, props) => (_jsx("input", { required: required, value: dateString, className: "grow", disabled: disabled, ref: ref, placeholder: placeholder, onChange: (e) => {
                        setDateString(e.target.value);
                        if (e.target.value.length !== 16) {
                            return;
                        }
                        const date = parse(e.target.value, "yyyy-MM-dd HH:mm", new Date());
                        if (isValid(date)) {
                            setValueTemp(date);
                        }
                    }, ...props, onBlur: (e) => {
                        const date = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
                        if (isValid(date)) {
                            onChange(date);
                        }
                        if (typeof props?.onBlur === "function") {
                            props.onBlur(e);
                        }
                    } })), onShow: (open) => {
                    if (!open) {
                        onChange(valueTemp);
                        return;
                    }
                    if (minutesRef.current && hoursRef.current && valueTemp) {
                        try {
                            minutesRef.current
                                .querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
                                ?.scrollIntoView({ behavior: "instant", block: "center" });
                            hoursRef.current
                                .querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
                                ?.scrollIntoView({ behavior: "instant", block: "center" });
                        }
                        catch (_) { }
                    }
                }, showOnClick: true, showOnFocus: true, showOnHover: false, popoverWidth: "", children: (close) => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex", children: [_jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, disabled: matcher, selected: valueTemp || undefined, defaultMonth: valueTemp || new Date(), onSelect: (day) => {
                                        day?.setHours((valueTemp || new Date()).getHours(), (valueTemp || new Date()).getMinutes() || 0);
                                        if (from && day && from > day) {
                                            day.setHours(from.getHours(), from.getMinutes());
                                        }
                                        if (to && day && to < day) {
                                            day.setHours(to.getHours(), to.getMinutes());
                                        }
                                        setValueTemp(day || null);
                                    } }), _jsxs("div", { children: [_jsxs("div", { className: "text-white text-center pt-5 pb-4 text-xs", children: [t("datePicker.time"), ":"] }), _jsxs("div", { className: "flex", children: [_jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: hoursRef, children: new Array(24).fill(0).map((_, hour) => (_jsx("li", { "data-hour": hour, children: (from && valueTemp && isSameDay(from, valueTemp) && from.getHours() > hour) ||
                                                            (to && valueTemp && isSameDay(to, valueTemp) && to.getHours() < hour) ? (_jsx(_Fragment, {})) : (_jsx("button", { className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getHours() === hour ? "bg-primary-500" : "hover:bg-white"}`, onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setHours(hour);
                                                                setValueTemp(date);
                                                            }, children: hour < 10 ? `0${hour}` : hour })) }, hour))) }), _jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: minutesRef, children: new Array(60).fill(0).map((_, minute) => (_jsx("li", { "data-minute": minute, children: (from && valueTemp && isSameHour(from, valueTemp) && from.getMinutes() > minute) ||
                                                            (to && valueTemp && isSameHour(to, valueTemp) && to.getMinutes() < minute) ? (_jsx(_Fragment, {})) : (_jsx("button", { onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setMinutes(minute);
                                                                setValueTemp(date);
                                                            }, className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getMinutes() === minute ? "bg-primary-500" : "hover:bg-white"}`, children: minute + 1 < 10 ? `0${minute}` : minute })) }, minute))) })] })] })] }), _jsx("div", { className: "text-center pb-2", children: _jsx("button", { className: "btn btn-xs mx-auto w-30", type: "button", onClick: () => {
                                    onChange(valueTemp);
                                    close();
                                }, children: t("datePicker.ok") }) })] })) }), allowEmpty ? (_jsx("button", { disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? _jsx(XMarkIcon, { className: "size-4" }) : _jsx(ClockIcon, { className: "size-4" }) })) : (_jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: _jsx(ClockIcon, { className: "size-4" }) }))] }));
}
//# sourceMappingURL=DateTimePicker.js.map