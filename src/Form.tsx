import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FieldPath, FieldValues, useForm, UseFormProps, UseFormSetError } from "react-hook-form";
import { captureException } from "@sentry/nextjs";

export const InputErrors = ({
  errors,
  className = "text-xs text-primary-700",
}: {
  className?: string;
  errors: any;
}) => {
  if (!errors) {
    return null;
  }

  const messages = Array.from(new Set(formatError(errors)));

  if (messages.length === 1) {
    return (
      <span className={className} key={messages[0]}>
        {messages[0]}
      </span>
    );
  }

  return (
    <ul className="pl-4 list-disc">
      {messages.map((message) => (
        <li className={className} key={message}>
          {message}
        </li>
      ))}
    </ul>
  );
};

function formatError(errors: any): string[] {
  const formattedErrors: string[] = [];

  if (typeof errors === "object") {
    if (typeof errors.message === "string") {
      errors.message.split(", ").forEach((s: string) => {
        formattedErrors.push(s);
      });
    }
    if (typeof errors.ref === "undefined") {
      Object.keys(errors).forEach((key) => formattedErrors.push(...formatError(errors[key])));
    }
  }

  if (Array.isArray(errors)) {
    errors.forEach((error) => formattedErrors.push(...formatError(error)));
  }

  return formattedErrors;
}

export type ServerError<T> = { errors: Record<keyof T, string[]> };

export const isServerError = (error: any): error is ServerError<any> => {
  return typeof error === "object" && typeof error.errors === "object";
};

export function useFormSubmit<T extends FieldValues, R = unknown>(
  doSubmitCallback: (data: T) => Promise<ServerError<T> | R>,
  formOptions: UseFormProps<T>,
  options: {
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError<T>) => void;
  } = {},
) {
  const t = useTranslations();
  const router = useRouter();
  const formProps = useForm<T>(formOptions);
  const [isLoading, setIsLoading] = useState(false);
  return {
    ...formProps,
    handleSubmit: () =>
      formProps.handleSubmit((values) => {
        setIsLoading(true);
        const toastId =
          options.reportProgress !== false ? toast.loading(t("general.loading"), { duration: 10000 }) : "";
        doSubmitCallback(values)
          .then((data) => {
            if (isServerError(data)) {
              if (options.reportProgress !== false) {
                toast.error(t("general.validateError"), { id: toastId, duration: 1000 });
              }
              if (typeof options.onError === "function") {
                options.onError(data);
              }
              return addServerErrors(data.errors, formProps.setError);
            }
            if (typeof options.onSuccess === "function") {
              options.onSuccess(data);
            }
            if (options.returnBack !== false) {
              router.back();
            }
            if (options.reportProgress !== false) {
              toast.success(t("general.successSave"), { id: toastId, duration: 1000 });
            }
          })
          .catch((e) => {
            toast.error(t("general.error"), { id: toastId, duration: 1000 });
            captureException(e);
            throw e;
          })
          .finally(() => setIsLoading(false));
      }),
    isLoading,
    setIsLoading,
  };
}

export function addServerErrors<T extends FieldValues>(
  errors: { [P in keyof T]?: string[] },
  setError: UseFormSetError<T>,
) {
  return Object.entries(errors).forEach(([key, value]) => {
    const array = Array.isArray(value) ? value : [errors];
    setError(key as FieldPath<T>, { type: "server", message: array?.join(", ") || "" });
  });
}
