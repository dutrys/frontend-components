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
import { InputErrors } from "./Form";
import { format } from "date-fns";
import { SelectPaginatedFromApi } from "./SelectPaginatedFromApi";
import { PaginateQuery } from "./utils/paginate";
import { stringToDate } from "./utils/datetime";
import cx from "classnames";

interface IInputProps<TName extends FieldPath<FieldValues>> {
  id?: string;
  label: string;
  name: TName;
  error?: FieldError;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  desc?: string;
  size?: "xs" | "sm" | "md" | "lg";
}

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
    <div>
      <label className="floating-label">
        <input
          id={props.id}
          type={props.type || "text"}
          {...props.register(props.name, options)}
          required={props.required}
          disabled={props.disabled}
          placeholder={props.label}
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
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
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
    <div>
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
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
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
    <div>
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
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </div>
  );
};

const Required = () => {
  return <span className="text-error align-bottom">*</span>;
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
    <div>
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
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </div>
  );
};

export const DateInput = <
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
    <div>
      <label className="floating-label">
        <Controller
          control={props.control}
          name={props.name}
          render={({ field }) => {
            return (
              <DatePicker
                inputClassName={cx("input input-bordered", props.className, {
                  "input-xs": props.size === "xs",
                  "input-sm": props.size === "sm",
                  "input-error": props.error,
                })}
                required={props.required}
                disabled={props.disabled}
                allowEmpty={props.allowEmpty}
                placeholder={props.label}
                value={field.value}
                onChange={(value) => {
                  if (props.useDate) {
                    field.onChange(value);
                  } else {
                    field.onChange(value ? format(value, "yyyy-MM-dd") : null);
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
      {props.desc && <div className="text-xs mt-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
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
  ...rest
}: IInputProps<TName> & {
  control: Control<TFieldValues>;
  queryKey: ReadonlyArray<any>;
  queryFn: (query: PaginateQuery<any>) => Promise<T>;
  valueFormat: (model: T["data"][0]) => string;
  onChange?: (model: T["data"][0]) => unknown;
}) => (
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
            "input-xs": size === "xs",
            "input-sm": size === "sm",
            "input-error": error,
          })}
          required={required}
          disabled={disabled}
          placeholder={label}
          queryKey={queryKey}
          queryFunction={queryFn}
          value={field.value}
          valueFormat={valueFormat}
          onChange={(model) => {
            field.onChange(model?.id || null);
            onChange?.(model || null);
          }}
        />
      )}
    />
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
    <div>
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
                placeholder={props.label}
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
      {props.desc && <div className="text-xs my-0.5 text-gray-500">{props.desc}</div>}
      {props.error && <InputErrors className="text-xs text-error mt-1" errors={props.error} />}
    </div>
  );
};
