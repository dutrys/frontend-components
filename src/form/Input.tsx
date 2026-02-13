import {
  Control,
  FieldValues,
  FieldPath,
  Controller,
  FieldError,
  RegisterOptions,
  UseFormRegister,
  Merge,
} from "react-hook-form";
import { DateTimePicker, DateTimePickerProps } from "./DateTimePicker";
import { DateInput, DateInputProps, DateRangeInput, DateRangeInputProps } from "./DateInput";
import { InputErrors } from "./UseForm";
import { format } from "date-fns";
import { SelectPaginatedFromApi, SelectPaginatedFromApiProps } from "./SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";
import { stringToDate } from "../utils/date";
import cx from "classnames";
import { TimePicker, TimePickerProps } from "./TimePicker";
import styles from "./Input.module.css";
import { NumericFormat } from "react-number-format";
import { NumericFormatProps } from "react-number-format/types/types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@heroicons/react/20/solid";
import { LoadingComponent } from "../Loading";
import { SelectFromApi, SelectFromApiProps } from "./SelectFromApi";

export interface IInputProps<TName extends FieldPath<FieldValues>> {
  id?: string;
  label: string;
  name: TName;
  error?: FieldError | Merge<FieldError, (FieldError | undefined)[]>;
  required?: boolean;
  className?: string;
  fieldSetClassName?: string;
  disabled?: boolean;
  desc?: React.ReactNode;
  size?: "xs" | "sm";
}

interface IInputRegisterOnlyProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
  register: UseFormRegister<TFieldValues>;
}

interface IInputRegisterProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends IInputProps<TName>,
    IInputRegisterOnlyProps<TFieldValues, TName> {}

export const TextFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  register,
  options,
  name,
  ref,
  ...rest
}: IInputRegisterProps<TFieldValues, TName> & {
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  type?: string;
  ref?: (input: HTMLInputElement | null) => void;
}) => {
  const r = register(name, {
    required: rest.required,
    disabled: rest.disabled,
    ...((options as RegisterOptions<TFieldValues, TName>) || {}),
  });
  return (
    <TextField
      {...rest}
      {...r}
      ref={(reference) => {
        r.ref(reference);
        if (ref) {
          ref(reference);
        }
      }}
    />
  );
};

export const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  error,
  className,
  type = "text",
  label,
  size,
  desc,
  fieldSetClassName,
  append,
  prepend,
  ...rest
}: IInputProps<TName> & {
  onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  type?: string;
  ref?: (input: HTMLInputElement | null) => void;
}) => (
  <div className={fieldSetClassName}>
    <label className="floating-label">
      {append || prepend ? (
        <div
          className={cx("input input-bordered w-full", className, {
            "input-xs": size === "xs",
            "input-sm": size === "sm",
            "input-error": error,
          })}
        >
          {prepend}
          <input type={type} placeholder={rest.required ? `${label}*` : label} {...rest} />
          {append}
        </div>
      ) : (
        <input
          type={type}
          placeholder={rest.required ? `${label}*` : label}
          className={cx("input input-bordered w-full", className, {
            "input-xs": size === "xs",
            "input-sm": size === "sm",
            "input-error": error,
          })}
          {...rest}
        />
      )}

      <span>
        {label}
        {rest.required ? <Required /> : null}
      </span>
    </label>
    {desc && (
      <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
        <span>{desc}</span>
      </div>
    )}
    {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
  </div>
);

export const SelectFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  id,
  disabled,
  fieldSetClassName,
  label,
  register,
  required,
  name,
  error,
  desc,
  options,
  size,
  className,
  children,
  ...rest
}: IInputRegisterProps<TFieldValues, TName> & {
  children: React.ReactNode;
}) => (
  <div className={fieldSetClassName}>
    <label className="floating-label">
      <select
        id={id}
        {...register(name, {
          required: required,
          disabled: disabled,
          ...((options as RegisterOptions<TFieldValues, TName>) || {}),
        })}
        className={cx("select select-bordered w-full", className, {
          "select-xs": size === "xs",
          "select-sm": size === "sm",
          "select-error": error,
        })}
        {...rest}
      >
        {children}
      </select>
      <span>
        {label}
        {required ? <Required /> : null}
      </span>
    </label>
    {desc && (
      <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
        <span>{desc}</span>
      </div>
    )}
    {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
  </div>
);

export const TextareaFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName> & {
    maxLength?: number;
  },
) => {
  const r = props.register(props.name, {
    required: props.required,
    disabled: props.disabled,
    ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
  });
  const [length, setLength] = useState(0);

  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        <textarea
          id={props.id}
          placeholder={props.required ? `${props.label}*` : props.label}
          {...r}
          className={cx("textarea textarea-bordered w-full", props.className, {
            "textarea-xs": props.size === "xs",
            "textarea-sm": props.size === "sm",
            "textarea-error": props.error,
          })}
          ref={(el) => {
            r.ref(el);
            if (props.maxLength && el) {
              setLength(el.value.length ?? 0);
            }
          }}
          onChange={(e) => {
            if (props.maxLength) {
              setLength(e.target?.value?.length ?? 0);
            }
          }}
        />
        {props.maxLength && (
          <div className="badge badge-xs badge-ghost absolute right-1 bottom-1">{`${length}/${props.maxLength}`}</div>
        )}
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && (
        <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
          <span>{props.desc}</span>
        </div>
      )}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </div>
  );
};

