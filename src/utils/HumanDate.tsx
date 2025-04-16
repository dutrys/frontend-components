import React from "react";
import {
  differenceInDays,
  differenceInMinutes,
  differenceInSeconds,
  format,
  formatDistance,
  isValid,
  parseJSON,
} from "date-fns";
import { lt } from "date-fns/locale";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { TOOLTIP_GLOBAL_ID } from "./Toaster";
import { dateToStringDate } from "@/utils/datetime";

/**
 * Displays date with tooltip
 * if includeSeconds is passed, then it will update every:
 *  - second where difference is less than 60 seconds
 *  - 30 seconds where difference is less than an hour
 */
export const HumanDate = ({
  date,
  from = new Date(),
  includeSeconds = false,
  tooltipId = TOOLTIP_GLOBAL_ID,
  disableTooltip,
}: {
  disableTooltip?: boolean;
  tooltipId?: string;
  includeSeconds?: boolean;
  from?: Date;
  date: string | Date;
}) => {
  const params = useParams();
  const t = useTranslations();
  const dateDate: Date = typeof date === "string" ? parseJSON(date) : date;
  const [show, setShow] = useState(false);
  const formatDateTime = useCallback(() => {
    if (!dateDate || !isValid(dateDate)) {
      return "";
    }
    const diffInSeconds = differenceInSeconds(from ? from : new Date(), dateDate);
    if (includeSeconds && diffInSeconds < 60) {
      return t("dateTime.lessThanSeconds", { seconds: diffInSeconds });
    }
    return formatDistance(dateDate, from ? from : new Date(), {
      addSuffix: true,
      locale: params.locale === "lt" ? lt : undefined,
    });
  }, [includeSeconds, t, params, from, dateDate]);
  const [dateString, setDateString] = useState<string>(formatDateTime());

  useEffect(() => {
    if (!dateDate || !isValid(dateDate)) {
      return;
    }
    let interval: NodeJS.Timer | undefined = undefined;
    const diffMinutes = Math.abs(differenceInMinutes(dateDate, from ? from : new Date()));
    if (includeSeconds && diffMinutes < 60) {
      interval = setInterval(
        () => {
          const newDateString = formatDateTime();
          if (dateString !== newDateString) {
            setDateString(formatDateTime());
          }
        },
        diffMinutes < 1 ? 1000 : 30000,
      );
    }
    setShow(true);
    return () => {
      if (typeof interval === "number") {
        clearInterval(interval);
      }
    };
  }, [includeSeconds, dateString, dateDate, setDateString, from, formatDateTime]);

  if (!dateDate || !isValid(dateDate) || !show) {
    return null;
  }

  const displayDate = dateDate && differenceInDays(new Date(), dateDate) > 7;
  return (
    <>
      <span
        data-testid="datewithtooltip"
        className={`date-with-tooltip-${dateDate.getTime()}`}
        data-tooltip-id={disableTooltip ? undefined : tooltipId}
        data-tooltip-content={
          disableTooltip ? undefined : format(dateDate, displayDate ? "HH:mm:ss" : "yyyy-MM-dd HH:mm:ss")
        }
      >
        {displayDate ? dateToStringDate(dateDate) : dateString}
      </span>
    </>
  );
};
