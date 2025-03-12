import { useEffect, useRef, useState } from "react";
import { format, isSameDay, isSameHour, isValid, parse } from "date-fns";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./DatePicker.module.css";
import { ClockIcon, XMarkIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { Popover } from "../dialog/Popover";
import { DayPicker, Matcher } from "react-day-picker";
import { enGB, lt } from "react-day-picker/locale";

export function DateTimePicker({
  value,
  onChange,
  allowEmpty,
  disabled,
  required,
  from,
  to,
  placeholder,
  inputClassName = "input input-bordered",
  toggleClassName = "",
  ...rest
}: {
  required?: boolean;
  disabled?: boolean;
  allowEmpty?: boolean;
  inputClassName?: string;
  placeholder?: string;
  toggleClassName?: string;
  from?: Date;
  to?: Date;
  value: Date | null;
  onChange: (value: Date | null) => void;
}) {
  const [dateString, setDateString] = useState(value ? format(value, "yyyy-MM-dd HH:mm") : "");
  const params = useParams();
  useEffect(() => {
    setDateString(value ? format(value, "yyyy-MM-dd HH:mm") : "");
  }, [value]);

  const [valueTemp, setValueTemp] = useState<Date | null>(value);
  useEffect(() => {
    setValueTemp(value);
  }, [value]);

  const minutesRef = useRef<HTMLUListElement | null>(null);
  const hoursRef = useRef<HTMLUListElement | null>(null);
  useEffect(() => {
    setDateString(valueTemp ? format(valueTemp, "yyyy-MM-dd HH:mm") : "");
    try {
      if (valueTemp) {
        minutesRef.current
          ?.querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        hoursRef.current
          ?.querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (_) {}
  }, [valueTemp]);

  const t = useTranslations();
  let matcher: Matcher | undefined = undefined;
  if (from && to) {
    matcher = { before: from, after: to };
  }
  if (from) {
    matcher = { before: from };
  }
  if (to) {
    matcher = { after: to };
  }
  return (
    <label className={`w-full ${inputClassName}`}>
      <Popover
        title={(ref, props) => (
          <input
            required={required}
            {...rest}
            value={dateString}
            className="grow"
            disabled={disabled}
            ref={ref}
            placeholder={placeholder}
            onChange={(e) => {
              setDateString(e.target.value);
              if (e.target.value.length !== 16) {
                return;
              }
              const date = parse(e.target.value, "yyyy-MM-dd HH:mm", new Date());
              if (isValid(date)) {
                setValueTemp(date);
              }
            }}
            {...props}
            onBlur={(e) => {
              const date = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
              if (isValid(date)) {
                onChange(date);
              }
              if (typeof props?.onBlur === "function") {
                props.onBlur(e);
              }
            }}
          />
        )}
        onShow={(open) => {
          if (!open) {
            onChange(valueTemp);
            return;
          }
          if (minutesRef.current && hoursRef.current && valueTemp) {
            try {
              minutesRef.current
                .querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
                ?.scrollIntoView({ behavior: "instant", block: "center" });
              hoursRef.current
                .querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
                ?.scrollIntoView({ behavior: "instant", block: "center" });
            } catch (_) {}
          }
        }}
        showOnClick
        showOnFocus
        showOnHover={false}
        popoverWidth=""
      >
        {(close) => (
          <>
            <div className="flex">
              <DayPicker
                className={`react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`}
                captionLayout="dropdown"
                mode="single"
                locale={params.locale === "lt" ? lt : enGB}
                showOutsideDays
                weekStartsOn={1}
                disabled={matcher}
                selected={valueTemp || undefined}
                defaultMonth={valueTemp || new Date()}
                onSelect={(day) => {
                  day?.setHours((valueTemp || new Date()).getHours(), (valueTemp || new Date()).getMinutes() || 0);
                  if (from && day && from > day) {
                    day.setHours(from.getHours(), from.getMinutes());
                  }

                  if (to && day && to < day) {
                    day.setHours(to.getHours(), to.getMinutes());
                  }

                  setValueTemp(day || null);
                }}
              />
              <div>
                <div className="text-white text-center pt-5 pb-4 text-xs">{t("datePicker.time")}:</div>
                <div className="flex">
                  <ul className="h-53 mx-1 overflow-y-scroll" ref={hoursRef}>
                    {new Array(24).fill(0).map((_, hour) => (
                      <li data-hour={hour} key={hour}>
                        {(from && valueTemp && isSameDay(from, valueTemp) && from.getHours() > hour) ||
                        (to && valueTemp && isSameDay(to, valueTemp) && to.getHours() < hour) ? (
                          <></>
                        ) : (
                          <button
                            className={`text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getHours() === hour ? "bg-primary-500" : "hover:bg-white"}`}
                            onClick={() => {
                              const date = new Date(valueTemp || new Date());
                              date.setHours(hour);
                              setValueTemp(date);
                            }}
                          >
                            {hour < 10 ? `0${hour}` : hour}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                  <ul className="h-53 mx-1 overflow-y-scroll" ref={minutesRef}>
                    {new Array(60).fill(0).map((_, minute) => (
                      <li data-minute={minute} key={minute}>
                        {(from && valueTemp && isSameHour(from, valueTemp) && from.getMinutes() > minute) ||
                        (to && valueTemp && isSameHour(to, valueTemp) && to.getMinutes() < minute) ? (
                          <></>
                        ) : (
                          <button
                            onClick={() => {
                              const date = new Date(valueTemp || new Date());
                              date.setMinutes(minute);
                              setValueTemp(date);
                            }}
                            className={`text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getMinutes() === minute ? "bg-primary-500" : "hover:bg-white"}`}
                          >
                            {minute + 1 < 10 ? `0${minute}` : minute}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center pb-2">
              <button
                className="btn btn-xs mx-auto w-30"
                type="button"
                onClick={() => {
                  onChange(valueTemp);
                  close();
                }}
              >
                {t("datePicker.ok")}
              </button>
            </div>
          </>
        )}
      </Popover>
      {allowEmpty ? (
        <button disabled={allowEmpty && !value} className={toggleClassName} onClick={() => onChange(null)}>
          {value ? <XMarkIcon className="size-4" /> : <ClockIcon className="size-4" />}
        </button>
      ) : (
        <div className={`cursor-pointer ${toggleClassName}`}>
          <ClockIcon className="size-4" />
        </div>
      )}
    </label>
  );
}
