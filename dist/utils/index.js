'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { format, parseJSON, isValid, differenceInSeconds, formatDistance, differenceInMinutes, differenceInDays } from 'date-fns';
import { lt } from 'date-fns/locale';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast, { useToasterStore, Toaster as Toaster$1, resolveValue } from 'react-hot-toast';
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import 'date-fns-tz';

const options = {
    loading: {
        classNames: "bg-blue-100 dark:text-blue-200 text-blue-500 dark:bg-blue-800",
        icon: jsx("span", { className: "loading loading-infinity loading-xs" }),
    },
    error: {
        classNames: "bg-red-100 dark:text-red-200 text-red-500 dark:bg-red-800",
        icon: jsx(ExclamationCircleIcon, { width: 15 }),
    },
    success: {
        classNames: "bg-green-100 dark:text-green-200 text-green-500 dark:bg-green-800",
        icon: jsx(CheckCircleIcon, { width: 15 }),
    },
    warn: {
        classNames: "bg-orange-100 dark:text-orange-200 text-orange-500 dark:bg-orange-800",
        icon: jsx(ExclamationTriangleIcon, { width: 15 }),
    },
};
const TOOLTIP_GLOBAL_ID = "global";
function Toaster() {
    const { toasts } = useToasterStore();
    // Enforce Limit (1 toast)
    React.useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= 1)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);
    return (jsxs(Fragment, { children: [jsx(Tooltip, { id: TOOLTIP_GLOBAL_ID, place: "top" }), jsx(Toaster$1, { position: "top-center", children: (t) => {
                    const type = options[t.type] || options.success;
                    return (jsxs("div", { "data-testid": "toast", onClick: () => toast.remove(t.id), className: "cursor-pointer flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800", role: "alert", children: [t.icon ? (t.icon) : (jsxs("div", { className: `inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${type.classNames} ${t.className}`, children: [type.icon, jsx("span", { className: "sr-only", children: t.type })] })), jsx("div", { className: "ml-3 text-sm font-normal sentry-unmask", children: resolveValue(t.message, t) })] }));
                } })] }));
}

const dateToStringDate = (date) => {
    return format(date, "yyyy-MM-dd");
};

/**
 * Displays date with tooltip
 * if includeSeconds is passed, then it will update every:
 *  - second where difference is less than 60 seconds
 *  - 30 seconds where difference is less than an hour
 */
const HumanDate = ({ date, from = new Date(), includeSeconds = false, tooltipId = TOOLTIP_GLOBAL_ID, disableTooltip, }) => {
    const params = useParams();
    const t = useTranslations();
    const dateDate = typeof date === "string" ? parseJSON(date) : date;
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
    const [dateString, setDateString] = useState(formatDateTime());
    useEffect(() => {
        if (!dateDate || !isValid(dateDate)) {
            return;
        }
        let interval = undefined;
        const diffMinutes = Math.abs(differenceInMinutes(dateDate, from ? from : new Date()));
        if (includeSeconds && diffMinutes < 60) {
            interval = setInterval(() => {
                const newDateString = formatDateTime();
                if (dateString !== newDateString) {
                    setDateString(formatDateTime());
                }
            }, diffMinutes < 1 ? 1000 : 30000);
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
    return (jsx(Fragment, { children: jsx("span", { "data-testid": "datewithtooltip", className: `date-with-tooltip-${dateDate.getTime()}`, "data-tooltip-id": disableTooltip ? undefined : tooltipId, "data-tooltip-content": disableTooltip ? undefined : format(dateDate, displayDate ? "HH:mm:ss" : "yyyy-MM-dd HH:mm:ss"), children: displayDate ? dateToStringDate(dateDate) : dateString }) }));
};

const getPreviousPageParam = (page) => !page?.meta || page?.meta?.currentPage === 1 ? undefined : page.meta.currentPage - 1;
const getNextPageParam = (page) => !page?.meta || page?.meta?.currentPage >= page.meta?.totalPages ? undefined : page.meta.currentPage + 1;
const setPartialParams = (partialParams, searchParams) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.keys(partialParams).forEach((key) => {
        const value = partialParams[key].toString();
        if (value === "" || !value) {
            params.delete(key);
        }
        else {
            params.set(key, value);
        }
    });
    return `?${params}`;
};
const isParamActive = (link, searchParams) => {
    for (const key in link) {
        if (link[key] === "" && !searchParams.has(key)) {
            continue;
        }
        if (link[key] !== searchParams.get(key)) {
            return false;
        }
    }
    return true;
};

const DateTime = ({ date, format: format$1 = "yyyy-MM-dd HH:mm:ss" }) => {
    const [formattedDate, setFormattedDate] = useState(null);
    useEffect(() => {
        const fromDate = parseJSON(date);
        if (isValid(fromDate)) {
            setFormattedDate(format(fromDate, format$1));
        }
    }, [date, format$1]);
    return formattedDate;
};

export { DateTime, HumanDate, TOOLTIP_GLOBAL_ID, Toaster, getNextPageParam, getPreviousPageParam, isParamActive, setPartialParams };
//# sourceMappingURL=index.js.map
