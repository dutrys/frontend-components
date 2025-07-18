import React from "react";
export declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => import("react/jsx-runtime").JSX.Element;
export declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => import("react/jsx-runtime").JSX.Element;
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
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ActionButtons.d.ts.map