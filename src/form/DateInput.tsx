import * as React from "react";
import { ComponentProps, useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import styles from "./DatePicker.module.css";
import { XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { DateRange, DayPicker, Matcher } from "react-day-picker";
import { enGB, lt } from "react-day-picker/locale";
import { Popover } from "../dialog/Popover";
import cx from "classnames";
import { FocusTrap, FocusTrapFeatures } from "@headlessui/react";

const formatDate = (date: Date | null | undefined) => {
  if (!date) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
};

export type DateInputProps = Omit<
  React.ComponentPropsWithoutRef<"input">,
  "size" | "value" | "defaultValue" | "defaultChecked" | "onChange"
> & {
  size?: "sm" | "xs";
  required?: boolean;
  disabled?: boolean;
  value: Date | null;
  className?: string;
  toggleClassName?: string;
  placeholder?: string;
  onChange: (date: Date | null) => unknown;
  matcher?: Matcher;
  modifiers?: Record<string, Matcher | Matcher[] | undefined> | undefined;
};

export const DateInput = ({
  onChange,
  value,
  className,
  toggleClassName,
  required,
  disabled,
  size,
  placeholder,
  matcher,
  modifiers,
  ...rest
}: DateInputProps) => {
  const [dateString, setDateString] = useState(value ? formatDate(value) : "");
  const params = useParams();
  useEffect(() => {
    setDateString(value ? formatDate(value) : "");
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <FocusTrap className="grow" features={isOpen ? FocusTrapFeatures.FocusLock : FocusTrapFeatures.None}>
      <Popover
        showOnClick
        showOnFocus
        showOnHover={false}
        onShow={(open) => setIsOpen(open)}
        title={(ref, popoverProps) => (
          <div
            ref={ref}
            {...rest}
            {...popoverProps}
            className={cx(
              "input input-bordered",
              {
                "input-xs pl-3 pr-1 gap-0.5": size === "xs",
                "input-sm pl-3 pr-2 gap-1": size === "sm",
                ["w-full"]: !className?.includes("w-"),
              },
              className,
            )}
          >
            <input
              value={dateString}
              className="grow"
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setDateString("");
                  onChange(null);
                  return;
                }
                if (e.target.value.length > 10) {
                  return;
                }
                setDateString(e.target.value);
                if (e.target.value.length !== 10) {
                  return;
                }
                const date = parse(e.target.value, "yyyy-MM-dd", new Date());
                if (isValid(date)) {
                  onChange(date);
                }
              }}
              onBlur={(e) => {
                const date = parse(dateString, "yyyy-MM-dd", new Date());
                if (isValid(date)) {
                  onChange(date);
                }
                rest.onBlur?.(e);
              }}
            />

            {required || !value ? (
              <div className={cx(toggleClassName, "cursor-pointer")}>
                <CalendarIcon className="size-4" />
              </div>
            ) : (
              <button
                type="button"
                disabled={!required && !value}
                className={cx("cursor-pointer", toggleClassName)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChange(null);
                }}
              >
                <XMarkIcon className="size-4" />
              </button>
            )}
          </div>
        )}
      >
        {(close) => (
          <DayPicker
            className={`react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`}
            captionLayout="label"
            mode="single"
            locale={params.locale === "lt" ? lt : enGB}
            showOutsideDays
            disabled={matcher}
            weekStartsOn={1}
            modifiers={modifiers}
            selected={value || undefined}
            defaultMonth={value || undefined}
            onSelect={(day) => {
              onChange(day || null);
              close();
            }}
          />
        )}
      </Popover>
    </FocusTrap>
  );
};

export type DateRangeInputProps = Omit<DateInputProps, "onChange" | "value"> & {
  onChange: (date: DateRange | null) => unknown;
  value: DateRange | null;
};

export const DateRangeInput = ({
  onChange,
  value,
  className,
  toggleClassName,
  required,
  disabled,
  size,
  modifiers,
  placeholder,
  matcher,
  ...rest
}: DateRangeInputProps) => {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <FocusTrap className="grow" features={isOpen ? FocusTrapFeatures.FocusLock : FocusTrapFeatures.None}>
      <Popover
        showOnClick
        showOnFocus
        showOnHover={false}
        onShow={(open) => setIsOpen(open)}
        title={(ref, popoverProps) => (
          <div
            ref={ref}
            {...rest}
            {...popoverProps}
            className={cx(
              "input input-bordered",
              {
                "input-xs pl-3 pr-1 gap-0.5": size === "xs",
                "input-sm pl-3 pr-2 gap-1": size === "sm",
                ["w-full"]: !className?.includes("w-"),
              },
              className,
            )}
          >
            <input
              value={value ? `${formatDate(value.from)} - ${formatDate(value.to)}` : ""}
              className="grow"
              required={required}
              disabled={disabled}
              placeholder={placeholder}
              onChange={(e) => {}}
            />

            {required || !value ? (
              <div className={cx(toggleClassName, "cursor-pointer")}>
                <CalendarIcon className="size-4" />
              </div>
            ) : (
              <button
                type="button"
                disabled={!required && !value}
                className={cx("cursor-pointer", toggleClassName)}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onChange(null);
                }}
              >
                <XMarkIcon className="size-4" />
              </button>
            )}
          </div>
        )}
      >
        {() => (
          <DayPicker
            className={`react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`}
            captionLayout="label"
            mode="range"
            locale={params.locale === "lt" ? lt : enGB}
            showOutsideDays
            disabled={matcher}
            weekStartsOn={1}
            numberOfMonths={2}
            selected={value ?? undefined}
            defaultMonth={value?.from ?? undefined}
            modifiers={modifiers}
            onSelect={(range) => {
              onChange(range ?? null);
            }}
          />
        )}
      </Popover>
    </FocusTrap>
  );
};
