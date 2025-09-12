import * as React from "react";
export declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, hoverClassName, showOnHover, showOnClick, showOnFocus, popoverWidth, backgroundColor, borderColor, disabled, }: {
    disabled?: boolean;
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    hoverClassName?: string;
    popoverWidth?: string;
    title: (ref: ((node: HTMLElement | null) => void) | null, props: Record<string, unknown>) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    borderColor?: `border-${string}`;
    backgroundColor?: `bg-${string}`;
}) => string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
//# sourceMappingURL=Popover.d.ts.map