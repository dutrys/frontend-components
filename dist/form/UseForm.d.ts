import React from "react";
import { FieldErrors, FieldValues, UseFormProps, UseFormSetError } from "react-hook-form";
export declare const GeneralErrorsInToast: <T extends Record<string, unknown>>({ errors, translateId, except, className, }: {
    except?: (keyof T)[];
    translateId?: string;
    errors: Record<string, string[]>;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const mapToDot: <T extends Record<string, any>>(errors: FieldErrors<T>) => Record<string, string[]>;
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
export declare const useFormSubmit: <T extends FieldValues, R = unknown>(doSubmitCallback: (data: T) => Promise<ServerError | R>, formOptions?: UseFormProps<T> & {
    translateErrors?: string;
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError) => void;
    loadingText?: string;
    savedText?: string;
    confirm?: boolean;
}) => {
    confirm: {
        needsConfirm: boolean;
        setNeedsConfirm: (success: boolean) => void;
        showDialog: () => void;
    } | undefined;
    handleSubmit: () => (e?: React.BaseSyntheticEvent) => Promise<void>;
    watch: import("react-hook-form").UseFormWatch<T>;
    getValues: import("react-hook-form").UseFormGetValues<T>;
    getFieldState: import("react-hook-form").UseFormGetFieldState<T>;
    setError: UseFormSetError<T>;
    clearErrors: import("react-hook-form").UseFormClearErrors<T>;
    setValue: import("react-hook-form").UseFormSetValue<T>;
    trigger: import("react-hook-form").UseFormTrigger<T>;
    formState: import("react-hook-form").FormState<T>;
    resetField: import("react-hook-form").UseFormResetField<T>;
    reset: import("react-hook-form").UseFormReset<T>;
    unregister: import("react-hook-form").UseFormUnregister<T>;
    control: import("react-hook-form").Control<T, any>;
    register: import("react-hook-form").UseFormRegister<T>;
    setFocus: import("react-hook-form").UseFormSetFocus<T>;
};
export declare const ConfirmSave: ({ onConfirm }: {
    onConfirm: (success: boolean) => void;
}) => import("react/jsx-runtime").JSX.Element;
export declare const addServerErrors: <T extends FieldValues>(errors: { [P in keyof T]?: string[]; }, setError: UseFormSetError<T>) => void;
//# sourceMappingURL=UseForm.d.ts.map