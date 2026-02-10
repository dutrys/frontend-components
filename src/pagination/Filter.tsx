import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import cx from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Filter.module.css";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { format, parse } from "date-fns";
import Link from "next/link";
import { ChevronDoubleDownIcon } from "@heroicons/react/24/outline";
import { PaginateQuery, ResponseMeta, setPartialParams } from "../utils/paginate";
import { SelectPaginatedFromApiField } from "../form/Input";
import { Select } from "../form/Select";
import { Popover } from "../dialog/Popover";
import { DateInput } from "../form/DateInput";

export const FilterNumberRange = ({
  filter,
  fieldsetClassName,
  from,
  to,
  options,
  onConvertValueSubmit = (v) => v ?? "",
  onCovertFromValue = (v) => v ?? 0,
}: {
  fieldsetClassName?: string;
  filter: string;
  from: string;
  to: string;
  options?: NumericFormatProps;
  onConvertValueSubmit: (value: number | null) => string | number;
  onCovertFromValue: (value: number | null) => number;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const stringValue = searchParams.get(`filter.${filter}`) ?? "";
  let defaultFromValue = 0;
  let defaultToValue = 0;
  if (/^\$btw:/.test(stringValue)) {
    const splitted = stringValue.replace(/^\$btw:/, "").split(",");
    defaultFromValue = onCovertFromValue(parseFloat(splitted[0]) ?? 0);
    defaultToValue = onCovertFromValue(parseFloat(splitted[1]) ?? 0);
  } else if (/^\$gte:/.test(stringValue)) {
    defaultFromValue = onCovertFromValue(parseFloat(stringValue.replace(/^\$gte:/, "")) ?? 0);
  } else if (/^\$lte:/.test(stringValue)) {
    defaultToValue = onCovertFromValue(parseFloat(stringValue.replace(/^\$lte:/, "")) ?? 0);
  }

  const submit = () => {
    let value = "";
    if (fromValue && toValue) {
      value = `$btw:${onConvertValueSubmit(fromValue)},${onConvertValueSubmit(toValue)}`;
    } else if (fromValue) {
      value = `$gte:${onConvertValueSubmit(fromValue)}`;
    } else if (toValue) {
      value = `$lte:${onConvertValueSubmit(toValue)}`;
    }
    router.replace(setPartialParams({ [`filter.${filter}`]: value }, searchParams));
  };

  const [[fromValue, toValue], setValues] = useState<[number | null, number | null]>([
    defaultFromValue,
    defaultToValue,
  ]);

  return (
    <div className={cx(fieldsetClassName, styles.field, "join")}>
      <label className="floating-label grow">
        <NumericFormat
          {...options}
          placeholder={from}
          value={fromValue === 0 ? null : fromValue}
          className="input input-xs join-item"
          onValueChange={(values) => setValues((prev) => [values.floatValue ?? null, prev[1]])}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.code === "Enter") {
              submit();
            }
          }}
          onBlur={() => submit()}
        />
        <span className="label-text-alt">{from}</span>
      </label>
      <label className="floating-label grow">
        <NumericFormat
          placeholder={to}
          {...options}
          value={toValue === 0 ? null : toValue}
          className="input input-xs join-item"
          onValueChange={(values) => setValues((prev) => [prev[0], values.floatValue ?? null])}
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.code === "Enter") {
              submit();
            }
          }}
          onBlur={() => submit()}
        />
        <span className="label-text-alt">{to}</span>
      </label>
    </div>
  );
};

