import React from "react";
export declare const ActionButtons: ({ id, archive, edit, view, pathname, }: {
    pathname: string;
    id: number | string;
    view?: string | false;
    edit?: string | false;
    archive?: string | false;
}) => import("react/jsx-runtime").JSX.Element;
export declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs";
}) => import("react/jsx-runtime").JSX.Element;
export declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs";
}) => import("react/jsx-runtime").JSX.Element;
export declare const ArchiveButton: (props: {
    size?: "xs";
    onClick?: (e: MouseEvent) => void;
    href?: string;
    tooltipId?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const ActionButton: ({ tooltipId, icon, tooltip, className, size, ...props }: {
    size?: "xs";
    href?: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    tooltipId?: string;
    icon: React.ElementType;
    tooltip: React.ReactNode;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ActionButtons.d.ts.map