import React from "react";
export declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => import("react/jsx-runtime").JSX.Element;
export declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => import("react/jsx-runtime").JSX.Element;
export type MoreActionType = {
    label: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
    onClick?: () => Promise<string | void>;
    href?: string;
    hidden?: boolean;
    enableWhenSpaceIsAvailable?: boolean;
    disableNProgress?: boolean;
    disabled?: boolean;
    testId?: string;
};
export declare const MoreActions: ({ className, actions }: {
    className?: string;
    actions: MoreActionType[];
}) => import("react/jsx-runtime").JSX.Element | null;
export declare const ArchiveButton: (props: {
    size?: "xs" | "sm" | "lg" | "xl";
    onClick?: (e: MouseEvent) => void;
    href?: string;
    tooltipId?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ActionButton: ({ tooltipId, icon, tooltip, className, size, ...props }: {
    size?: "xs" | "sm" | "lg" | "xl";
    href?: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    tooltipId?: string;
    icon: React.ElementType;
    tooltip: React.ReactNode;
    prefetch?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ActionButtons.d.ts.map