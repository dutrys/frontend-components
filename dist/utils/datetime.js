import { format, isValid, parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
export function timeInUtcStringToDate(stopFromArrivalTime) {
    const date = parse(stopFromArrivalTime, "HH:mm:ss", new Date());
    if (isValid(date)) {
        return fromZonedTime(date, "UTC");
    }
    return null;
}
export function convertTimeToUtcString(time, timeFormat = "HH:mm:ss") {
    const date = parse(time, "HH:mm:ss", new Date());
    if (isValid(date)) {
        return format(fromZonedTime(date, "UTC"), timeFormat);
    }
    return undefined;
}
export const stringToTime = (time) => {
    let parsed = parse(time, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
export const timeToDate = (date, format = "HH:mm:ss") => {
    let parsed = parse(date, format, new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
export const dateToTimeString = (date, timeFormat = "HH:mm:ss") => format(date, timeFormat);
export const stringToDate = (date, timeZone) => {
    let parsed = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
    if (timeZone) {
        parsed = fromZonedTime(date, timeZone);
    }
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
export const dateToString = (date, timeZone) => {
    if (!timeZone) {
        return format(date, "yyyy-MM-dd HH:mm:ss");
    }
    return format(toZonedTime(date, timeZone), "yyyy-MM-dd HH:mm:ss");
};
export const dateToStringDate = (date) => {
    return format(date, "yyyy-MM-dd");
};
//# sourceMappingURL=datetime.js.map