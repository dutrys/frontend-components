"use client";
import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
import { useRouter } from "next/navigation";
export const GeneralErrorsInToast = ({ errors, translateId, except = [], className = "", }) => {
    const t = useTranslations();
    return (_jsx("ul", { className: "list list-disc pl-4", children: Object.keys(errors)
            .filter((key) => !except.includes(key))
            .map((key) => {
            const error = errors[key];
            return (_jsx(React.Fragment, { children: error.map((error) => (_jsxs("li", { children: [translateId && t.has(`${translateId}.${key}`) && (_jsxs("span", { className: className || "text-red-800", children: [t(`${translateId}.${key}`), ": "] })), _jsx("span", { className: className || "text-red-500", children: error })] }, error))) }, key));
        }) }));
};
const isError = (error) => typeof error === "object" && typeof error.type === "string" && typeof error.message === "string";
export const mapToDot = (errors) => {
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
export const GeneralErrors = (props) => _jsx(GeneralErrorsInToast, { ...props, errors: mapToDot(props.errors) });
export const InputErrors = ({ errors, className = "text-xs text-primary-700", }) => {
    if (!errors) {
        return null;
    }
    const messages = Array.from(new Set(formatError(errors)));
    if (messages.length === 1) {
        return (_jsx("span", { className: className, children: messages[0] }, messages[0]));
    }
    return (_jsx("ul", { className: "pl-4 list-disc", children: messages.map((message) => (_jsx("li", { className: className, children: message }, message))) }));
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
export const isServerError = (error) => typeof error === "object" && typeof error.errors === "object";
export const useFormSubmit = (doSubmitCallback, formOptions = {}) => {
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
                            return (_jsxs(_Fragment, { children: [t("general.validateError"), ":", " ", _jsx(GeneralErrors, { className: "text-gray-500", translateId: options.translateErrors, errors: formProps.formState.errors })] }));
                        }
                        return t("general.error");
                    },
                }, { id: "form-submit" });
            }
            return promise;
        }),
    };
};
export const addServerErrors = (errors, setError) => Object.entries(errors).forEach(([key, value]) => {
    const array = Array.isArray(value) ? value : [errors];
    setError(key, { type: "server", message: array?.join(", ") || "" });
});
//# sourceMappingURL=Form.js.map