export const FilterDateRange = ({
  filter,
  fieldsetClassName,
  from,
  to,
  options,
}: {
  fieldsetClassName?: string;
  filter: string | [string, string];
  from: string;
  to: string;
  options?: NumericFormatProps;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  let defaultFromValue: Date | null = null;
  let defaultToValue: Date | null = null;
  if (Array.isArray(filter)) {
    const stringToValue = searchParams.get(`filter.${filter[0]}`) ?? "";
    if (/^\$gte:/.test(stringToValue)) {
      defaultFromValue = parse(stringToValue.replace(/^\$gte?:/, ""), "yyyy-MM-dd", new Date());
    }
    const stringFromValue = searchParams.get(`filter.${filter[1]}`) ?? "";
    if (/^\$lte:/.test(stringFromValue)) {
      defaultToValue = parse(stringFromValue.replace(/^\$lte?:/, ""), "yyyy-MM-dd", new Date());
    }
  } else {
    const stringValue = searchParams.get(`filter.${filter}`) ?? "";
    if (/^\$btw:/.test(stringValue)) {
      const splitted = stringValue.replace(/^\$btw:/, "").split(",");
      defaultFromValue = parse(splitted[0], "yyyy-MM-dd", new Date());
      defaultToValue = parse(splitted[1], "yyyy-MM-dd", new Date());
    } else if (/^\$gte:/.test(stringValue)) {
      defaultFromValue = parse(stringValue.replace(/^\$gte?:/, ""), "yyyy-MM-dd", new Date());
    } else if (/^\$lte:/.test(stringValue)) {
      defaultToValue = parse(stringValue.replace(/^\$lte?:/, ""), "yyyy-MM-dd", new Date());
    }
  }

  const submit = () => {
    let params: Record<string, string> = {};
    if (Array.isArray(filter)) {
      params = { [`filter.${filter[0]}`]: "", [`filter.${filter[1]}`]: "" };

      if (fromValue) {
        params[`filter.${filter[0]}`] = `$gte:${format(fromValue, "yyyy-MM-dd")}`;
      }
      if (toValue) {
        params[`filter.${filter[1]}`] = `$lte:${format(toValue, "yyyy-MM-dd")}`;
      }
    } else {
      if (fromValue && toValue) {
        params = { [`filter.${filter}`]: `$btw:${format(fromValue, "yyyy-MM-dd")},${format(toValue, "yyyy-MM-dd")}` };
      } else if (fromValue) {
        params = { [`filter.${filter}`]: `$gte:${format(fromValue, "yyyy-MM-dd")}` };
      } else if (toValue) {
        params = { [`filter.${filter}`]: `$lte:${format(toValue, "yyyy-MM-dd")}` };
      }
    }

    router.replace(setPartialParams(params, searchParams));
  };

  const [[fromValue, toValue], setValues] = useState<[Date | null, Date | null]>([defaultFromValue, defaultToValue]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleBlur = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      submit();
    }, 100);
  };

  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className={cx(fieldsetClassName, styles.fieldDate, "join")}>
      <label className="floating-label grow">
        <DateInput
          placeholder={from}
          {...options}
          value={fromValue}
          size="xs"
          className="join-item"
          onChange={(date) => setValues((prev) => [date, prev[1]])}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              submit();
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className="label-text-alt">{from}</span>
      </label>
      <label className="floating-label grow">
        <DateInput
          placeholder={to}
          {...options}
          value={toValue}
          size="xs"
          className="join-item"
          onChange={(date) => setValues((prev) => [prev[0], date])}
          onKeyUp={(e) => {
            if (e.code === "Enter") {
              submit();
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <span className="label-text-alt">{to}</span>
      </label>
    </div>
  );
};

export const FilterText = ({
  filter,
  label,
  fieldsetClassName,
  isLike,
}: {
  fieldsetClassName?: string;
  filter: string;
  label: string;
  isLike?: boolean;
}) => {
  const searchParams = useSearchParams();
  const defaultValue = (searchParams.get(`filter.${filter}`) || "").replace(/^\$(ilike|eq|in):/, "") || "";
  const router = useRouter();

  const submit = (val: string) =>
    router.replace(
      setPartialParams(
        { [`filter.${filter}`]: val === "" ? "" : `${isLike ? "$ilike:" : "$eq:"}${val}` },
        searchParams,
      ),
    );

  return (
    <label className={cx("floating-label", styles.field, fieldsetClassName)}>
      <span>{label}</span>
      <input
        type="text"
        className="input input-xs"
        placeholder={label}
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.code === "Enter" && e.target instanceof HTMLInputElement) {
            submit(e.target.value);
          }
        }}
        onBlur={(e) => submit(e.target.value)}
      />
    </label>
  );
};

