import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import cx from "classnames";
import { motion } from "motion/react";
import { TOOLTIP_PARALLEL_ID } from "./ParallelDialog";

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

export const Backdrop = ({
  children,
  onClick,
  className = "z-1099",
}: {
  disable?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={`fixed inset-0 bg-black/50 bg-opacity-25 ${className}`}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick?.();
    }}
  >
    {children}
  </div>
);

export const SideDialog = ({
  dialogButtons,
  title,
  index = 0,
  disableBackdrop,
  children,
  onClosed,
  className,
  returnDefault,
  buttons,
  widthClassName = "",
  ...rest
}: DialogWithBackProps) => {
  const closeModal = () => {
    onClosed?.();
    if (typeof returnDefault === "function") {
      returnDefault();
    } else {
      if (history.length > 3) {
        history.back();
      }
    }
  };

  return (
    <>
      {!disableBackdrop && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 right-0 h-full w-full z-1002"
        >
          <Backdrop className="z-1001" onClick={closeModal} />
        </motion.div>
      )}
      <motion.div
        key={"modal-dialog-" + index}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", mass: 0.4, stiffness: 250, damping: 28 }}
        className="fixed top-0 right-0 h-full w-full z-1002"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        }}
      >
        <dialog
          data-index={index}
          onClick={closeModal}
          data-testid="side-dialog"
          style={{ left: "unset", right: 0, zIndex: 1099 + index, paddingLeft: index * Math.max(50 - index, 10) }}
          className={cx("h-screen bg-transparent", widthClassName)}
          open
          {...rest}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={cx("border-l border-gray-400 drop-shadow-xl relative w-full h-full", className, {
              "bg-base-200": !className?.includes("bg-"),
            })}
            onKeyDown={(e) => e.key === "Escape" && closeModal()}
          >
            <Tooltip id={TOOLTIP_PARALLEL_ID} place="top" />
            <div className="flex flex-col h-full overflow-y-auto">
              {title ? (
                <div className="flex gap-2 m-4">
                  <h3 className="grow shrink truncate font-bold text-lg mt-0.5" tabIndex={-1}>
                    {title}
                  </h3>
                  {dialogButtons}
                  <button type="button" className="btn btn-neutral btn-circle btn-sm" onClick={closeModal}>
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="absolute right-4 top-4 flex gap-2 z-1101">
                  {dialogButtons}
                  <button type="button" className="btn btn-neutral btn-circle btn-sm" onClick={closeModal}>
                    <XMarkIcon className="size-4" />
                  </button>
                </div>
              )}
              {children}
              {buttons && (
                <div className="sticky z-10 bottom-0 px-4 py-4 flex gap-2 justify-center">
                  {typeof buttons === "function" ? buttons(closeModal) : buttons}
                </div>
              )}
            </div>
          </div>
        </dialog>
      </motion.div>
    </>
  );
};
