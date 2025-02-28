import React from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { FieldErrors, FieldPath, FieldValues, useForm, UseFormProps, UseFormSetError } from "react-hook-form";
import { captureException } from "@sentry/nextjs";
import { useRouter } from "next/navigation";

export const GeneralErrorsInToast = <T extends Record<string, any>>({
  errors,
  translateId,
  except = [],
  className = "",
}: {
  except?: (keyof T)[];
  translateId?: string;
  errors: Record<string, string[]>;
  className?: string;
}) => {
  const t = useTranslations();
  return (
    <ul className="list list-disc pl-4">
      {Object.keys(errors)
        .filter((key) => !except.includes(key))
        .map((key) => {
          const error = errors[key];
          return (
            <React.Fragment key={key}>
              {error.map((error) => (
                <li key={error}>
                  {translateId && t.has(`${translateId}.${key}`) && (
                    <span className={className || "text-red-800"}>{t(`${translateId}.${key}`)}: </span>
                  )}
                  <span className={className || "text-red-500"}>{error}</span>
                </li>
              ))}
            </React.Fragment>
          );
        })}
    </ul>
  );
};

const isError = (error: any): error is FieldErrors =>
  typeof error === "object" && typeof error.type === "string" && typeof error.message === "string";

export const mapToDot = <T extends Record<string, any>>(errors: FieldErrors<T>) => {
  const r: Record<string, string[]> = {};

  for (const key of Object.keys(errors)) {
    const error = errors[key];
    if (isError(error)) {
      r[key] = r[key] || [];
      if (typeof error.message === "string") {
        r[key].push(error.message);
      }
    } else {
      // @ts-ignore
      const dot = mapToDot(error);
      for (const k of Object.keys(dot)) {
        r[`${key}.${k}`] = dot[k];
      }
    }
  }

  return r;
};

export const GeneralErrors = <T extends FieldValues>(props: {
  except?: (keyof T)[];
  translateId?: string;
  errors: FieldErrors<T>;
  className?: string;
}) => <GeneralErrorsInToast {...props} errors={mapToDot(props.errors)} />;

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

const formatError = (errors: any): string[] => {
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
};

export type ServerError = { errors: Record<string, string[]> };

export const isServerError = (error: any): error is ServerError =>
  typeof error === "object" && typeof error.errors === "object";

export const useFormSubmit = <T extends FieldValues, R = unknown>(
  doSubmitCallback: (data: T) => Promise<ServerError | R>,
  formOptions: UseFormProps<T> & {
    translateErrors?: string;
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError) => void;
    loadingText?: string;
    savedText?: string;
  } = {},
) => {
  const t = useTranslations();
  const router = useRouter();
  const { returnBack, reportProgress, onError, onSuccess, loadingText, savedText, ...options } = formOptions;
  const formProps = useForm<T>(options);
  return {
    ...formProps,
    handleSubmit: () =>
      formProps.handleSubmit((values) => {
        const promise = doSubmitCallback(values)
          .then((data) => {
            if (isServerError(data)) {
              if (typeof onError === "function") {
                onError(data);
              }
              addServerErrors(data.errors, formProps.setError);
              throw data;
            }
            if (typeof onSuccess === "function") {
              onSuccess(data);
            }
            if (returnBack !== false) {
              router.back();
            }
          })
          .catch((e) => {
            captureException(e);
            throw e;
          });

        if (reportProgress !== false) {
          void toast.promise(
            promise,
            {
              loading: loadingText || t("general.saving"),
              success: savedText || t("general.saved"),
              error: (data) => {
                if (isServerError(data)) {
                  return (
                    <>
                      {t("general.validateError")}:{" "}
                      <GeneralErrors
                        className="text-gray-500"
                        translateId={options.translateErrors}
                        errors={formProps.formState.errors}
                      />
                    </>
                  );
                }
                return t("general.error");
              },
            },
            { id: "form-submit" },
          );
        }

        return promise;
      }),
  };
};

export const addServerErrors = <T extends FieldValues>(
  errors: { [P in keyof T]?: string[] },
  setError: UseFormSetError<T>,
) =>
  Object.entries(errors).forEach(([key, value]) => {
    const array = Array.isArray(value) ? value : [errors];
    setError(key as FieldPath<T>, { type: "server", message: array?.join(", ") || "" });
  });
