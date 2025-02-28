import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default from 'react';

declare const LoadingComponent: ({ style, className, loadingClassName, size, }: {
    className?: string;
    loadingClassName?: string;
    size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
    style?: React__default.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, showOnHover, showOnClick, showOnFocus, popoverWidth, bgColor, borderColor, }: {
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    popoverWidth?: string;
    title: (ref: (node: HTMLElement | null) => void, props: Record<string, unknown>) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    bgColor?: string;
    borderColor?: string;
}) => react_jsx_runtime.JSX.Element;

export { LoadingComponent, Popover };
