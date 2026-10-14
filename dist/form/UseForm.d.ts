import React from "react";
import { FieldErrors, FieldValues, UseFormProps, UseFormReturn, UseFormSetError } from "react-hook-form";
export declare const AlertErrors: ({ forceKey, errors, translateId, className, }: {
    forceKey?: boolean;
    errors: FieldErrors;
    translateId?: string;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element | null;
export declare const GeneralErrorsInToast: <T extends Record<string, unknown>>({ errors, translateId, except, className, }: {
    except?: (keyof T)[];
    translateId?: string;
    errors: Record<string, string[]>;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const mapToDot: <T extends Record<string, any>>(errors: FieldErrors<T>) => Record<string, string[]>;
/**
 * @deprecated - use <AlertErrors/> instead
 */
export declare const GeneralErrors: <T extends FieldValues>(props: {
    except?: (keyof T)[];
    translateId?: string;
    errors: FieldErrors<T>;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const InputErrors: ({ errors, className, }: {
    className?: string;
    errors: any;
}) => import("react/jsx-runtime").JSX.Element | null;
export type ServerError = {
    errors: Record<string, string[]>;
};
export declare const isServerError: (error: any) => error is ServerError;
export declare const useFormSubmit: <T extends FieldValues, R = unknown>(formOptions?: UseFormProps<T> & {
    translateErrors?: string;
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError) => void;
    loadingText?: string;
    savedText?: string;
    confirm?: boolean;
}) => Omit<UseFormReturn<T>, "handleSubmit"> & {
    confirm?: {
        needsConfirm: boolean;
        setNeedsConfirm: (needsConfirm: boolean) => void;
        showDialog: () => void;
    };
    handleSubmit: (doSubmitCallback: (data: T) => Promise<ServerError | R>) => (e?: React.BaseSyntheticEvent) => Promise<unknown>;
};
export declare const ConfirmSave: ({ onConfirm }: {
    onConfirm: (success: boolean) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const addServerErrors: <T extends FieldValues>(errors: { [P in keyof T]?: string[]; }, setError: UseFormSetError<T>) => void;
//# sourceMappingURL=UseForm.d.ts.map