export const RadioBoxFormField = <T extends string>({
  name,
  options,
  label = "",
  value,
  onChange,
}: {
  name: string;
  value: T;
  label?: string;
  options: Record<T, string>;
  onChange: (value: T) => void;
}) => (
  <div>
    {label || ""}
    <div className="flex flex-col pt-2 gap-2">
      {Object.entries(options).map(([key, label]) => (
        <label key={key}>
          <input
            key={key}
            type="radio"
            checked={value === key}
            name={name}
            value={key}
            onChange={() => onChange(key as T)}
            className="radio radio-primary"
          />{" "}
          {typeof label === "string" ? label : null}
        </label>
      ))}
    </div>
  </div>
);

export const IndeterminateCheckbox = ({
  checked,
  className = "checkbox checkbox-xs",
  indeterminate,
  onChange,
  disabled,
  id,
  ref,
}: {
  id?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => unknown;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  ref?: (input: HTMLInputElement | null) => void;
}) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checkboxRef.current) {
      return;
    }
    if (indeterminate === true) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [indeterminate, checked]);

  return (
    <input
      id={id}
      type="checkbox"
      disabled={disabled}
      ref={(r) => {
        checkboxRef.current = r;
        ref?.(r);
      }}
      className={className}
      onChange={onChange}
      checked={checked || false}
    />
  );
};

type CheckboxFieldProps<TName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues = FieldValues> = Omit<
  IInputProps<TName>,
  "required" | "value"
> & {
  labelClassName?: string;
  checkbox?: boolean;
  checked?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
  indeterminate?: boolean;
};

export const CheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  fieldSetClassName,
  checkbox,
  className,
  labelClassName,
  size,
  indeterminate,
  ref,
  ...props
}: { ref?: (input: HTMLInputElement | null) => void } & CheckboxFieldProps<TName, TFieldValues>) => {
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!checkboxRef.current) {
      return;
    }
    if (indeterminate === true) {
      checkboxRef.current.indeterminate = true;
    } else {
      checkboxRef.current.indeterminate = false;
    }
  }, [indeterminate, props.checked]);

  return (
    <>
      <div className={fieldSetClassName}>
        <label>
          <input
            type="checkbox"
            {...props}
            ref={(r) => {
              checkboxRef.current = r;
              ref?.(r);
            }}
            className={
              checkbox
                ? cx("checkbox", className, {
                    "checkbox-sm": size === "sm",
                    "checkbox-xs": size === "xs",
                  })
                : cx("toggle", className, {
                    "toggle-sm": size === "sm",
                    "toggle-xs": size === "xs",
                  })
            }
          />
          <span
            className={cx("text-gray-500 label-text grow pl-2", labelClassName, {
              "text-sm": !size,
              "text-xs": size === "sm" || size === "xs",
            })}
          >
            {label}
          </span>
        </label>
      </div>
      {props.desc && (
        <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
          <span>{props.desc}</span>
        </div>
      )}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </>
  );
};

export const CheckboxFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  disabled,
  options,
  register,
  ...props
}: Omit<CheckboxFieldProps<TName, TFieldValues>, "checked" | "onChange"> &
  IInputRegisterOnlyProps<TFieldValues, TName>) => (
  <CheckboxField
    {...props}
    {...register(name, {
      disabled,
      ...((options as RegisterOptions<TFieldValues, TName>) || {}),
    })}
  />
);

