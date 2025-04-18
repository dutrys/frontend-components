import { useEffect, useState } from "react";
import { isValid, parseJSON, format as formatDateFns } from "date-fns";

export const DateTime = ({ date, format = "yyyy-MM-dd HH:mm:ss" }: { date: string; format?: string }) => {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const fromDate = parseJSON(date);
    if (isValid(fromDate)) {
      setFormattedDate(formatDateFns(fromDate, format));
    }
  }, [date, format]);

  return formattedDate;
};
