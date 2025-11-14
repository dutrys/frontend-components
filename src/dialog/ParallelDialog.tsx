import * as React from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { LoadingComponent } from "@/Loading";
import cx from "classnames";
import { addLocale } from "@/pagination/Link";

export const TOOLTIP_PARALLEL_ID = "parallel-tooltip";

type DialogWithBackProps = {
  onClose?: () => void;
  title?: string;
  className?: string;
  children: React.ReactNode;
  closeHref?: string;
};

export const ParallelDialog = ({ closeHref, title, children, onClose, className, ...rest }: DialogWithBackProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const closeModal = () => {
    setIsOpen(false);

    if (onClose) {
      onClose();
      return;
    }

    if (closeHref) {
      if (closeHref.includes("?")) {
        router.push(addLocale(closeHref));
      } else {
        router.push(addLocale(closeHref) + "?" + searchParams.toString());
      }
      return;
    }

    if (history.length > 2) {
      router.back();
      return;
    }

    // Match /[lang]/bucket/[id]/[module]
    const matchBucket = pathname.match(/^(\/(en|lt)\/buckets\/\d+\/[\w-]+)\/.*/);
    if (matchBucket && matchBucket[1]) {
      router.push(`${matchBucket[1]}?${searchParams.toString()}`);
      return;
    }

    // Match /[lang]/admin/[module]
    const matchAdmin = pathname.match(/^(\/(en|lt)\/admin\/[\w-]+)\/.*/);
    if (matchAdmin && matchAdmin[1]) {
      router.push(`${matchAdmin[1]}?${searchParams.toString()}`);
      return;
    }

    if (/\/(en|lt)\/buckets\/\d+\/[\w-]+/.test(pathname) || /\/(en|lt)\/admin\/[\w-]+/.test(pathname)) {
      router.push(pathname);
      return;
    }
  };
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative z-[1100]">
        <div className="fixed inset-0 bg-gray-500/50 backdrop-blur-xs bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <div
              className={cx(
                "w-full space-y-4 border border-base-content/30 bg-base-100 p-6 relative rounded-lg",
                className,
                {
                  "sm:w-lg": !className?.includes("sm:w-"),
                },
              )}
            >
              {title && <div className="text-lg font-bold">{title}</div>}
              <LoadingComponent />
            </div>
            <Tooltip id={TOOLTIP_PARALLEL_ID} place="top" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog
        onKeyDown={(e) => e.key === "Escape" && closeModal()}
        className={`relative z-[1100]`}
        data-testid="modal-dialog"
        onClose={closeModal}
        open={isOpen}
        {...rest}
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500/50 backdrop-blur-xs bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 w-screen overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel
              className={cx(
                "w-full space-y-4 border border-base-content/30 bg-base-100 p-6 relative rounded-lg",
                className,
                {
                  "sm:w-lg": !className?.includes("sm:w-"),
                },
              )}
            >
              {title && <DialogTitle className="text-lg font-bold">{title}</DialogTitle>}
              {children}
            </DialogPanel>
            <Tooltip id={TOOLTIP_PARALLEL_ID} place="top" />
          </div>
        </div>
      </Dialog>
    </>
  );
};
