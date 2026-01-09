import React from "react";
export declare const TOOLTIP_SIDEBAR_ID = "sidebar";
export type MenuItem = {
    href: string;
    name: string;
    icon: React.ComponentType<{
        className?: string;
    }>;
};
export type MenuItemWithSubmenu = Omit<MenuItem, "href"> & {
    href?: string;
    onClick?: () => void;
    items?: MenuItem[] | (() => React.ReactNode);
};
export declare const SidebarMenu: ({ menu, active, expanded, }: {
    expanded?: boolean;
    active: (item: MenuItemWithSubmenu) => boolean;
    menu: MenuItemWithSubmenu[];
}) => import("react/jsx-runtime").JSX.Element;
export declare const SidebarLayout: ({ sidebarExpanded, onExpandChanged, sideChildren, children, menuIcon, icon, className, }: {
    onExpandChanged: (expanded: boolean) => void;
    sidebarExpanded?: boolean;
    sideChildren: (expanded: boolean) => React.ReactNode;
    menuIcon: (expanded: boolean) => React.ReactNode;
    children: React.ReactNode;
    icon: React.ReactNode;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SidebarMenu.d.ts.map