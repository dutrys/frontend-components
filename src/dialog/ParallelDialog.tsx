import * as React from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { addLocale } from "../pagination/Link";
import cx from "classnames";

export const TOOLTIP_PARALLEL_ID = "parallel-tooltip";

type DialogWithBackProps = {
  onClosed?: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  dialogButtons?: React.ReactNode;
  returnDefault?: string;
};

export const ParallelDialog = ({
  dialogButtons,
  title,
  children,
  onClosed,
  className,
  returnDefault,
  ...rest
}: DialogWithBackProps) => {
  const router = useRouter();

  const closeModal = () => {
    onClosed?.();

    if (history.length > 2) {
      router.back();
      return;
    }

    if (returnDefault) {
      router.replace(addLocale(returnDefault));
    }
  };

  return (
    <dialog
      data-testid="modal-dialog"
      open
      className="modal modal-bottom modal-middle overflow-y-auto z-1100"
      {...rest}
    >
      <div
        className={cx("modal-box max-h-none overflow-y-visible rounded-field p-4 my-4 relative", className)}
        onKeyDown={(e) => e.key === "Escape" && closeModal()}
      >
        <Tooltip id={TOOLTIP_PARALLEL_ID} place="top" />
        {title ? (
          <div className="flex gap-2 mb-4">
            <h3 className="grow shrink truncate font-bold text-lg mt-0.5" tabIndex={-1}>
              {title}
            </h3>
            {dialogButtons}
            <button type="button" className="btn btn-circle btn-sm" onClick={closeModal}>
              <XMarkIcon className="size-4" />
            </button>
          </div>
        ) : (
          <div className="absolute right-4 top-4 flex gap-2 z-1101">
            {dialogButtons}
            <a href="#" className="btn btn-circle btn-sm" onClick={closeModal}>
              <XMarkIcon className="size-4" />
            </a>
          </div>
        )}
        {children}
      </div>
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          closeModal();
        }}
        className="modal-backdrop"
      >
        <button>close</button>
      </form>
    </dialog>
  );
};

export const ParallelDialogButtons = ({ children }: { children: React.ReactNode }) => <div className="p-4 -mx-4 mt-4 -mb-4 bg-base-200 rounded-b-field flex gap-4 justify-end">{children}</div>;
