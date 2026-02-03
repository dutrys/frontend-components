import * as React from "react";
import toast, { resolveValue, Toaster as ReactHotToast, useToasterStore } from "react-hot-toast";
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

const options: {
  [index: string]: {
    icon: React.ReactNode;
    classNames: string;
  };
} = {
  loading: {
    classNames: "bg-blue-100 dark:text-blue-200 text-blue-500 dark:bg-blue-800",
    icon: <span className="loading loading-infinity loading-xs"></span>,
  },
  error: {
    classNames: "bg-red-100 dark:text-red-200 text-red-500 dark:bg-red-800",
    icon: <ExclamationCircleIcon width={15} />,
  },
  success: {
    classNames: "bg-green-100 dark:text-green-200 text-green-500 dark:bg-green-800",
    icon: <CheckCircleIcon width={15} />,
  },
  warn: {
    classNames: "bg-orange-100 dark:text-orange-200 text-orange-500 dark:bg-orange-800",
    icon: <ExclamationTriangleIcon width={15} />,
  },
};

export const TOOLTIP_GLOBAL_ID = "global";

export const Toaster = () => {
  const { toasts } = useToasterStore();

  // Enforce Limit (1 toast)
  React.useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= 1)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <>
      <Tooltip id={TOOLTIP_GLOBAL_ID} className="text-xs!" place="top" />

      <ReactHotToast position="top-center">
        {(t) => {
          const type = options[t.type] || options.success;
          return (
            <div
              data-testid="toast"
              onClick={() => toast.remove(t.id)}
              className="cursor-pointer flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
              role="alert"
            >
              {t.icon ? (
                t.icon
              ) : (
                <div
                  className={`inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${type.classNames} ${t.className}`}
                >
                  {type.icon}
                  <span className="sr-only">{t.type}</span>
                </div>
              )}
              <div className="ml-3 text-sm font-normal sentry-unmask">{resolveValue(t.message, t)}</div>
            </div>
          );
        }}
      </ReactHotToast>
    </>
  );
};