export const FilterPagination = <T extends { data: unknown[]; meta: ResponseMeta }>({
  filter,
  label,
  queryFn,
  queryKey,
  optionLabel,
  optionValue = (m) => (m as { id: number }).id,
  groupBy,
  fieldsetClassName,
}: {
  filter: string;
  fieldsetClassName?: string;
  label: string;
  queryKey: ReadonlyArray<unknown>;
  queryFn: (query: Omit<PaginateQuery<unknown>, "sortBy">) => Promise<T>;
  optionLabel: (model: T["data"][number]) => string;
  optionValue?: (model: T["data"][number]) => string | number;
  groupBy?: (model: T["data"][number]) => string;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = searchParams.has(`filter.${filter}`) ? (parseInt(searchParams.get(`filter.${filter}`)!) ?? null) : null;
  return (
    <SelectPaginatedFromApiField<T>
      label={label}
      fieldSetClassName={cx(styles.field, fieldsetClassName)}
      name={filter}
      size="xs"
      className={value ? "select-neutral" : undefined}
      value={value}
      optionValue={optionValue}
      portalEnabled
      minWidth={200}
      required={false}
      queryFn={queryFn}
      queryKey={queryKey}
      optionLabel={optionLabel}
      groupBy={groupBy}
      onChange={(m) => {
        const value = m ? `${optionValue(m)}` : "";
        if (searchParams.get(filter) === value) {
          return;
        }
        router.replace(setPartialParams({ [`filter.${filter}`]: value }, searchParams));
      }}
    />
  );
};

export const FilterSelectOptions = ({
  filter,
  label,
  options,
  fieldsetClassName,
}: {
  fieldsetClassName?: string;
  filter: string;
  label: string;
  options: { label: string; value: string }[];
}) => {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get(`filter.${filter}`) || "";
  const router = useRouter();
  const [value, setValue] = useState<string | null>(defaultValue ?? null);

  return (
    <label className={cx("floating-label", styles.field, fieldsetClassName)}>
      <span>{label}</span>
      <Select<{ label: string; value: string }>
        placeholder={label}
        name={filter}
        size="xs"
        value={options.find((o) => o.value === value) || null}
        optionLabel={(option) => option.label}
        required={false}
        options={options}
        onChange={(m) => {
          setValue(m?.label ?? null);
          router.replace(setPartialParams({ [`filter.${filter}`]: m?.value ? `${m.value}` : "" }, searchParams));
        }}
      />
    </label>
  );
};

export const FilterOptionsExpandable = ({
  filter,
  label,
  options,
  isVisible,
}: {
  isVisible: boolean;
  fieldsetClassName?: string;
  filter: string;
  label: string;
  options: { label: string; value: string }[];
}) => {
  const searchParams = useSearchParams();
  const values = useMemo(() => {
    const value: string[] = [];
    if (/^\$in:/.test(searchParams.get(`filter.${filter}`) || "")) {
      searchParams
        .get(`filter.${filter}`)
        ?.replace(/\$in:/, "")
        .split(",")
        .forEach((v) => {
          if (options.some((o) => o.value === v)) {
            value.push(v);
          }
        });
    } else {
      const valuesString = searchParams.get(`filter.${filter}`) || "";
      if (options.some((o) => o.value === valuesString)) {
        value.push(valuesString);
      }
    }
    return value;
  }, [searchParams, filter, options]);

  if (isVisible) {
    return (
      <Popover
        showOnHover
        showOnClick
        backgroundColor="bg-base-200"
        borderColor="border-base-300"
        title={(ref, props) => (
          <span
            ref={ref}
            {...props}
            className={cx("btn btn-xs uppercase gap-0.5", { "btn-neutral": values.length > 0 })}
          >
            {label} <ChevronDoubleDownIcon className="size-3" />
          </span>
        )}
      >
        <div className="overflow-auto max-h-96">
          <ul className="menu menu-sm">
            {options.map((option) => (
              <li key={option.value}>
                <Link
                  className={cx({ "bg-base-300/50 font-bold hover:bg-base-300": values.includes(option.value) })}
                  href={setPartialParams({ [`filter.${filter}`]: getOptionValue(option.value, values) }, searchParams)}
                >
                  {option.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Popover>
    );
  }

  return (
    <li>
      <details>
        <summary className={cx({ "font-bold": values.length > 0 })}>
          {label}
          {values.length > 0 && ` (${values.length})`}
        </summary>
        <ul>
          {options.map((option) => (
            <li key={option.value}>
              <Link
                className={cx({ "bg-base-300/50 font-bold hover:bg-base-300": values.includes(option.value) })}
                href={setPartialParams({ [`filter.${filter}`]: getOptionValue(option.value, values) }, searchParams)}
              >
                {option.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
};

export const FilterOptions = ({
  filter,
  options,
  isVisible,
  equals,
}: {
  equals?: boolean;
  isVisible: boolean;
  fieldsetClassName?: string;
  filter: string;
  options: { label: string; value: string }[];
}) => {
  const searchParams = useSearchParams();

  const value = useMemo(() => {
    const defaultValue: string[] = [];
    if (/^\$in:/.test(searchParams.get(`filter.${filter}`) || "")) {
      searchParams
        .get(`filter.${filter}`)
        ?.replace(/\$in:/, "")
        .split(",")
        .forEach((v) => {
          if (options.some((o) => o.value === v)) {
            defaultValue.push(v);
          }
        });
    } else {
      const value = searchParams.get(`filter.${filter}`) || "";
      if (options.some((o) => o.value === value)) {
        defaultValue.push(value);
      }
    }
    return defaultValue;
  }, [searchParams, filter, options]);

  if (isVisible) {
    return (
      <div className="join">
        {options.map((option) => (
          <Link
            key={option.value}
            href={setPartialParams(
              { [`filter.${filter}`]: getOptionValue(option.value, value, { equals }) },
              searchParams,
            )}
            className={cx("btn btn-xs uppercase join-item", { "btn-neutral": value.includes(option.value) })}
          >
            {option.label}
          </Link>
        ))}
      </div>
    );
  }

  return options.map((option) => (
    <li key={option.value}>
      <Link
        className={cx({ "bg-base-300/50 font-bold hover:bg-base-300": value.includes(option.value) })}
        href={setPartialParams({ [`filter.${filter}`]: getOptionValue(option.value, value, { equals }) }, searchParams)}
      >
        {option.label}
      </Link>
    </li>
  ));
};

const getOptionValue = (value: string, values: string[], { equals }: { equals?: boolean } = {}) => {
  let optionValue = "";

  if (equals) {
    optionValue = values[0] === value ? "" : value;
  } else {
    if (values.includes(value)) {
      const vals = values.filter((f) => f !== value);
      if (vals.length > 0) {
        optionValue = `$in:${vals.join(",")}`;
      }
    } else {
      if (values.length === 0) {
        optionValue = value;
      } else {
        optionValue = `$in:${[...values, value].join(",")}`;
      }
    }
  }
  return optionValue;
};
