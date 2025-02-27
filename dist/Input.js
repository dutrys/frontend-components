import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller, } from "react-hook-form";
import { DateTimePicker } from "./DateTimePicker";
import { DatePicker } from "./DatePicker";
import { InputErrors } from "./Form";
import { format } from "date-fns";
import { SelectPaginatedFromApi } from "./SelectPaginatedFromApi";
import { stringToDate } from "./utils/datetime";
export const TextInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "floating-label", children: [_jsx("input", { id: props.id, type: props.type || "text", ...props.register(props.name, props.options), required: props.required, disabled: props.disabled, placeholder: props.label, className: `input input-bordered w-full ${props.className || ""} ${props.error ? " input-error" : ""}` }), _jsxs("span", { children: [props.label, props.required ? _jsx(Required, {}) : null] })] }), props.desc && _jsx("div", { className: "text-xs mt-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
export const SelectInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "floating-label", children: [_jsx("select", { id: props.id, disabled: props.disabled, ...props.register(props.name, props.options), className: `select select-bordered w-full ${props.className || ""} ${props.error ? " select-error" : ""}`, children: props.children }), _jsxs("span", { children: [props.label, props.required ? _jsx(Required, {}) : null] })] }), props.desc && _jsx("div", { className: "text-xs mt-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
export const TextareaInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "floating-label", children: [_jsx("textarea", { id: props.id, disabled: props.disabled, ...props.register(props.name, props.options), className: `textarea textarea-bordered w-full ${props.className || ""} ${props.error ? " textarea-error" : ""}` }), _jsxs("span", { children: [props.label, props.required ? _jsx(Required, {}) : null] })] }), props.desc && _jsx("div", { className: "text-xs mt-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const Required = () => {
    return _jsx("span", { className: "text-error align-bottom", children: "*" });
};
export const CheckboxInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { children: [_jsx("input", { id: props.id, type: "checkbox", disabled: props.disabled, ...props.register(props.name, props.options), className: "toggle" }), _jsx("span", { className: "text-sm text-gray-500 label-text grow pl-2", children: props.label })] }), props.desc && _jsx("div", { className: "text-xs mt-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
export const DateInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "floating-label", children: [_jsx(Controller, { control: props.control, name: props.name, render: ({ field }) => {
                            return (_jsx(DatePicker, { inputClassName: `input input-bordered ${props.className || ""} ${props.error ? " input-error" : ""}`, allowEmpty: props.allowEmpty, placeholder: props.label, value: field.value, onChange: (value) => {
                                    if (props.useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                                    }
                                } }));
                        } }), _jsxs("span", { children: [props.label, props.required ? _jsx(Required, {}) : null] })] }), props.desc && _jsx("div", { className: "text-xs mt-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
export const SelectPaginatedFromApiInput = ({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, onChange, ...rest }) => (_jsxs("div", { ...rest, className: "floating-label", children: [_jsxs("span", { children: [label, required ? _jsx(Required, {}) : null] }), _jsx(Controller, { control: control, name: name, rules: { required: required === true }, render: ({ field }) => (_jsx(SelectPaginatedFromApi, { required: required, disabled: disabled, placeholder: label, queryKey: queryKey, queryFunction: queryFn, value: field.value, valueFormat: valueFormat, onChange: (model) => {
                    field.onChange(model?.id || null);
                    onChange?.(model || null);
                } })) }), _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
export const DateTimeInput = (props) => {
    return (_jsxs("div", { children: [_jsxs("label", { className: "floating-label", children: [_jsx(Controller, { control: props.control, name: props.name, render: ({ field }) => {
                            return (_jsx(DateTimePicker, { inputClassName: `input input-bordered ${props.className || ""} ${props.error ? " input-error" : ""}`, required: props.required, allowEmpty: props.allowEmpty, placeholder: props.label, from: props.from, disabled: props.disabled, to: props.to, value: field.value ? (props.useDate ? field.value : stringToDate(field.value)) || null : null, onChange: (value) => {
                                    if (props.useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                                    }
                                } }));
                        } }), _jsxs("span", { children: [props.label, props.required ? _jsx(Required, {}) : null] })] }), props.desc && _jsx("div", { className: "text-xs my-0.5 text-gray-500", children: props.desc }), props.error && _jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
//# sourceMappingURL=Input.js.map