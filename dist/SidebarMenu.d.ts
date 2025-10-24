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
export declare const SidebarMenu: ({ menu, active, }: {
    active: (item: MenuItemWithSubmenu) => boolean;
    menu: MenuItemWithSubmenu[];
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SidebarMenu.d.ts.map