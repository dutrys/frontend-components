import React, { useState } from "react";
import cx from "classnames";
import { Popover } from "./dialog/Popover";
import { Link } from "./pagination/Link";
import { ScreenSize, useScreenSize } from "./useScreenSize";
import { Tooltip } from "react-tooltip";
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/outline";

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
  expanded,
}: {
  expanded?: boolean;
  disableTooltip?: boolean;
  forceHover?: boolean;
  children?: React.ReactNode;
  active?: boolean;
  item: MenuItemWithSubmenu;
}) => (
  <li>
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
      data-tooltip-id={expanded ? undefined : TOOLTIP_SIDEBAR_ID}
      data-tooltip-content={expanded ? undefined : disableTooltip ? undefined : item.name}
      aria-description={disableTooltip ? undefined : item.name}
      className={cx("hover:bg-white/10 text-white/80 hover:text-white", {
        "bg-white/20": active,
        "justify-center items-center": !expanded,
        "bg-white/10 text-white": forceHover,
      })}
    >
      <item.icon className={cx("mx-auto", { "size-5": expanded, "size-7": !expanded })} />
      {expanded && item.name}
      {children}
    </Link>
  </li>
);

export const SidebarMenu = ({
  menu,
  active,
  expanded,
}: {
  expanded?: boolean;
  active: (item: MenuItemWithSubmenu) => boolean;
  menu: MenuItemWithSubmenu[];
}) => (
  <ul className={cx("menu w-full")}>
    {menu.map((item, i) => {
      if (item.items && !expanded) {
        return (
          <Popover
            key={`${item.name}-${i}`}
            backgroundColor="bg-nav-popover/95"
            placement="right-start"
            arrowSize={{ width: 10, height: 5 }}
            title={(ref, props, isOpen) => (
              <div ref={ref}>
                <Item
                  disableTooltip
                  item={item}
                  active={active(item) || (Array.isArray(item.items) && item.items!.some((i) => active(i)))}
                  forceHover={isOpen}
                />
              </div>
            )}
          >
            {(close) => (
              <div data-theme="dim" className="bg-transparent">
                {Array.isArray(item.items) ? (
                  <>
                    <div className="text-xs text-center p-2 pb-0 text-white">{item.name}</div>
                    <ul className="menu menu-sm p-1">
                      {item.items?.map((sub, i) => (
                        <li key={i}>
                          <Link href={sub.href} onClick={close} className="text-white">
                            <sub.icon className="size-4" />
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  item.items!()
                )}
              </div>
            )}
          </Popover>
        );
      }

      if (expanded && Array.isArray(item.items)) {
        const isActive = item.items.some((s) => active(s));
        return (
          <li key={`${item.name}-${i}`}>
            <details
              className={cx({ "rounded-box bg-gradient-to-b from-white/20 to-white/5": isActive })}
              open={isActive}
            >
              <summary className="hover:bg-white/10 text-white/80 hover:text-white">
                <item.icon className="mx-auto size-5" />
                {item.name}
              </summary>
              <ul>
                {item.items.map((sub, i) => (
                  <Item expanded={expanded} key={`${i}-${sub.name}`} item={sub} active={active(sub)} />
                ))}
              </ul>
            </details>
          </li>
        );
      }

      return <Item key={`${item.name}-${i}`} expanded={expanded} item={item} active={active(item)} />;
    })}
  </ul>
);

export const SidebarLayout = ({
  sidebarExpanded,
  onExpandChanged,
  sideChildren,
  children,
  menuIcon,
  icon,
  className,
}: {
  onExpandChanged: (expanded: boolean) => void;
  sidebarExpanded?: boolean;
  sideChildren: (expanded: boolean) => React.ReactNode;
  menuIcon: (expanded: boolean) => React.ReactNode;
  children: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const screenSize = useScreenSize();
  const [expanded, setMenuExpanded] = React.useState(sidebarExpanded ?? false);
  const menuExpanded = expanded || (screenSize === ScreenSize.xs && showSidebar);

  return (
    <div
      className={cx("flex flex-row h-full [--sidebar-width:0rem]", className, {
        "sidebar-expanded sm:[--sidebar-width:15rem]": menuExpanded,
        "sm:[--sidebar-width:6rem]": !menuExpanded,
      })}
    >
      {showSidebar && (
        <div
          className="sm:hidden absolute left-0 top-0 bg-black/50 w-full h-full"
          style={{ zIndex: 1000 }}
          onClick={() => setShowSidebar(!expanded)}
        />
      )}
      <div className="sm:hidden absolute h-16 flex items-center" style={{ zIndex: 1000 }}>
        <span onChange={() => setShowSidebar(!showSidebar)}>{icon}</span>
        <label className="px-2 sm:hidden text-black ml-2 mr-2 swap swap-rotate">
          <input type="checkbox" checked={showSidebar} onChange={() => setShowSidebar(!showSidebar)} />

          <svg
            className="swap-off fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
          </svg>

          <svg
            className="swap-on fill-current"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 512 512"
          >
            <polygon points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
          </svg>
        </label>
      </div>
      <div
        style={{ zIndex: 1001 }}
        className={cx(
          "print:hidden fixed sm:static left-0 top-0 h-full sm:inline-flex transition-[translate] duration-500 ease-in-out",
          { "-translate-x-60 sm:translate-x-0": !showSidebar },
        )}
      >
        <div
          className={cx(
            "relative z-50 shrink-0 column-1 p-2 h-full justify-center transition-[width] duration-500 ease-in-out overflow-hidden",
            { "w-60": menuExpanded, "w-24": !menuExpanded },
          )}
        >
          <div className="rounded-box flex flex-col h-full overflow-auto pt-14 bg-navigation group">
            <div className="absolute w-full h-18 left-0 top-2 z-1000">
              <div className=" rounded-box h-18 mx-2 pl-4 pt-5 bg-gradient-to-b from-[50%] from-navigation to-transparent">
                {menuIcon(menuExpanded)}
              </div>
            </div>
            <button
              onClick={() => {
                setMenuExpanded(!menuExpanded);
                onExpandChanged(!menuExpanded);
              }}
              className={cx(
                "hidden sm:flex absolute top-8 right-0 z-1001 justify-center btn btn-xs btn-circle border-white/40 hover:border-white text-white/70 hover:text-white bg-navigation transition-[translate,opacity] duration-200 ease-in-out group-hover:opacity-100",
                { "-translate-x-8": expanded, "opacity-0 right-0": !expanded },
              )}
            >
              {menuExpanded ? (
                <ChevronDoubleLeftIcon className="size-4" />
              ) : (
                <ChevronDoubleRightIcon className="size-4" />
              )}
            </button>
            {sideChildren(menuExpanded)}
          </div>
        </div>
        <Tooltip
          id={TOOLTIP_SIDEBAR_ID}
          place="right"
          style={{ fontSize: ".875rem", zIndex: 2000, borderRadius: "var(--radius-box)" }}
        />
      </div>
      <div className="grow shirk">{children}</div>
    </div>
  );
};
