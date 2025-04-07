import * as React from "react";
export declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, showOnHover, showOnClick, showOnFocus, popoverWidth, backgroundColor, borderColor, }: {
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    popoverWidth?: string;
    title: (ref: (node: HTMLElement | null) => void, props: Record<string, unknown>) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    borderColor?: `border-${string}`;
    backgroundColor?: `bg-${string}`;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Popover.d.ts.map