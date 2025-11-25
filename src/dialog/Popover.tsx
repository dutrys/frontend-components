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
  shift,
  useClick,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import cx from "classnames";
import { Placement } from "@floating-ui/utils";

export const Popover = ({
  title,
  children,
  popoverClassName,
  onShow,
  open: openProp,
  showOnHover = true,
  showOnClick = false,
  showOnFocus = false,
  backgroundColor = "bg-slate-800",
  borderColor = "border-slate-600",
  disabled,
  placement,
  arrowSize,
}: {
  disabled?: boolean;
  open?: boolean;
  showOnHover?: boolean;
  showOnClick?: boolean;
  showOnFocus?: boolean;
  popoverClassName?: string;
  arrowSize?: { width: number; height: number };
  title: (
    ref: ((node: HTMLElement | null) => void) | null,
    props: Record<string, unknown>,
    isOpen: boolean,
  ) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  onShow?: (show: boolean) => void;
  borderColor?: `border-${string}`;
  backgroundColor?: `bg-${string}`;
  placement?: Placement;
}) => {
  const [isOpen, setIsOpen] = useState(openProp || false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating<HTMLElement>({
    placement: placement ?? "bottom-start",
    open: isOpen,
    onOpenChange: (open) => {
      onShow?.(open);
      setIsOpen(open);
    },
    whileElementsMounted: autoUpdate,
    middleware: [offset(10), flip({ padding: 10 }), shift({ padding: 10 }), arrow({ element: arrowRef, padding: 10 })],
  });

  useEffect(() => {
    if (typeof openProp !== "undefined") {
      setIsOpen(openProp);
    }
  }, [openProp, setIsOpen]);

  const focus = useFocus(context, { enabled: showOnFocus });
  const hover = useHover(context, { enabled: showOnHover, handleClose: safePolygon() });
  const click = useClick(context, { enabled: showOnClick, keyboardHandlers: false });
  const dismiss = useDismiss(context, { escapeKey: false, bubbles: true, outsidePress: true });

  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);

  if (disabled) {
    return title(null, {}, false);
  }

  return (
    <>
      {title(refs.setReference, getReferenceProps(), isOpen)}

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 1100 }}
            {...getFloatingProps()}
            className={cx(
              "popover border rounded-box shadow-lg shadow-base-100 border-1",
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
              width={arrowSize?.width}
              height={arrowSize?.height}
            />
            {children(() => context.onOpenChange(false))}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};
