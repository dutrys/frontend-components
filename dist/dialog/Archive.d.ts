import React from "react";
type Include<T, U> = T extends U ? T : never;
export declare const Archive: <T>({ title, archive, onClose, formatErrors, translateId, onSuccess, }: {
    title: string;
    archive: () => Promise<T>;
    onClose?: () => void;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React.ReactNode;
    translateId?: string;
    onSuccess?: () => unknown;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ArchiveButton: <T = unknown>({ title, archive, children, formatErrors, onSuccess, }: {
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