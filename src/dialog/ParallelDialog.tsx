import * as React from "react";
import { useRouter } from "next/navigation";
import cx from "classnames";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";
import { FocusTrap } from "@headlessui/react";
import { addLocale } from "@/pagination/Link";
import { ElementRef, useEffect, useRef } from "react";

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
  const t = useTranslations();

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
    <dialog data-testid="modal-dialog" open className="modal z-1100" {...rest}>
      <FocusTrap
        onKeyDown={(e) => e.key === "Escape" && closeModal()}
        autoFocus={false}
        className={cx("modal-box rounded-field p-4 relative", className)}
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
          <div className="absolute right-4 top-4 flex gap-2">
            {dialogButtons}
            <a
              href="#"
              className="btn btn-circle btn-sm"
              data-tooltip-id={TOOLTIP_PARALLEL_ID}
              data-tooltip-content={t("general.close")}
              onClick={closeModal}
            >
              <XMarkIcon className="size-4" />
            </a>
          </div>
        )}
        {children}
      </FocusTrap>
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
