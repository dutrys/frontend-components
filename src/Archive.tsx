import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Hotkeys } from "./HotKeys";
import { captureException } from "@sentry/nextjs";
import { GeneralErrorsInToast, isServerError } from "./Form";
import { ParallelDialog } from "./ParallelDialog";

type Include<T, U> = T extends U ? T : never;

export const Archive = <T,>({
  title,
  archive,
  onClose,
  formatErrors,
  translateId,
}: {
  title: string;
  archive: () => Promise<T>;
  onClose?: () => void;
  formatErrors?: (errors: Include<T, { errors: Record<string, string[]> }>) => React.ReactNode;
  translateId?: string;
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
          onClose ? onClose() : router.back();
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
    <ParallelDialog onClose={onClose} title={title}>
      <Hotkeys id="archive" hotKeys={[{ key: "Enter", description: t("archive.yes"), callback: doArchive }]} />
      {errors && formatErrors && <div className="alert alert-error my-4">{formatErrors(errors)}</div>}
      {t("archive.message")}
      <br />
      <br />
      <div className="w-full text-center">
        <div className="mx-auto">
          <button
            onClick={doArchive}
            className="btn btn-error uppercase"
            disabled={isLoading}
            data-testid="button-archive"
          >
            {t("archive.yes")}
          </button>{" "}
          <button
            className="btn uppercase"
            onClick={() => (onClose ? onClose() : router.back())}
            data-testid="button-cancel"
          >
            {t("archive.no")}
          </button>
        </div>
      </div>
    </ParallelDialog>
  );
};

export const ArchiveButton = <T = unknown,>({
  title,
  archive,
  children,
  formatErrors,
}: {
  children: (onClick: () => void) => React.ReactNode;
  title: string;
  archive: () => Promise<T>;
  formatErrors?: (errors: Include<T, { errors: Record<string, string[]> }>) => React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <Archive<T> title={title} archive={archive} onClose={() => setIsOpen(false)} formatErrors={formatErrors} />
      )}
      {children(() => setIsOpen(!isOpen))}
    </>
  );
};
