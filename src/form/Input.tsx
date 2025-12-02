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
import { DateTimePicker } from "./DateTimePicker";
import { DateInput, DateInputProps } from "./DateInput";
import { InputErrors } from "./UseForm";
import { format } from "date-fns";
import { SelectPaginatedFromApi, SelectPaginatedFromApiProps } from "./SelectPaginatedFromApi";
import { ResponseMeta } from "../utils/paginate";
import { stringToDate } from "../utils/date";
import cx from "classnames";
import { TimePicker } from "./TimePicker";
import styles from "./Input.module.css";
import { NumericFormat } from "react-number-format";
import { NumericFormatProps } from "react-number-format/types/types";
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon } from "@heroicons/react/20/solid";
import { LoadingComponent } from "@/Loading";
import { SelectFromApi, SelectFromApiProps } from "./SelectFromApi";

interface IInputRegisterProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends IInputProps<TName> {
  options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
  register: UseFormRegister<TFieldValues>;
}

export const TextFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  required,
  disabled,
  error,
  className,
  id,
  type,
  register,
  label,
  size,
  options,
  desc,
  name,
  fieldSetClassName,
  ref,
  ...rest
}: IInputRegisterProps<TFieldValues, TName> & { type?: string; ref?: (input: HTMLInputElement | null) => void }) => {
  const r = register(name, {
    required: required,
    disabled: disabled,
    ...((options as RegisterOptions<TFieldValues, TName>) || {}),
  });
  return (
    <div className={fieldSetClassName}>
      <label className="floating-label">
        <input
          id={id}
          type={type || "text"}
          {...r}
          ref={(i) => {
            r.ref(i);
            if (ref) {
              ref(i);
            }
          }}
          required={required}
          disabled={disabled}
          placeholder={required ? `${label}*` : label}
          className={cx("input input-bordered w-full", className, {
            "input-xs": size === "xs",
            "input-sm": size === "sm",
            "input-error": error,
          })}
          {...rest}
        />
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
};

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
}) => {
  return (
    <div className={fieldSetClassName}>
      <label className="floating-label">
        <select
          id={id}
          disabled={disabled}
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
};

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
          disabled={props.disabled}
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

export const CheckboxFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName> & { labelClassName?: string; checkbox?: boolean },
) => {
  return (
    <>
      <div className={props.fieldSetClassName}>
        <label>
          <input
            id={props.id}
            type="checkbox"
            disabled={props.disabled}
            {...props.register(props.name, {
              required: props.required,
              disabled: props.disabled,
              ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
            })}
            className={
              props.checkbox
                ? cx("checkbox", props.className, {
                    "checkbox-sm": props.size === "sm",
                    "checkbox-xs": props.size === "xs",
                  })
                : cx("toggle", props.className, {
                    "toggle-sm": props.size === "sm",
                    "toggle-xs": props.size === "xs",
                  })
            }
          />
          <span className={cx("text-sm text-gray-500 label-text grow pl-2", props.labelClassName)}>{props.label}</span>
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

export const DateFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  fieldSetClassName,
  label,
  control,
  error,
  desc,
  useDate,
  ...props
}: Omit<IInputProps<TName>, "size"> &
  Omit<DateInputProps, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    // @deprecated
    useDate?: boolean;
  }) => {
  return (
    <div className={fieldSetClassName}>
      <label className="floating-label">
        <Controller
          control={control}
          name={props.name}
          render={({ field }) => (
            <DateInput
              {...props}
              className={cx({ "input-error": error }, props.className)}
              placeholder={props.required ? `${label}*` : label}
              value={field.value}
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
};

export const SelectPaginatedFromApiFormField = <
  T extends { data: { id: number }[]; meta: ResponseMeta },
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  fieldSetClassName,
  label,
  ...props
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  onChange?: (model: T["data"][number] | null) => void;
} & Omit<SelectPaginatedFromApiProps<T>, "name" | "placeholder" | "value" | "onChange">) => {
  return (
    <div className={fieldSetClassName}>
      <div className="floating-label">
        <span>
          {label}
          {props.required ? <Required /> : null}
        </span>
        <Controller
          control={props.control}
          name={props.name}
          rules={{ required: props.required === true }}
          render={({ field }) => (
            <SelectPaginatedFromApi<T>
              {...props}
              className={cx("w-full mx-0", props.className, { "input-error": props.error })}
              placeholder={props.required ? `${label}*` : label}
              value={field.value}
              onChange={(model) => {
                field.onChange(model?.id || null);
                props.onChange?.(model || null);
              }}
            />
          )}
        />
      </div>
      <InputErrors className="text-xs text-error mt-1" errors={props.error} />
    </div>
  );
};

export const SelectFromApiField = <
  T extends { id: number },
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
        inputClassName={cx("w-full mx-0 input input-bordered", className, {
          "input-error": error,
        })}
        {...rest}
        placeholder={rest.required ? `${label}*` : label}
      />
    </div>
    <InputErrors className="text-xs text-error mt-1" errors={error} />
  </div>
);

