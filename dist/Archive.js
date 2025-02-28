"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Hotkeys } from "./HotKeys";
import { captureException } from "@sentry/nextjs";
import { GeneralErrorsInToast, isServerError } from "./Form";
import { ParallelDialog } from "./ParallelDialog";
export const Archive = ({ title, archive, onClose, formatErrors, translateId, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations();
    const [errors, setErrors] = useState(null);
    const doArchive = () => {
        setIsLoading(true);
        const promise = new Promise((resolve, reject) => {
            archive()
                .then((response) => {
                if (isServerError(response)) {
                    if (formatErrors) {
                        setErrors(response);
                    }
                    reject(response);
                    return;
                }
                resolve(true);
                onClose ? onClose() : router.back();
            })
                .catch((e) => {
                captureException(e);
                reject(undefined);
                throw e;
            })
                .finally(() => setIsLoading(false));
        });
        void toast.promise(promise, {
            loading: t("general.deleting"),
            success: t("general.deleted"),
            error: (response) => {
                if (response) {
                    return _jsx(GeneralErrorsInToast, { errors: response.errors, translateId: translateId, className: "text-gray-500" });
                }
                return t("general.error");
            },
        });
    };
    return (_jsxs(ParallelDialog, { onClose: onClose, title: title, children: [_jsx(Hotkeys, { id: "archive", hotKeys: [{ key: "Enter", description: t("archive.yes"), callback: doArchive }] }), errors && formatErrors && _jsx("div", { className: "alert alert-error my-4", children: formatErrors(errors) }), t("archive.message"), _jsx("br", {}), _jsx("br", {}), _jsx("div", { className: "w-full text-center", children: _jsxs("div", { className: "mx-auto", children: [_jsx("button", { onClick: doArchive, className: "btn btn-error uppercase", disabled: isLoading, "data-testid": "button-archive", children: t("archive.yes") }), " ", _jsx("button", { className: "btn uppercase", onClick: () => (onClose ? onClose() : router.back()), "data-testid": "button-cancel", children: t("archive.no") })] }) })] }));
};
export const ArchiveButton = ({ title, archive, children, formatErrors, }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx(Archive, { title: title, archive: archive, onClose: () => setIsOpen(false), formatErrors: formatErrors })), children(() => setIsOpen(!isOpen))] }));
};
//# sourceMappingURL=Archive.js.map