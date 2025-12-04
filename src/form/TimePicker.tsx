import React, { useEffect, useState } from "react";
import { dateToTimeString, timeToDate } from "@/utils/date";

export const TimePicker = ({
  className,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: {
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onChange: (e: any) => void;
  className?: string;
  value: string | undefined | null;
}) => {
  const formatValue = (value: string | undefined | null) =>
    value ? dateToTimeString(timeToDate(value) || new Date(), "HH:mm") : undefined;

  const [innerValue, setInnerValue] = useState(formatValue(value) || "");

  useEffect(() => {
    setInnerValue(formatValue(value) || "");
  }, [value]);

  return (
    <input
      placeholder={placeholder}
      type="text"
      disabled={disabled}
      required={required}
      className={className}
      value={innerValue}
      onBlur={() => {
        if (innerValue.match(/^\d{2}:\d{2}$/)) {
          onChange({ target: { value: dateToTimeString(timeToDate(innerValue, "HH:mm") || new Date(), "HH:mm:ss") } });
        } else {
          setInnerValue(formatValue(value) || "");
        }
      }}
      onChange={(e) => {
        setInnerValue(e.target.value);
        if (e.target.value.match(/^\d{2}:\d{2}$/)) {
          onChange({
            target: { value: dateToTimeString(timeToDate(e.target.value, "HH:mm") || new Date(), "HH:mm:ss") },
          });
        }
      }}
    />
  );
};