export const SelectFromApiFormField = <
  T extends { id: number },
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  desc,
  control,
  name,
  error,
  className,
  onChange,
  fieldSetClassName,
  ...rest
}: IInputProps<TName> &
  Omit<SelectFromApiProps<T>, "onChange" | "value"> & {
    control: Control<TFieldValues>;
    onChange?: (model: T) => unknown;
  }) => (
  <div className={fieldSetClassName}>
    <div className="floating-label">
      <span>
        {label}
        {rest.required ? <Required /> : null}
      </span>
      <Controller
        control={control}
        name={name}
        rules={{ required: rest.required === true }}
        render={({ field }) => (
          <SelectFromApi<T>
            inputClassName={cx("w-full mx-0 input input-bordered", className, {
              "input-error": error,
            })}
            name={name}
            {...rest}
            placeholder={rest.required ? `${label}*` : label}
            value={field.value}
            onChange={(model) => {
              field.onChange(model?.id || null);
              onChange?.(model || null);
            }}
          />
        )}
      />
    </div>
    <InputErrors className="text-xs text-error mt-1" errors={error} />
  </div>
);

export const DateTimeFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  desc,
  control,
  name,
  required,
  disabled,
  error,
  useDate,
  className,
  size,
  from,
  to,
  fieldSetClassName,
  ...rest
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  useDate?: boolean;
  from?: Date;
  to?: Date;
}) => {
  return (
    <div className={fieldSetClassName}>
      <label className="floating-label">
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <DateTimePicker
                inputClassName={cx("input input-bordered", className, {
                  "input-xs": size === "xs",
                  "input-sm": size === "sm",
                  "input-error": error,
                })}
                required={required}
                allowEmpty={!required}
                placeholder={required ? `${label}*` : label}
                from={from}
                disabled={disabled}
                to={to}
                value={field.value ? (useDate ? field.value : stringToDate(field.value)) || null : null}
                onChange={(value) => {
                  if (useDate) {
                    field.onChange(value);
                  } else {
                    field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                  }
                }}
                {...rest}
              />
            );
          }}
        />
        <span>
          {label}
          {required ? <Required /> : null}
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
};

export const TimeFormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
  },
) => {
  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        {!props.disabled && (
          <span>
            {props.label}
            {props.required && <Required />}
          </span>
        )}
        <Controller
          render={({ field }) => (
            <TimePicker
              value={field.value}
              onChange={(v) => field.onChange(v)}
              placeholder={props.required ? `${props.label}*` : props.label}
              required={props.required}
              disabled={props.disabled}
              className={cx("input w-full", props.className, {
                "input-xs": props.size === "xs",
                "input-sm": props.size === "sm",
                "input-error": props.error,
              })}
            />
          )}
          name={props.name}
          control={props.control}
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
};

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
        render={({ field }) => (
          <NumericFormat
            placeholder={props.required ? `${props.label}*` : props.label}
            {...options}
            disabled={props?.disabled}
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

export const SelectPaginatedFromApiField = <T extends { data: { id: number }[]; meta: ResponseMeta }>({
  label,
  fieldSetClassName,
  className,
  desc,
  error,
  ...props
}: IInputProps<any> & Omit<SelectPaginatedFromApiProps<T>, "placeholder">) => {
  return (
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
};

const splitByData = <T extends Record<string, unknown>>(attrs: T): [Partial<T>, Partial<T>] => {
  const entries = Object.entries(attrs);
  const dataEntries = entries.filter(([key]) => !key.startsWith("data-"));
  const restEntries = entries.filter(([key]) => key.startsWith("data-"));

  return [Object.fromEntries(dataEntries) as Partial<T>, Object.fromEntries(restEntries) as Partial<T>];
};

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

export const Required = () => {
  return <span className="text-error align-bottom">*</span>;
};

export const SaveButton = ({
  isLoading,
  text,
  icon,
  disabled,
  className = "btn-block",
  onClick,
  size,
  type = "submit",
  ...props
}: {
  type?: "submit" | "button";
  size?: "sm";
  onClick?: () => unknown;
  className?: string;
  icon?: React.ElementType;
  text?: string;
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  const t = useTranslations();
  const Icon = icon || CheckIcon;

  return (
    <button
      type={type}
      className={`btn btn-primary ${size === "sm" ? "btn-sm" : ""} ${className}`}
      color="primary"
      disabled={isLoading || disabled}
      data-testid={type === "submit" ? "submit" : undefined}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      {...props}
    >
      {text || t("general.saveButton")}
      {isLoading ? <LoadingComponent className="size-4" /> : <Icon className="size-4" />}
    </button>
  );
};

export const IndeterminateCheckbox = ({
  checked,
  className = "checkbox checkbox-xs",
  indeterminate,
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => unknown;
  checked: boolean;
  className: string;
  indeterminate?: boolean;
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
    <input type="checkbox" ref={checkboxRef} className={className} onChange={onChange} checked={checked || false} />
  );
};
