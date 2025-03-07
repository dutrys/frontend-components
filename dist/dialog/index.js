import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect, createContext, useContext } from 'react';
import { useFloating, offset, flip, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow } from '@floating-ui/react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { captureException } from '@sentry/nextjs';
import 'react-hook-form';

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

const TOOLTIP_PARALLEL_ID = "paralel-tooltip";
const DialogWithBack = ({ title, children, onClose, className, ...rest }) => {
    let [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const closeModal = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
            return;
        }
        if (history.length > 2) {
            router.back();
            return;
        }
        // Match /[lang]/bucket/[id]/[module]
        const matchBucket = pathname.match(/^(\/(en|lt)\/buckets\/\d+\/[\w-]+)\/.*/);
        if (matchBucket && matchBucket[1]) {
            router.push(`${matchBucket[1]}?${searchParams.toString()}`);
            return;
        }
        // Match /[lang]/admin/[module]
        const matchAdmin = pathname.match(/^(\/(en|lt)\/admin\/[\w-]+)\/.*/);
        if (matchAdmin && matchAdmin[1]) {
            router.push(`${matchAdmin[1]}?${searchParams.toString()}`);
            return;
        }
        if (/\/(en|lt)\/buckets\/\d+\/[\w-]+/.test(pathname) || /\/(en|lt)\/admin\/[\w-]+/.test(pathname)) {
            router.push(pathname);
            return;
        }
    };
    return (jsxs("dialog", { onKeyDown: (e) => e.key === "Escape" && closeModal(), className: `modal overflow-y-auto ${isOpen ? "modal-open" : ""}`, style: { zIndex: 1100 }, "data-testid": "modal-dialog", ...rest, children: [jsxs("div", { className: `modal-box my-4 overflow-y-visible max-h-none ${className}`, children: [title && (jsx("h3", { className: "font-bold text-lg", "data-testid": "modal-dialog-title", children: title })), children] }), jsx("form", { method: "dialog", className: "modal-backdrop", children: jsx("button", { onClick: closeModal, children: "close" }) }), jsx(Tooltip, { id: TOOLTIP_PARALLEL_ID, place: "top" })] }));
};

const HotkeysContext = createContext({
    addHotKey: () => { },
    removeHotKey: () => { },
    getHotKeys: () => ({}),
});

const Hotkeys = ({ hotKeys, id }) => {
    const mapping = useContext(HotkeysContext);
    useEffect(() => {
        const handleKeyPress = (e) => {
            for (let i = 0; i < hotKeys.length; i++) {
                const metaKey = hotKeys[i].metaKey ?? false;
                const ctrlKey = hotKeys[i].ctrlKey ?? false;
                const altKey = hotKeys[i].altKey ?? false;
                if (hotKeys[i].key === e.key && metaKey === e.metaKey && ctrlKey === e.ctrlKey && altKey === e.altKey) {
                    toast.custom(jsxs("div", { className: "bg-black/50 text-white rounded-md py-2 px-4 text-sm", children: [metaKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "\u2318" }), " +"] })), ctrlKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "ctrl" }), " +"] })), altKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "alt" }), " +"] })), jsx("kbd", { className: "kbd text-gray-700 kbd-sm mr-2", children: hotKeys[i].key }, "key"), hotKeys[i].description] }), {
                        duration: 50,
                        position: "bottom-center",
                    });
                    hotKeys[i].callback();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            }
        };
        mapping.addHotKey(id, hotKeys);
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            mapping.removeHotKey(id);
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [mapping, hotKeys, id]);
    return null;
};

const GeneralErrorsInToast = ({ errors, translateId, except = [], className = "", }) => {
    const t = useTranslations();
    return (jsx("ul", { className: "list list-disc pl-4", children: Object.keys(errors)
            .filter((key) => !except.includes(key))
            .map((key) => {
            const error = errors[key];
            return (jsx(React.Fragment, { children: error.map((error) => (jsxs("li", { children: [translateId && t.has(`${translateId}.${key}`) && (jsxs("span", { className: className || "text-red-800", children: [t(`${translateId}.${key}`), ": "] })), jsx("span", { className: className || "text-red-500", children: error })] }, error))) }, key));
        }) }));
};
const isServerError = (error) => typeof error === "object" && typeof error.errors === "object";

const Archive = ({ title, archive, onClose, formatErrors, translateId, }) => {
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
                    return jsx(GeneralErrorsInToast, { errors: response.errors, translateId: translateId, className: "text-gray-500" });
                }
                return t("general.error");
            },
        });
    };
    return (jsxs(DialogWithBack, { onClose: onClose, title: title, children: [jsx(Hotkeys, { id: "archive", hotKeys: [{ key: "Enter", description: t("archive.yes"), callback: doArchive }] }), errors && formatErrors && jsx("div", { className: "alert alert-error my-4", children: formatErrors(errors) }), t("archive.message"), jsx("br", {}), jsx("br", {}), jsx("div", { className: "w-full text-center", children: jsxs("div", { className: "mx-auto", children: [jsx("button", { onClick: doArchive, className: "btn btn-error uppercase", disabled: isLoading, "data-testid": "button-archive", children: t("archive.yes") }), " ", jsx("button", { className: "btn uppercase", onClick: () => (onClose ? onClose() : router.back()), "data-testid": "button-cancel", children: t("archive.no") })] }) })] }));
};
const ArchiveButton = ({ title, archive, children, formatErrors, }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (jsxs(Fragment, { children: [isOpen && (jsx(Archive, { title: title, archive: archive, onClose: () => setIsOpen(false), formatErrors: formatErrors })), children(() => setIsOpen(!isOpen))] }));
};

export { Archive, ArchiveButton, DialogWithBack, Popover, TOOLTIP_PARALLEL_ID };
//# sourceMappingURL=index.js.map
