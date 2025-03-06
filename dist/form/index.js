import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect, Fragment as Fragment$1 } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useForm, Controller } from 'react-hook-form';
import { captureException } from '@sentry/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { format, isSameDay, isSameHour, parse, isValid } from 'date-fns';
import { XMarkIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useFloating, offset, flip, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow } from '@floating-ui/react';
import { DayPicker } from 'react-day-picker';
import { lt, enGB } from 'react-day-picker/locale';
import { useQuery } from '@tanstack/react-query';
import { Combobox, ComboboxInput, ComboboxButton, Transition, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import 'date-fns-tz';
import cx from 'classnames';
import { NumericFormat } from 'react-number-format';

const GeneralErrorsInToast = ({ errors, translateId, except = [], className = "", }) => {
    const t = useTranslations();
    return (jsx("ul", { className: "list list-disc pl-4", children: Object.keys(errors)
            .filter((key) => !except.includes(key))
            .map((key) => {
            const error = errors[key];
            return (jsx(React.Fragment, { children: error.map((error) => (jsxs("li", { children: [translateId && t.has(`${translateId}.${key}`) && (jsxs("span", { className: className || "text-red-800", children: [t(`${translateId}.${key}`), ": "] })), jsx("span", { className: className || "text-red-500", children: error })] }, error))) }, key));
        }) }));
};
const isError = (error) => typeof error === "object" && typeof error.type === "string" && typeof error.message === "string";
const mapToDot = (errors) => {
    const r = {};
    for (const key of Object.keys(errors)) {
        const error = errors[key];
        if (isError(error)) {
            r[key] = r[key] || [];
            if (typeof error.message === "string") {
                r[key].push(error.message);
            }
        }
        else {
            // @ts-ignore
            const dot = mapToDot(error);
            for (const k of Object.keys(dot)) {
                r[`${key}.${k}`] = dot[k];
            }
        }
    }
    return r;
};
const GeneralErrors = (props) => jsx(GeneralErrorsInToast, { ...props, errors: mapToDot(props.errors) });
const InputErrors = ({ errors, className = "text-xs text-primary-700", }) => {
    if (!errors) {
        return null;
    }
    const messages = Array.from(new Set(formatError(errors)));
    if (messages.length === 1) {
        return (jsx("span", { className: className, children: messages[0] }, messages[0]));
    }
    return (jsx("ul", { className: "pl-4 list-disc", children: messages.map((message) => (jsx("li", { className: className, children: message }, message))) }));
};
const formatError = (errors) => {
    const formattedErrors = [];
    if (typeof errors === "object") {
        if (typeof errors.message === "string") {
            errors.message.split(", ").forEach((s) => {
                formattedErrors.push(s);
            });
        }
        if (typeof errors.ref === "undefined") {
            Object.keys(errors).forEach((key) => formattedErrors.push(...formatError(errors[key])));
        }
    }
    if (Array.isArray(errors)) {
        errors.forEach((error) => formattedErrors.push(...formatError(error)));
    }
    return formattedErrors;
};
const isServerError = (error) => typeof error === "object" && typeof error.errors === "object";
const useFormSubmit = (doSubmitCallback, formOptions = {}) => {
    const t = useTranslations();
    const router = useRouter();
    const { returnBack, reportProgress, onError, onSuccess, loadingText, savedText, ...options } = formOptions;
    const formProps = useForm(options);
    return {
        ...formProps,
        handleSubmit: () => formProps.handleSubmit((values) => {
            const promise = doSubmitCallback(values)
                .then((data) => {
                if (isServerError(data)) {
                    if (typeof onError === "function") {
                        onError(data);
                    }
                    addServerErrors(data.errors, formProps.setError);
                    throw data;
                }
                if (typeof onSuccess === "function") {
                    onSuccess(data);
                }
                if (returnBack !== false) {
                    router.back();
                }
            })
                .catch((e) => {
                captureException(e);
                throw e;
            });
            if (reportProgress !== false) {
                void toast.promise(promise, {
                    loading: loadingText || t("general.saving"),
                    success: savedText || t("general.saved"),
                    error: (data) => {
                        if (isServerError(data)) {
                            return (jsxs(Fragment, { children: [t("general.validateError"), ":", " ", jsx(GeneralErrors, { className: "text-gray-500", translateId: options.translateErrors, errors: formProps.formState.errors })] }));
                        }
                        return t("general.error");
                    },
                }, { id: "form-submit" });
            }
            return promise;
        }),
    };
};
const addServerErrors = (errors, setError) => Object.entries(errors).forEach(([key, value]) => {
    const array = Array.isArray(value) ? value : [errors];
    setError(key, { type: "server", message: array?.join(", ") || "" });
});

var styles$1 = {"dayPicker":"DatePicker-module_dayPicker__VRSSY"};

const Popover = ({ title, children, popoverClassName = "py-1", onShow, open: openProp, showOnHover = true, showOnClick = false, showOnFocus = false, popoverWidth, bgColor = "#1e293b", borderColor = "#1e293b", }) => {
    const [isOpen, setIsOpen] = useState(openProp || false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        open: isOpen,
        onOpenChange: (open) => {
            onShow?.(open);
            setIsOpen(open);
        },
        whileElementsMounted: autoUpdate,
        middleware: [offset(10), flip({ padding: 10 }), arrow({ element: arrowRef })],
    });
    useEffect(() => {
        if (typeof openProp !== "undefined") {
            setIsOpen(openProp);
        }
    }, [openProp, setIsOpen]);
    const focus = useFocus(context, { enabled: showOnFocus });
    const hover = useHover(context, { enabled: showOnHover, handleClose: safePolygon() });
    const click = useClick(context, { enabled: showOnClick, keyboardHandlers: false });
    const dismiss = useDismiss(context, { escapeKey: false, bubbles: true });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);
    return (jsxs(Fragment, { children: [title(refs.setReference, getReferenceProps()), isOpen && (jsx(FloatingPortal, { children: jsxs("div", { ref: refs.setFloating, style: { ...floatingStyles, zIndex: 1100, borderColor, backgroundColor: bgColor }, ...getFloatingProps(), className: `${popoverClassName} border rounded-sm shadow-lg shadow-gray-400`, children: [jsx(FloatingArrow, { strokeWidth: 1, fill: bgColor, stroke: borderColor, context: context, ref: arrowRef }), jsx("div", { className: popoverWidth, children: children(() => setIsOpen(false)) })] }) }))] }));
};