export const DateField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  fieldSetClassName,
  label,
  error,
  desc,
  ...props
}: Omit<IInputProps<TName>, "size"> & DateInputProps) => (
  <div className={fieldSetClassName}>
    <label className="floating-label">
      <DateInput
        {...props}
        className={cx({ "input-error": error }, props.className)}
        placeholder={props.required ? `${label}*` : label}
      />
      <span>
        {label}
        {props.required ? <Required /> : null}
      </span>
    </label>
    {desc && (
      <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
        <span>{desc}</span>
      </div>
    )}
    {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
  </div>
);

export const DateFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  useDate,
  ...props
}: Omit<IInputProps<TName>, "size"> &
  Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    // @deprecated
    useDate?: boolean;
  }) => (
  <Controller
    disabled={props.disabled}
    control={control}
    rules={{ required: props.required === true }}
    name={props.name}
    render={({ field }) => (
      <DateField
        {...props}
        value={field.value}
        disabled={field.disabled}
        onChange={(value) => {
          if (useDate) {
            field.onChange(value);
          } else {
            field.onChange(value ? format(value as Date, "yyyy-MM-dd") : null);
          }
        }}
      />
    )}
  />
);

export const DateRangeField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  fieldSetClassName,
  label,
  error,
  desc,
  ...props
}: Omit<IInputProps<TName>, "size"> & DateRangeInputProps) => (
  <div className={fieldSetClassName}>
    <label className="floating-label">
      <DateRangeInput
        {...props}
        className={cx({ "input-error": error }, props.className)}
        placeholder={props.required ? `${label}*` : label}
      />
      <span>
        {label}
        {props.required ? <Required /> : null}
      </span>
    </label>
    {desc && (
      <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
        <span>{desc}</span>
      </div>
    )}
    {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
  </div>
);

export const SelectPaginatedFromApiFormField = <
  T extends { data: unknown[]; meta: ResponseMeta },
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  optionValue = (model) => (model as any).id,
  ...props
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange" | "options">) => (
  <Controller
    control={props.control}
    name={props.name}
    disabled={props.disabled}
    rules={{ required: props.required === true }}
    render={({ field }) => (
      <SelectPaginatedFromApiField<T>
        {...props}
        disabled={field.disabled}
        value={field.value}
        onChange={(model) => {
          field.onChange(model ? optionValue(model) : null);
          props.onChange?.(model || null);
        }}
      />
    )}
  />
);

export const SelectFromApiField = <
  T = unknown,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  desc,
  error,
  className,
  fieldSetClassName,
  ...rest
}: IInputProps<TName> & SelectFromApiProps<T>) => (
  <div className={fieldSetClassName}>
    <div className="floating-label">
      <span>
        {label}
        {rest.required ? <Required /> : null}
      </span>
      <SelectFromApi<T>
        className={cx(className, { "input-error": error })}
        {...rest}
        placeholder={rest.required ? `${label}*` : label}
      />
    </div>
    <InputErrors className="text-xs text-error mt-1" errors={error} />
  </div>
);

export const SelectFromApiFormField = <
  T = unknown,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  onChange,
  optionValue = (model) => (model as any).id,
  ...props
}: IInputProps<TName> &
  Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T | null) => unknown;
  }) => (
  <Controller
    control={control}
    name={props.name}
    rules={{ required: props.required === true }}
    render={({ field }) => (
      <SelectFromApiField<T>
        {...props}
        disabled={field.disabled}
        optionValue={optionValue}
        value={field.value}
        onChange={(model) => {
          field.onChange(model ? optionValue(model) : null);
          onChange?.(model);
        }}
      />
    )}
  />
);

