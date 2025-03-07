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
  bgColor = "#1e293b",
  borderColor = "#1e293b",
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
  bgColor?: string;
  borderColor?: string;
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
            style={{ ...floatingStyles, zIndex: 1100, borderColor, backgroundColor: bgColor }}
            {...getFloatingProps()}
            className={`${popoverClassName} border rounded-sm shadow-lg shadow-gray-400`}
          >
            <FloatingArrow strokeWidth={1} fill={bgColor} stroke={borderColor} context={context} ref={arrowRef} />
            <div className={popoverWidth}>{children(() => setIsOpen(false))}</div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
