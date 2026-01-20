import { format, isValid, parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const timeInUtcStringToDate = (stopFromArrivalTime: string): Date | null => {
  const date = parse(stopFromArrivalTime, "HH:mm:ss", new Date());
  if (isValid(date)) {
    return fromZonedTime(date, "UTC");
  }
  return null;
};

export const convertTimeToUtcString = (time: string, timeFormat = "HH:mm:ss"): string | undefined => {
  const date = parse(time, "HH:mm:ss", new Date());
  if (isValid(date)) {
    return format(fromZonedTime(date, "UTC"), timeFormat);
  }
  return undefined;
};

export const stringToTime = (time: string): Date | undefined => {
  const parsed: Date = parse(time, "yyyy-MM-dd HH:mm:ss", new Date());
  if (isValid(parsed)) {
    parsed.setMilliseconds(0);
    return parsed;
  }
  return undefined;
};

export const timeToDate = (date: string, format = "HH:mm:ss") => {
  const parsed: Date = parse(date, format, new Date());
  if (isValid(parsed)) {
    parsed.setMilliseconds(0);
    return parsed;
  }
  return undefined;
};

export const dateToTimeString = (date: Date, timeFormat = "HH:mm:ss") => format(date, timeFormat);

export const stringToDate = (date: string, timeZone?: string): Date | undefined => {
  let parsed: Date = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
  if (timeZone) {
    parsed = fromZonedTime(date, timeZone);
  }

  if (isValid(parsed)) {
    parsed.setMilliseconds(0);
    return parsed;
  }
  return undefined;
};

export const dateToString = (date: Date, timeZone?: string) => {
  if (!timeZone) {
    return format(date, "yyyy-MM-dd HH:mm:ss");
  }
  return format(toZonedTime(date, timeZone), "yyyy-MM-dd HH:mm:ss");
};
export const dateToStringDate = (date: Date) => format(date, "yyyy-MM-dd");