function DateTimePicker({ value, onChange, allowEmpty, disabled, required, from, to, placeholder, inputClassName = "input input-bordered", toggleClassName = "", }) {
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
    return (jsxs("label", { className: `w-full ${inputClassName}`, children: [jsx(Popover, { title: (ref, props) => (jsx("input", { required: required, value: dateString, className: "grow", disabled: disabled, ref: ref, placeholder: placeholder, onChange: (e) => {
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
                }, showOnClick: true, showOnFocus: true, showOnHover: false, popoverWidth: "", children: (close) => (jsxs(Fragment, { children: [jsxs("div", { className: "flex", children: [jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$1.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, disabled: matcher, selected: valueTemp || undefined, defaultMonth: valueTemp || new Date(), onSelect: (day) => {
                                        day?.setHours((valueTemp || new Date()).getHours(), (valueTemp || new Date()).getMinutes() || 0);
                                        if (from && day && from > day) {
                                            day.setHours(from.getHours(), from.getMinutes());
                                        }
                                        if (to && day && to < day) {
                                            day.setHours(to.getHours(), to.getMinutes());
                                        }
                                        setValueTemp(day || null);
                                    } }), jsxs("div", { children: [jsxs("div", { className: "text-white text-center pt-5 pb-4 text-xs", children: [t("datePicker.time"), ":"] }), jsxs("div", { className: "flex", children: [jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: hoursRef, children: new Array(24).fill(0).map((_, hour) => (jsx("li", { "data-hour": hour, children: (from && valueTemp && isSameDay(from, valueTemp) && from.getHours() > hour) ||
                                                            (to && valueTemp && isSameDay(to, valueTemp) && to.getHours() < hour) ? (jsx(Fragment, {})) : (jsx("button", { className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getHours() === hour ? "bg-primary-500" : "hover:bg-white"}`, onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setHours(hour);
                                                                setValueTemp(date);
                                                            }, children: hour < 10 ? `0${hour}` : hour })) }, hour))) }), jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: minutesRef, children: new Array(60).fill(0).map((_, minute) => (jsx("li", { "data-minute": minute, children: (from && valueTemp && isSameHour(from, valueTemp) && from.getMinutes() > minute) ||
                                                            (to && valueTemp && isSameHour(to, valueTemp) && to.getMinutes() < minute) ? (jsx(Fragment, {})) : (jsx("button", { onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setMinutes(minute);
                                                                setValueTemp(date);
                                                            }, className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getMinutes() === minute ? "bg-primary-500" : "hover:bg-white"}`, children: minute + 1 < 10 ? `0${minute}` : minute })) }, minute))) })] })] })] }), jsx("div", { className: "text-center pb-2", children: jsx("button", { className: "btn btn-xs mx-auto w-30", type: "button", onClick: () => {
                                    onChange(valueTemp);
                                    close();
                                }, children: t("datePicker.ok") }) })] })) }), allowEmpty ? (jsx("button", { disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? jsx(XMarkIcon, { className: "size-4" }) : jsx(ClockIcon, { className: "size-4" }) })) : (jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: jsx(ClockIcon, { className: "size-4" }) }))] }));
}

