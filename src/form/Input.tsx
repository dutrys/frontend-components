import {
  Control,
  FieldValues,
  FieldPath,
  Controller,
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { DateTimePicker } from "./DateTimePicker";
import { DatePicker } from "./DatePicker";
import { InputErrors } from "./UseForm";
import { format } from "date-fns";
import { SelectPaginatedFromApi } from "./SelectPaginatedFromApi";
import { PaginateQuery } from "../utils/paginate";
import { stringToDate } from "../utils/datetime";
import cx from "classnames";
import { TimePicker } from "./TimePicker";
import styles from "./Input.module.css";
import { NumericFormat } from "react-number-format";
import { NumericFormatProps } from "react-number-format/types/types";
import React from "react";

interface IInputRegisterProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends IInputProps<TName> {
  options?: Omit<RegisterOptions<TFieldValues, TName>, "required" | "disabled">;
  register: UseFormRegister<TFieldValues>;
}

export const TextInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName> & { type?: string },
) => {
  const options = {
    required: props.required,
    disabled: props.disabled,
    ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
  };

  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        <input
          id={props.id}
          type={props.type || "text"}
          {...props.register(props.name, options)}
          required={props.required}
          disabled={props.disabled}
          placeholder={props.required ? `${props.label}*` : props.label}
          className={cx("input input-bordered w-full", props.className, {
            "input-xs": props.size === "xs",
            "input-sm": props.size === "sm",
            "input-error": props.error,
          })}
        />
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

export const SelectInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName> & {
    children: React.ReactNode;
  },
) => {
  const options = {
    required: props.required,
    disabled: props.disabled,
    ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
  };

  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        <select
          id={props.id}
          disabled={props.disabled}
          {...props.register(props.name, options)}
          className={cx("select select-bordered w-full", props.className, {
            "select-xs": props.size === "xs",
            "select-sm": props.size === "sm",
            "select-error": props.error,
          })}
        >
          {props.children}
        </select>
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

export const TextareaInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName>,
) => {
  const options = {
    required: props.required,
    disabled: props.disabled,
    ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
  };
  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        <textarea
          id={props.id}
          disabled={props.disabled}
          {...props.register(props.name, options)}
          className={cx("textarea textarea-bordered w-full", props.className, {
            "textarea-xs": props.size === "xs",
            "textarea-sm": props.size === "sm",
            "textarea-error": props.error,
          })}
        />
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

export const CheckboxInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputRegisterProps<TFieldValues, TName>,
) => {
  const options = {
    required: props.required,
    disabled: props.disabled,
    ...((props.options as RegisterOptions<TFieldValues, TName>) || {}),
  };

  return (
    <div className={props.fieldSetClassName}>
      <label>
        <input
          id={props.id}
          type="checkbox"
          disabled={props.disabled}
          {...props.register(props.name, options)}
          className={cx("toggle", {
            "toggle-sm": props.size === "sm",
            "toggle-xs": props.size === "xs",
          })}
        />
        <span className="text-sm text-gray-500 label-text grow pl-2">{props.label}</span>
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

export const DateInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  useDate,
  allowEmpty,
  label,
  error,
  disabled,
  desc,
  required,
  size,
  className,
  fieldSetClassName,
  name,
  ...props
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  useDate?: boolean;
  allowEmpty?: boolean;
}) => {
  return (
    <div className={fieldSetClassName}>
      <label className="floating-label">
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <DatePicker
                inputClassName={cx("input input-bordered", className, {
                  "input-xs": size === "xs",
                  "input-sm": size === "sm",
                  "input-error": error,
                })}
                required={required}
                disabled={disabled}
                allowEmpty={allowEmpty}
                placeholder={required ? `${label}*` : label}
                value={field.value}
                onChange={(value) => {
                  if (useDate) {
                    field.onChange(value);
                  } else {
                    field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                  }
                }}
                {...props}
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
        <div className={`text-xs mt-0.5 text-gray-500 ${styles.desc}`}>
          <span>{desc}</span>
        </div>
      )}
      {error && <InputErrors className="text-xs text-error mt-1" errors={error} />}
    </div>
  );
};

