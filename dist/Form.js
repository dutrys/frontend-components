import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
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
function formatError(errors) {
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
}
export const isServerError = (error) => {
    return typeof error === "object" && typeof error.errors === "object";
};
export function useFormSubmit(doSubmitCallback, formOptions, options = {}) {
    const t = useTranslations();
    const router = useRouter();
    const formProps = useForm(formOptions);
    const [isLoading, setIsLoading] = useState(false);
    return {
        ...formProps,
        handleSubmit: () => formProps.handleSubmit((values) => {
            setIsLoading(true);
            const toastId = options.reportProgress !== false ? toast.loading(t("general.loading"), { duration: 10000 }) : "";
            doSubmitCallback(values)
                .then((data) => {
                if (isServerError(data)) {
                    if (options.reportProgress !== false) {
                        toast.error(t("general.validateError"), { id: toastId, duration: 1000 });
                    }
                    if (typeof options.onError === "function") {
                        options.onError(data);
                    }
                    return addServerErrors(data.errors, formProps.setError);
                }
                if (typeof options.onSuccess === "function") {
                    options.onSuccess(data);
                }
                if (options.returnBack !== false) {
                    router.back();
                }
                if (options.reportProgress !== false) {
                    toast.success(t("general.successSave"), { id: toastId, duration: 1000 });
                }
            })
                .catch((e) => {
                toast.error(t("general.error"), { id: toastId, duration: 1000 });
                captureException(e);
                throw e;
            })
                .finally(() => setIsLoading(false));
        }),
        isLoading,
        setIsLoading,
    };
}
export function addServerErrors(errors, setError) {
    return Object.entries(errors).forEach(([key, value]) => {
        const array = Array.isArray(value) ? value : [errors];
        setError(key, { type: "server", message: array?.join(", ") || "" });
    });
}
//# sourceMappingURL=Form.js.map