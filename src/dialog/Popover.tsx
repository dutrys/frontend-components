import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  safePolygon,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import cx from "classnames";

export const Popover = ({
  title,
  children,
  popoverClassName = "py-1",
  onShow,
  open: openProp,
  showOnHover = true,
  showOnClick = false,
  showOnFocus = false,
  popoverWidth,
  backgroundColor = "bg-slate-800",
  borderColor = "border-slate-600",
}: {
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
}) => {
  const [isOpen, setIsOpen] = useState(openProp || false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
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

  return (
    <>
      {title(refs.setReference, getReferenceProps())}

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 1100 }}
            {...getFloatingProps()}
            className={cx(
              "border rounded-sm shadow-lg shadow-base-100 border-1",
              popoverClassName,
              backgroundColor,
              borderColor,
            )}
          >
            <FloatingArrow
              strokeWidth={1}
              fill={`var(--color-${backgroundColor.replace("bg-", "")})`}
              stroke={`var(--color-${borderColor.replace("border-", "")})`}
              context={context}
              ref={arrowRef}
            />
            <div className={popoverWidth}>{children(() => setIsOpen(false))}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
