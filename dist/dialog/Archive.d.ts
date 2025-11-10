import React from "react";
type Include<T, U> = T extends U ? T : never;
export declare const Archive: <T>({ title, yes, no, message, archive, onClose, formatErrors, translateId, onSuccess, children, closeHref, }: {
    yes?: string;
    no?: string;
    message?: string;
    title: string;
    archive: () => Promise<T>;
    onClose?: () => void;
    children?: React.ReactNode;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React.ReactNode;
    closeHref?: string;
    translateId?: string;
    onSuccess?: () => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ArchiveButtonWithDialog: <T = unknown>({ title, archive, children, formatErrors, onSuccess, }: {
    children: (onClick: () => void, isLoading: boolean) => React.ReactNode;
    title: string;
    archive: () => Promise<T>;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React.ReactNode;
    onSuccess?: () => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Archive.d.ts.map