export const SelectPaginatedFromApiInput = <
  T extends { data: { id: number }[]; meta: { currentPage: number; totalItems: number; totalPages: number } },
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  queryFn,
  queryKey,
  desc,
  control,
  name,
  valueFormat,
  required,
  disabled,
  error,
  className,
  size,
  onChange,
  fieldSetClassName,
  ...rest
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  queryKey: ReadonlyArray<any>;
  queryFn: (query: PaginateQuery<any>) => Promise<T>;
  valueFormat: (model: T["data"][0]) => string;
  onChange?: (model: T["data"][0]) => unknown;
}) => (
  <div className={fieldSetClassName}>
    <div {...rest} className="floating-label">
      <span>
        {label}
        {required ? <Required /> : null}
      </span>
      <Controller
        control={control}
        name={name}
        rules={{ required: required === true }}
        render={({ field }) => (
          <SelectPaginatedFromApi<T>
            inputClassName={cx("w-full mx-0 input input-bordered", className, {
              "input-error": error,
            })}
            size={size}
            required={required}
            disabled={disabled}
            placeholder={required ? `${label}*` : label}
            queryKey={queryKey}
            queryFn={queryFn}
            value={field.value}
            valueFormat={valueFormat}
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

export const DateTimeInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: IInputProps<TName> & {
    control: Control<TFieldValues>;
    useDate?: boolean;
    allowEmpty?: boolean;
    from?: Date;
    to?: Date;
  },
) => {
  return (
    <div className={props.fieldSetClassName}>
      <label className="floating-label">
        <Controller
          control={props.control}
          name={props.name}
          render={({ field }) => {
            return (
              <DateTimePicker
                inputClassName={cx("input input-bordered", props.className, {
                  "input-xs": props.size === "xs",
                  "input-sm": props.size === "sm",
                  "input-error": props.error,
                })}
                required={props.required}
                allowEmpty={props.allowEmpty}
                placeholder={props.required ? `${props.label}*` : props.label}
                from={props.from}
                disabled={props.disabled}
                to={props.to}
                value={field.value ? (props.useDate ? field.value : stringToDate(field.value)) || null : null}
                onChange={(value) => {
                  if (props.useDate) {
                    field.onChange(value);
                  } else {
                    field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                  }
                }}
              />
            );
          }}
        />
        <span>
          {props.label}
          {props.required ? <Required /> : null}
        </span>
      </label>
      {props.desc && (
        <div className="text-xs my-0.5 text-gray-500">
          <span>{props.desc}</span>
        </div>
      )}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </div>
  );
};

export const TimeInput = <
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

export const NumberInput = <
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
            className={cx("w-full input input-bordered focus:outline-blue-400", {
              "input-xs": props.size === "xs",
              "input-sm": props.size === "sm",
              "input-error": props.error,
            })}
            onValueChange={(values) => field.onChange(values.floatValue)}
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

export const SelectPaginatedFromApiWithLabel = <
  T extends { data: { id: number }[]; meta: { currentPage: number; totalItems: number; totalPages: number } },
>({
  label,
  queryFn,
  queryKey,
  desc,
  name,
  valueFormat,
  required,
  disabled,
  error,
  className,
  size,
  value,
  onChange,
  fieldSetClassName,
  ...rest
}: IInputProps<any> & {
  queryKey: ReadonlyArray<any>;
  queryFn: (query: PaginateQuery<any>) => Promise<T>;
  valueFormat: (model: T["data"][0]) => string;
  onChange?: (model: T["data"][0]) => unknown;
  value: number | null;
}) => {
  return (
    <div className={fieldSetClassName}>
      <div {...rest} className="floating-label">
        <span>
          {label}
          {required ? <Required /> : null}
        </span>
        <SelectPaginatedFromApi<T>
          inputClassName={cx("w-full mx-0 input input-bordered", className, {
            "input-xs": size === "xs",
            "input-sm": size === "sm",
            "input-error": error,
          })}
          size={size}
          required={required}
          disabled={disabled}
          placeholder={required ? `${label}*` : label}
          queryKey={queryKey}
          queryFn={queryFn}
          value={value}
          valueFormat={valueFormat}
          onChange={(model) => onChange?.(model || null)}
        />
      </div>
      <InputErrors className="text-xs text-error mt-1" errors={error} />
    </div>
  );
};

export interface IInputProps<TName extends FieldPath<FieldValues>> {
  id?: string;
  label: string;
  name: TName;
  error?: FieldError;
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
