import React from "react";
import cx from "classnames";
import { Popover } from "@/dialog/Popover";
import { Link } from "@/pagination/Link";

export const TOOLTIP_SIDEBAR_ID = "sidebar";

export type MenuItem = {
  href: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type MenuItemWithSubmenu = Omit<MenuItem, "href"> & {
  href?: string;
  onClick?: () => void;
  items?: MenuItem[] | (() => React.ReactNode);
};

const Item = ({
  item,
  active,
  children,
  disableTooltip,
  forceHover,
}: {
  disableTooltip?: boolean;
  forceHover?: boolean;
  children?: React.ReactNode;
  active?: boolean;
  item: MenuItemWithSubmenu;
}) => (
  <div className="flex flex-col items-center text-gray-400 hover:text-white" key={item.href}>
    <Link
      href={item.href || "/"}
      prefetch={false}
      onClick={
        item.onClick
          ? (e) => {
              e.preventDefault();
              item.onClick!();
            }
          : undefined
      }
      data-tooltip-id={TOOLTIP_SIDEBAR_ID}
      data-tooltip-content={disableTooltip ? undefined : item.name}
      aria-description={disableTooltip ? undefined : item.name}
      className={cx("flex items-center text-center w-full py-3 hover:bg-neutral-700 cursor-pointer", {
        "text-primary bg-base-300": active,
        "bg-neutral-700 text-white": forceHover,
      })}
    >
      <div className="w-16 sm:w-24">
        <item.icon className="size-7 mx-auto" />
      </div>
      <div className="sm:hidden">{item.name}</div>
      {children}
    </Link>
  </div>
);

export const SidebarMenu = ({
  menu,
  active,
}: {
  active: (item: MenuItemWithSubmenu) => boolean;
  menu: MenuItemWithSubmenu[];
}) => (
  <div>
    {menu.map((i) => {
      if (i.items) {
        return (
          <Popover
            key={i.name}
            placement="right-start"
            title={(ref, props, isOpen) => (
              <div ref={ref}>
                <Item
                  disableTooltip
                  item={i}
                  active={active(i) || (Array.isArray(i.items) && i.items!.some((i) => active(i)))}
                  forceHover={isOpen}
                />
              </div>
            )}
          >
            {(close) => (
              <div data-theme="dim" className="bg-transparent">
                {Array.isArray(i.items) ? (
                  <>
                    <div className="text-sm text-center py-1">{i.name}</div>
                    <ul className="menu menu-sm px-1 pt-0 pb-0">
                      {i.items?.map((sub, i) => (
                        <li key={i}>
                          <Link href={sub.href} onClick={close}>
                            <sub.icon className="size-4" />
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  i.items!()
                )}
              </div>
            )}
          </Popover>
        );
      }

      return <Item item={i} key={`${i.name}-${i.href}`} active={active(i)} />;
    })}
  </div>
);