export const DateTimeFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  desc,
  control,
  name,
  disabled,
  error,
  className,
  fieldSetClassName,
  useDate,
  ...props
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  useDate?: boolean;
} & DateTimePickerProps) => (
  <div className={fieldSetClassName}>
    <label className="floating-label">
      <Controller
        control={control}
        name={name}
        rules={{ required: props.required === true }}
        disabled={disabled}
        render={({ field }) => (
          <DateTimePicker
            {...props}
            className={cx(className, { "input-error": error })}
            placeholder={props.required ? `${label}*` : label}
            disabled={field.disabled}
            value={field.value ? (useDate ? field.value : stringToDate(field.value)) || null : null}
            onChange={(value) => {
              if (useDate) {
                field.onChange(value);
              } else {
                field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
              }
            }}
          />
        )}
      />
      <span>
        {label}
        {props.required ? <Required /> : null}
      </span>
    </label>
    {desc && (
      <div className="text-xs my-0.5 text-gray-500">
        <span>{desc}</span>
      </div>
    )}
    {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
  </div>
);

export const TimeFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  control,
  className,
  ...props
}: Omit<TimePickerProps, "onChange" | "value"> & IInputProps<TName> & { control: Control<TFieldValues> }) => (
  <div className={props.fieldSetClassName}>
    <label className="floating-label">
      {!props.disabled && (
        <span>
          {label}
          {props.required && <Required />}
        </span>
      )}
      <Controller
        disabled={props.disabled}
        rules={{ required: props.required === true }}
        render={({ field }) => (
          <TimePicker
            {...props}
            value={field.value}
            onChange={(v) => field.onChange(v)}
            placeholder={props.required ? `${label}*` : label}
            className={cx("input w-full", className, {
              "input-xs": props.size === "xs",
              "input-sm": props.size === "sm",
              "input-error": props.error,
            })}
          />
        )}
        name={props.name}
        control={control}
      />
    </label>
    {props.desc && (
      <div className="text-xs text-gray-500">
        <span>{props.desc}</span>
      </div>
    )}
    <InputErrors className="text-xs text-error mt-1" errors={props.error} />
  </div>
);

export const NumberFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  options,
  ...props
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  options?: NumericFormatProps;
}) => (
  <div className={props.fieldSetClassName}>
    <div className="floating-label">
      {!props?.disabled && (
        <span>
          {props.label}
          {props?.required && <Required />}
        </span>
      )}
      <Controller
        name={props.name}
        control={props.control}
        disabled={props.disabled}
        render={({ field }) => (
          <NumericFormat
            placeholder={props.required ? `${props.label}*` : props.label}
            {...options}
            disabled={field?.disabled}
            required={props?.required}
            value={field.value}
            className={cx("w-full input input-bordered focus:outline-blue-400", props.className, {
              "input-xs": props.size === "xs",
              "input-sm": props.size === "sm",
              "input-error": props.error,
            })}
            onValueChange={(values) => field.onChange(values.floatValue ?? null)}
          />
        )}
      />
    </div>
    {props.desc && (
      <div className="text-xs text-gray-500">
        <span>{props.desc}</span>
      </div>
    )}
    {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
  </div>
);

export const Label = ({ text, required }: { required?: boolean; size?: "sm"; text: React.ReactNode }) => (
  <label className="label">
    <span className="text-sm">
      {text}
      {required && <Required />}
    </span>
  </label>
);

export const SelectPaginatedFromApiField = <T extends { data: unknown[]; meta: ResponseMeta }>({
  label,
  fieldSetClassName,
  className,
  desc,
  error,
  ...props
}: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => (
  <div className={fieldSetClassName}>
    <div className="floating-label">
      <span>
        {label}
        {props.required ? <Required /> : null}
      </span>
      <SelectPaginatedFromApi<T>
        {...props}
        className={cx("mx-0", className, { "input-error": error })}
        placeholder={props.required ? `${label}*` : label}
      />
    </div>
    {desc}
    <InputErrors className="text-xs text-error mt-1" errors={error} />
  </div>
);

export const Required = () => <span className="text-error align-bottom">*</span>;

export const SaveButton = ({
  isLoading,
  icon,
  disabled,
  className = "btn-block",
  onClick,
  size,
  color = "btn-primary",
  children,
  type = "submit",
  ...props
}: {
  type?: "submit" | "button";
  size?: "sm";
  color?: "btn-primary" | "btn-secondary" | "btn-warning" | "btn-error" | "btn-success" | "btn-neutral" | "btn-info";
  onClick?: () => unknown;
  className?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  const t = useTranslations();
  const Icon = icon || CheckIcon;

  return (
    <button
      type={type}
      className={`btn ${color} ${size === "sm" ? "btn-sm" : ""} ${className}`}
      color="primary"
      disabled={isLoading || disabled}
      data-testid={type === "submit" ? "submit" : undefined}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      {children ?? t("general.saveButton")}
      {isLoading ? <LoadingComponent className="size-4" /> : <Icon className="size-4" />}
    </button>
  );
};
