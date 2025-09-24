import * as React from "react";
export declare const TOOLTIP_PARALLEL_ID = "parallel-tooltip";
type DialogWithBackProps = {
    onClose?: () => void;
    title?: string;
    className?: string;
    children: React.ReactNode;
};
export declare const ParallelDialog: ({ title, children, onClose, className, ...rest }: DialogWithBackProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ParallelDialog.d.ts.map