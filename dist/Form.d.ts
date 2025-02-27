import React from "react";
import { FieldValues, UseFormProps, UseFormSetError } from "react-hook-form";
export declare const InputErrors: ({ errors, className, }: {
    className?: string;
    errors: any;
}) => import("react/jsx-runtime").JSX.Element | null;
export type ServerError<T> = {
    errors: Record<keyof T, string[]>;
};
export declare const isServerError: (error: any) => error is ServerError<any>;
export declare function useFormSubmit<T extends FieldValues, R = unknown>(doSubmitCallback: (data: T) => Promise<ServerError<T> | R>, formOptions: UseFormProps<T>, options?: {
    returnBack?: boolean;
    reportProgress?: boolean;
    onSuccess?: (data: R) => void;
    onError?: (data: ServerError<T>) => void;
}): {
    handleSubmit: () => (e?: React.BaseSyntheticEvent) => Promise<void>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
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
export declare function addServerErrors<T extends FieldValues>(errors: {
    [P in keyof T]?: string[];
}, setError: UseFormSetError<T>): void;
//# sourceMappingURL=Form.d.ts.map