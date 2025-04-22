/**
 * Displays date with tooltip
 * if includeSeconds is passed, then it will update every:
 *  - second where difference is less than 60 seconds
 *  - 30 seconds where difference is less than an hour
 */
export declare const HumanDate: ({ date, from, includeSeconds, tooltipId, disableTooltip, }: {
    disableTooltip?: boolean;
    tooltipId?: string;
    includeSeconds?: boolean;
    from?: Date;
    date: string | Date;
}) => import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=HumanDate.d.ts.map