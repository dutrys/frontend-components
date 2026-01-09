import * as React from "react";
export declare const TOOLTIP_PARALLEL_ID = "parallel-tooltip";
type DialogWithBackProps = {
    onClosed?: () => void;
    title?: string;
    className?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    dialogButtons?: React.ReactNode;
    returnDefault?: string;
};
export declare const ParallelDialog: ({ dialogButtons, title, children, onClosed, className, returnDefault, ...rest }: DialogWithBackProps) => import("react/jsx-runtime").JSX.Element;
export declare const ParallelDialogButtons: ({ children }: {
    children: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ParallelDialog.d.ts.map