const formatDate = (date) => {
    if (!date) {
        return "";
    }
    return format(date, "yyyy-MM-dd");
};
const DatePicker = ({ onChange, value, inputClassName = "input input-bordered", toggleClassName = "", required, allowEmpty, disabled, placeholder, }) => {
    const [dateString, setDateString] = useState(value ? formatDate(value) : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? formatDate(value) : "");
    }, [value]);
    return (jsxs("div", { className: `w-full ${inputClassName}`, children: [jsx(Popover, { showOnClick: true, showOnFocus: true, showOnHover: false, popoverWidth: "", title: (ref, props) => (jsx("input", { ref: ref, ...props, value: dateString, className: "grow", required: required, disabled: disabled, placeholder: placeholder, onChange: (e) => {
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
                    } })), children: (close) => (jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$1.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, selected: value || undefined, onSelect: (day) => {
                        onChange(day || null);
                        close();
                    } })) }), allowEmpty ? (jsx("button", { disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? jsx(XMarkIcon, { className: "size-4" }) : jsx(ClockIcon, { className: "size-4" }) })) : (jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: jsx(CalendarIcon, { className: "size-4" }) }))] }));
};

const SEARCH_FROM_QUERY_LENGTH = 3;
const SelectPaginatedFromApi = ({ onChange, disabled, required, value, className, queryKey, queryFunction, placeholder, valueFormat = (model) => model.name, inputClassName = "w-full mx-0 input input-bordered", ...rest }) => {
    const [query, setQuery] = useState("");
    const { isLoading, data, refetch } = useQuery({
        enabled: !disabled,
        queryKey: [...queryKey, query.length < SEARCH_FROM_QUERY_LENGTH ? "" : query],
        queryFn: ({ queryKey }) => {
            if (!queryFunction) {
                return null;
            }
            const search = queryKey[queryKey.length - 1] || "";
            if (search === "") {
                return queryFunction({ limit: 100 });
            }
            return search.length >= SEARCH_FROM_QUERY_LENGTH ? queryFunction({ search, limit: 100 }) : null;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const t = useTranslations("selectFromApi");
    useEffect(() => {
        void refetch();
    }, [refetch, query]);
    return (jsx(Combobox, { immediate: true, "data-testid": "select", disabled: disabled, value: (data?.data || []).find((b) => b.id === value) || null, onChange: onChange, ...rest, children: jsxs("div", { className: `relative ${className}`, children: [jsxs("div", { className: "w-full relative p-0", children: [jsx(ComboboxInput, { required: required, "data-testid": "select-input", placeholder: placeholder, onFocus: (e) => e?.target?.select(), className: inputClassName, displayValue: (model) => (model ? valueFormat(model) : ""), onChange: (event) => setQuery(event.target.value) }), jsx(ComboboxButton, { "data-testid": "select-input-btn", className: "absolute inset-y-0 right-0 flex items-center pr-2", children: jsx(ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) })] }), jsx(Transition, { as: Fragment$1, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: jsxs(ComboboxOptions, { className: "absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm", children: [!required && data && data?.meta?.totalItems !== 0 && (jsx(ComboboxOption, { "data-testid": "select-option-empty", className: ({ focus }) => `relative select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`, value: null, children: jsx("span", { className: "block truncate", children: t("empty") }) }, "empty")), isLoading || !data?.data || data?.data?.length === 0 ? (jsx("div", { className: "relative cursor-default select-none py-2 px-4 text-gray-700", children: jsx("span", { children: query.length > 0 && query.length < SEARCH_FROM_QUERY_LENGTH
                                        ? t("enterMoreSymbols", { value: SEARCH_FROM_QUERY_LENGTH })
                                        : isLoading || data?.data === null
                                            ? t("searching")
                                            : t("nothingFound") }) })) : (data?.data.map((model, i) => (jsx(ComboboxOption, { "data-testid": `select-option-${i}`, className: ({ focus }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`, value: model, children: ({ selected, focus }) => (jsxs(Fragment, { children: [jsx("span", { className: `block truncate ${focus ? "text-white" : ""} ${selected ? "pr-3 font-bold" : "font-normal"}`, children: valueFormat(model) }), selected ? (jsx("span", { className: `absolute inset-y-0 right-1 flex items-center pl-3 ${focus ? "text-white" : "text-teal-600"}`, children: jsx(CheckIcon, { className: "h-5 w-5", "aria-hidden": "true" }) })) : null] })) }, model.id))))] }) })] }) }));
};

const timeToDate = (date, format = "HH:mm:ss") => {
    let parsed = parse(date, format, new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
const dateToTimeString = (date, timeFormat = "HH:mm:ss") => format(date, timeFormat);
const stringToDate = (date, timeZone) => {
    let parsed = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};

const TimePicker = ({ className, value, onChange, placeholder, required, disabled, }) => {
    const formatValue = (value) => value ? dateToTimeString(timeToDate(value) || new Date(), "HH:mm") : undefined;
    const [innerValue, setInnerValue] = useState(formatValue(value) || "");
    useEffect(() => {
        setInnerValue(formatValue(value) || "");
    }, [value]);
    return (jsx("input", { placeholder: placeholder, type: "text", disabled: disabled, required: required, className: className, value: innerValue, onBlur: () => {
            if (innerValue.match(/^\d{2}:\d{2}$/)) {
                onChange({ target: { value: dateToTimeString(timeToDate(innerValue, "HH:mm") || new Date(), "HH:mm:ss") } });
            }
            else {
                setInnerValue(formatValue(value) || "");
            }
        }, onChange: (e) => setInnerValue(e.target.value) }));
};

var styles = {"desc":"Input-module_desc__3D3hV"};

const TextInput = (props) => {
    const options = {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    };
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("input", { id: props.id, type: props.type || "text", ...props.register(props.name, options), required: props.required, disabled: props.disabled, placeholder: props.label, className: cx("input input-bordered w-full", props.className, {
                            "input-xs": props.size === "xs",
                            "input-sm": props.size === "sm",
                            "input-error": props.error,
                        }) }), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const SelectInput = (props) => {
    const options = {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    };
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("select", { id: props.id, disabled: props.disabled, ...props.register(props.name, options), className: cx("select select-bordered w-full", props.className, {
                            "select-xs": props.size === "xs",
                            "select-sm": props.size === "sm",
                            "select-error": props.error,
                        }), children: props.children }), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const TextareaInput = (props) => {
    const options = {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    };
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("textarea", { id: props.id, disabled: props.disabled, ...props.register(props.name, options), className: cx("textarea textarea-bordered w-full", props.className, {
                            "textarea-xs": props.size === "xs",
                            "textarea-sm": props.size === "sm",
                            "textarea-error": props.error,
                        }) }), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const CheckboxInput = (props) => {
    const options = {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    };
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { children: [jsx("input", { id: props.id, type: "checkbox", disabled: props.disabled, ...props.register(props.name, options), className: cx("toggle", {
                            "toggle-sm": props.size === "sm",
                            "toggle-xs": props.size === "xs",
                        }) }), jsx("span", { className: "text-sm text-gray-500 label-text grow pl-2", children: props.label })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const DateInput = (props) => {
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { control: props.control, name: props.name, render: ({ field }) => {
                            return (jsx(DatePicker, { inputClassName: cx("input input-bordered", props.className, {
                                    "input-xs": props.size === "xs",
                                    "input-sm": props.size === "sm",
                                    "input-error": props.error,
                                }), required: props.required, disabled: props.disabled, allowEmpty: props.allowEmpty, placeholder: props.label, value: field.value, onChange: (value) => {
                                    if (props.useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                                    }
                                } }));
                        } }), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const SelectPaginatedFromApiInput = ({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, fieldSetClassName, ...rest }) => (jsx("div", { className: fieldSetClassName, children: jsxs("div", { ...rest, className: "floating-label", children: [jsxs("span", { children: [label, required ? jsx(Required, {}) : null] }), jsx(Controller, { control: control, name: name, rules: { required: required === true }, render: ({ field }) => (jsx(SelectPaginatedFromApi, { inputClassName: cx("w-full mx-0 input input-bordered", className, {
                        "input-xs": size === "xs",
                        "input-sm": size === "sm",
                        "input-error": error,
                    }), required: required, disabled: disabled, placeholder: label, queryKey: queryKey, queryFunction: queryFn, value: field.value, valueFormat: valueFormat, onChange: (model) => {
                        field.onChange(model?.id || null);
                        onChange?.(model || null);
                    } })) }), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }) }));
const DateTimeInput = (props) => {
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { control: props.control, name: props.name, render: ({ field }) => {
                            return (jsx(DateTimePicker, { inputClassName: cx("input input-bordered", props.className, {
                                    "input-xs": props.size === "xs",
                                    "input-sm": props.size === "sm",
                                    "input-error": props.error,
                                }), required: props.required, allowEmpty: props.allowEmpty, placeholder: props.label, from: props.from, disabled: props.disabled, to: props.to, value: field.value ? (props.useDate ? field.value : stringToDate(field.value)) || null : null, onChange: (value) => {
                                    if (props.useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                                    }
                                } }));
                        } }), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: "text-xs my-0.5 text-gray-500", children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const TimeInput = (props) => {
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [!props.disabled && (jsxs("span", { children: [props.label, props.required && jsx(Required, {})] })), jsx(Controller, { render: ({ field }) => (jsx(TimePicker, { value: field.value, onChange: (v) => field.onChange(v), placeholder: props.label, required: props.required, disabled: props.disabled, className: cx("input w-full", props.className, {
                                "input-xs": props.size === "xs",
                                "input-sm": props.size === "sm",
                                "input-error": props.error,
                            }) })), name: props.name, control: props.control })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const NumberInput = ({ options, ...props }) => (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [!props?.disabled && (jsxs("span", { children: [props.label, props?.required && jsx(Required, {})] })), jsx(Controller, { name: props.name, control: props.control, render: ({ field }) => (jsx(NumericFormat, { placeholder: props.label, ...options, disabled: props?.disabled, required: props?.required, value: field.value, className: `${props.size === "sm" ? "input-sm " : ""}w-full input input-bordered focus:outline-blue-400`, onValueChange: (values) => field.onChange(values.floatValue) })) })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
const Label = ({ text, required }) => (jsx("label", { className: "label", children: jsxs("span", { className: "text-sm", children: [text, required && jsx(Required, {})] }) }));
const SelectPaginatedFromApiWithLabel = ({ label, queryFn, queryKey, desc, name, valueFormat, required, disabled, error, className, size, value, onChange, fieldSetClassName, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("div", { ...rest, className: "floating-label", children: [jsxs("span", { children: [label, required ? jsx(Required, {}) : null] }), jsx(SelectPaginatedFromApi, { inputClassName: cx("w-full mx-0 input input-bordered", className, {
                            "input-xs": size === "xs",
                            "input-sm": size === "sm",
                            "input-error": error,
                        }), required: required, disabled: disabled, placeholder: label, queryKey: queryKey, queryFunction: queryFn, value: value, valueFormat: valueFormat, onChange: (model) => onChange?.(model || null) })] }), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const Required = () => {
    return jsx("span", { className: "text-error align-bottom", children: "*" });
};

export { CheckboxInput, DateInput, DatePicker, DateTimeInput, DateTimePicker, GeneralErrors, GeneralErrorsInToast, InputErrors, Label, NumberInput, Required, SelectInput, SelectPaginatedFromApi, SelectPaginatedFromApiInput, SelectPaginatedFromApiWithLabel, TextInput, TextareaInput, TimeInput, TimePicker, addServerErrors, isServerError, mapToDot, useFormSubmit };
//# sourceMappingURL=index.js.map
