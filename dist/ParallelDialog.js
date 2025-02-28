"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
export const TOOLTIP_PARALLEL_ID = "paralel-tooltip";
export const ParallelDialog = ({ title, children, onClose, className, ...rest }) => {
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
    return (_jsxs("dialog", { onKeyDown: (e) => e.key === "Escape" && closeModal(), className: `modal overflow-y-auto ${isOpen ? "modal-open" : ""}`, style: { zIndex: 1100 }, "data-testid": "modal-dialog", ...rest, children: [_jsxs("div", { className: `modal-box my-4 overflow-y-visible max-h-none ${className}`, children: [title && (_jsx("h3", { className: "font-bold text-lg", "data-testid": "modal-dialog-title", children: title })), children] }), _jsx("form", { method: "dialog", className: "modal-backdrop", children: _jsx("button", { onClick: closeModal, children: "close" }) }), _jsx(Tooltip, { id: TOOLTIP_PARALLEL_ID, place: "top" })] }));
};
//# sourceMappingURL=ParallelDialog.js.map