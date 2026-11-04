import React from "react";
type DialogWithBackProps = {
    onClosed?: () => void;
    title?: string;
    className?: string;
    widthClassName?: string;
    children: React.ReactNode;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    dialogButtons?: React.ReactNode;
    returnDefault?: () => unknown;
    buttons?: ((close: () => void) => React.ReactNode) | React.ReactNode;
    index?: number;
    disableBackdrop?: boolean;
};
export declare const Backdrop: ({ children, onClick, className, }: {
    disable?: boolean;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SideDialog: ({ dialogButtons, title, index, disableBackdrop, children, onClosed, className, returnDefault, buttons, widthClassName, ...rest }: DialogWithBackProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SideDialog.d.ts.map