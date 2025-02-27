import * as React from "react";
import { useEffect, useState } from "react";
import { format, isValid, parse } from "date-fns";
import styles from "./DatetimePicker.module.css";
import { ClockIcon, XMarkIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Popover } from "./Popover";
import { useParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { enGB, lt } from "react-day-picker/locale";
const formatDate = (date) => {
    if (!date) {
        return "";
    }
    return format(date, "yyyy-MM-dd");
};
export const DatePicker = ({ onChange, value, inputClassName = "input input-bordered", toggleClassName = "", allowEmpty, disabled, placeholder, }) => {
    const [dateString, setDateString] = useState(value ? formatDate(value) : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? formatDate(value) : "");
    }, [value]);
    return (<div className={`w-full ${inputClassName}`}>
      <Popover showOnClick showOnFocus showOnHover={false} popoverWidth="" title={(ref, props) => (<input ref={ref} {...props} value={dateString} className="grow" disabled={disabled} placeholder={placeholder} onChange={(e) => {
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
            }} onBlur={() => {
                const date = parse(dateString, "yyyy-MM-dd", new Date());
                if (isValid(date)) {
                    onChange(date);
                }
            }}/>)}>
        {(close) => (<DayPicker className={`react-day-picker bg-transparent border-none text-white ${styles.dayPicker}`} captionLayout="dropdown" mode="single" locale={params.locale === "lt" ? lt : enGB} showOutsideDays weekStartsOn={1} selected={value || undefined} onSelect={(day) => {
                onChange(day || null);
                close();
            }}/>)}
      </Popover>
      {allowEmpty ? (<button disabled={allowEmpty && !value} className={toggleClassName} onClick={() => onChange(null)}>
          {value ? <XMarkIcon className="size-4"/> : <ClockIcon className="size-4"/>}
        </button>) : (<div className={`cursor-pointer ${toggleClassName}`}>
          <CalendarIcon className="size-4"/>
        </div>)}
    </div>);
};
//# sourceMappingURL=DatePicker.jsx.map