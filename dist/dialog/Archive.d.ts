import React from "react";
type Include<T, U> = T extends U ? T : never;
export declare const Archive: <T>({ title, archive, onClose, formatErrors, translateId, }: {
    title: string;
    archive: () => Promise<T>;
    onClose?: () => void;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React.ReactNode;
    translateId?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ArchiveButton: <T = unknown>({ title, archive, children, formatErrors, }: {
    children: (onClick: () => void) => React.ReactNode;
    title: string;
    archive: () => Promise<T>;
    formatErrors?: (errors: Include<T, {
        errors: Record<string, string[]>;
    }>) => React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Archive.d.ts.map