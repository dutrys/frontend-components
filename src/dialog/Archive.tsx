import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Hotkeys } from "../HotKeys";
import { captureException } from "@sentry/nextjs";
import { GeneralErrorsInToast, isServerError } from "../form/UseForm";
import { ParallelDialog } from "./ParallelDialog";
import { createPortal } from "react-dom";

type Include<T, U> = T extends U ? T : never;

export const Archive = <T,>({
  title,
  yes,
  no,
  message,
  archive,
  onClose,
  formatErrors,
  translateId,
  onSuccess,
  children,
  closeHref,
}: {
  yes?: string;
  no?: string;
  message?: string;
  title: string;
  archive: () => Promise<T>;
  onClose?: () => void;
  children?: React.ReactNode;
  formatErrors?: (errors: Include<T, { errors: Record<string, string[]> }>) => React.ReactNode;
  closeHref?: string;
  translateId?: string;
  onSuccess?: () => unknown;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const [errors, setErrors] = useState<Include<T, { errors: Record<string, string[]> }> | null>(null);

  const doArchive = () => {
    setIsLoading(true);
    const promise = new Promise((resolve, reject) => {
      archive()
        .then((response) => {
          if (isServerError(response)) {
            if (formatErrors) {
              setErrors(response as any);
            }
            reject(response);
            return;
          }
          resolve(true);
          onSuccess?.();
          if (onClose) {
            onClose();
          } else {
            router.back();
          }
        })
        .catch((e) => {
          captureException(e);
          reject(undefined);
          throw e;
        })
        .finally(() => setIsLoading(false));
    });

    void toast.promise(promise, {
      loading: t("general.deleting"),
      success: t("general.deleted"),
      error: (response) => {
        if (response) {
          return <GeneralErrorsInToast errors={response.errors} translateId={translateId} className="text-gray-500" />;
        }
        return t("general.error");
      },
    });
  };

  return (
    <ParallelDialog closeHref={closeHref} onClose={onClose} title={title}>
      <Hotkeys id="archive" hotKeys={[{ key: "Enter", description: t("archive.yes"), callback: doArchive }]} />
      {errors && formatErrors && <div className="alert alert-error my-4">{formatErrors(errors)}</div>}
      {message ?? t("archive.message")}
      <br />
      <br />
      {children}
      <div className="w-full text-center">
        <div className="mx-auto">
          <button
            onClick={doArchive}
            className="btn btn-error uppercase"
            disabled={isLoading}
            data-testid="button-archive"
          >
            {yes ?? t("archive.yes")}
          </button>{" "}
          <button
            className="btn uppercase"
            onClick={() => (onClose ? onClose() : router.back())}
            data-testid="button-cancel"
          >
            {no ?? t("archive.no")}
          </button>
        </div>
      </div>
    </ParallelDialog>
  );
};

export const ArchiveButtonWithDialog = <T = unknown,>({
  title,
  archive,
  children,
  formatErrors,
  onSuccess,
}: {
  children: (onClick: () => void, isLoading: boolean) => React.ReactNode;
  title: string;
  archive: () => Promise<T>;
  formatErrors?: (errors: Include<T, { errors: Record<string, string[]> }>) => React.ReactNode;
  onSuccess?: () => unknown;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      {isOpen &&
        createPortal(
          <Archive<T>
            onSuccess={onSuccess}
            title={title}
            archive={async () => {
              setIsLoading(true);
              try {
                return await archive();
              } finally {
                setIsLoading(false);
              }
            }}
            onClose={() => setIsOpen(false)}
            formatErrors={formatErrors}
          />,
          document.body,
        )}
      {children(() => setIsOpen(!isOpen), isLoading)}
    </>
  );
};
