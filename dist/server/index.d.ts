import { ReadonlyURLSearchParams } from 'next/navigation';

declare const parseDateTime: (date: string, defaultValue?: unknown) => Date | unknown;
declare const getBtwDates: (btw: string | string[]) => null | [Date, Date];

declare const setPartialParams: (partialParams: Record<string, number | string | string[]>, searchParams: ReadonlyURLSearchParams | null) => string;

export { getBtwDates, parseDateTime, setPartialParams };
