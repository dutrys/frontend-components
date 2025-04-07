import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { useFloating, offset, flip, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow } from '@floating-ui/react';
import cx from 'classnames';

const LoadingComponent = ({ style, className, loadingClassName, size, }) => (jsx("div", { className: `flex justify-center ${className}`, style: style, children: jsx("span", { className: `${loadingClassName || "text-primary"} loading loading-spinner ${size}` }) }));

const Popover = ({ title, children, popoverClassName = "py-1", onShow, open: openProp, showOnHover = true, showOnClick = false, showOnFocus = false, popoverWidth, backgroundColor = "bg-slate-800", borderColor = "border-slate-600", }) => {
    const [isOpen, setIsOpen] = useState(openProp || false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        open: isOpen,
        onOpenChange: (open) => {
            onShow?.(open);
            setIsOpen(open);
        },
        whileElementsMounted: autoUpdate,
        middleware: [offset(10), flip({ padding: 10 }), arrow({ element: arrowRef })],
    });
    useEffect(() => {
        if (typeof openProp !== "undefined") {
            setIsOpen(openProp);
        }
    }, [openProp, setIsOpen]);
    const focus = useFocus(context, { enabled: showOnFocus });
    const hover = useHover(context, { enabled: showOnHover, handleClose: safePolygon() });
    const click = useClick(context, { enabled: showOnClick, keyboardHandlers: false });
    const dismiss = useDismiss(context, { escapeKey: false, bubbles: true });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);
    return (jsxs(Fragment, { children: [title(refs.setReference, getReferenceProps()), isOpen && (jsx(FloatingPortal, { children: jsxs("div", { ref: refs.setFloating, style: { ...floatingStyles, zIndex: 1100 }, ...getFloatingProps(), className: cx("border rounded-sm shadow-lg shadow-base-100 border-1", popoverClassName, backgroundColor, borderColor), children: [jsx(FloatingArrow, { strokeWidth: 1, fill: `var(--color-${backgroundColor.replace("bg-", "")})`, stroke: `var(--color-${borderColor.replace("border-", "")})`, context: context, ref: arrowRef }), jsx("div", { className: popoverWidth, children: children(() => setIsOpen(false)) })] }) }))] }));
};

export { LoadingComponent, Popover };
//# sourceMappingURL=index.js.map
