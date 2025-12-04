import { Link, addLocale } from "./Link";
import { useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import cx from "classnames";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next-nprogress-bar";
import { LoadingComponent } from "@/Loading";
import { ScreenSize, useScreenSize } from "@/useScreenSize";
import { Popover } from "@/dialog/Popover";
import { TOOLTIP_GLOBAL_ID } from "@/utils/Toaster";

export type MoreActionType = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => Promise<string | void>;
  href?: string;
  hidden?: boolean;
  enableWhenSpaceIsAvailable?: boolean;
  disableNProgress?: boolean;
  disabled?: boolean;
  testId?: string;
};

export const MoreActions = ({ className, actions }: { className?: string; actions: MoreActionType[] }) => {
  const screenSize = useScreenSize();
  if (actions.filter((a) => !a.hidden).length === 0) {
    return null;
  }

  const enable = screenSize === ScreenSize.none || screenSize > ScreenSize.xs;
  const { menuActions, buttonActions } = useMemo(() => {
    let menuActions: MoreActionType[] = actions.filter((a) =>
      enable ? !a.hidden && !a.enableWhenSpaceIsAvailable : !a.hidden,
    );
    const buttonActions: MoreActionType[] = [];
    if (enable) {
      buttonActions.push(...actions.filter((a) => !a.hidden && a.enableWhenSpaceIsAvailable));
    }
    if (menuActions.length === 1) {
      buttonActions.push(menuActions[0]);
      menuActions = [];
    }

    return { buttonActions, menuActions };
  }, [actions, enable]);

  return (
    <>
      {buttonActions.map((a) => (
        <Action enable key={a.label} action={a} close={() => {}} />
      ))}

      {menuActions.length > 0 && (
        <Popover
          showOnClick
          title={(ref, props) => (
            <button className={cx("btn btn-xs md:btn-xs btn-ghost", className)} ref={ref} {...props}>
              <EllipsisVerticalIcon className="size-4" />
            </button>
          )}
        >
          {(close) => (
            <div data-theme="dim" style={{ background: "transparent" }}>
              <ul className="menu menu-sm p-1 p-0">
                {menuActions.map((a, i) => (
                  <li key={i} className={a.disabled ? "menu-disabled" : undefined}>
                    <Action action={a} close={close} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Popover>
      )}
    </>
  );
};

const Action = ({ action: a, close, enable }: { enable?: boolean; close: () => void; action: MoreActionType }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const Icon = isLoading ? LoadingComponent : a.icon;
  const searchParams = useSearchParams();

  if (!a.onClick) {
    if (!a.href) {
      throw new Error("href or onClick is required");
    }

    let href = addLocale(a.href);
    if (!href.includes("?")) {
      href += `?${searchParams.toString()}`;
    }
    if (enable) {
      return (
        <Link
          data-testid={a.testId}
          data-disable-nprogress={a.disableNProgress}
          className={`btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}`}
          href={href}
          onClick={() => !a.disabled && close()}
          data-tooltip-id={TOOLTIP_GLOBAL_ID}
          data-tooltip-content={a.label}
          prefetch={false}
        >
          {Icon ? <Icon className="size-4" /> : a.label}
        </Link>
      );
    }

    return (
      <Link
        data-testid={a.testId}
        data-disable-nprogress={a.disableNProgress}
        className=""
        href={href}
        onClick={() => close()}
        prefetch={false}
      >
        {Icon && <Icon className="size-4" />}
        {a.label}
      </Link>
    );
  }

  return (
    <a
      data-testid={a.testId}
      className={enable ? `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}` : undefined}
      onClick={(e) => {
        e.preventDefault();
        if (a.disabled) {
          return;
        }
        setIsLoading(true);
        a.onClick!()
          .then((result) => {
            if (typeof result === "string") {
              let href = addLocale(result);
              if (!href.includes("?")) {
                href += `?${searchParams.toString()}`;
              }
              router.push(href);
            }
            close();
          })
          .finally(() => setIsLoading(false));
      }}
    >
      {Icon && <Icon className="size-4" />}
      {!enable && a.label}
    </a>
  );
};
