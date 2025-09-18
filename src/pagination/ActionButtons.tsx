import { Link, addLocale } from "./Link";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useMemo, useState } from "react";
import cx from "classnames";
import { EllipsisVerticalIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next-nprogress-bar";
import { LoadingComponent } from "@/Loading";
import { ScreenSize, useScreenSize } from "@/useScreenSize";
import { Popover } from "@/dialog/Popover";
import { TOOLTIP_GLOBAL_ID } from "@/utils/Toaster";

export const EditButton = ({ href, size }: { href: string; size?: "xs" | "sm" | "lg" | "xl" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={PencilIcon} tooltip={t("edit")} data-testid="button-edit" size={size} />;
};

export const ViewButton = ({ href, size }: { href: string; size?: "xs" | "sm" | "lg" | "xl" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={EyeIcon} tooltip={t("view")} data-testid="button-view" size={size} />;
};

export type MoreActionType = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => Promise<string | void>;
  href?: string;
  hidden?: boolean;
  enableWhenSpaceIsAvailable?: boolean;
  disabled?: boolean;
};

export const MoreActions = ({ actions }: { actions: MoreActionType[] }) => {
  const screenSize = useScreenSize();
  if (actions.filter((a) => !a.hidden).length === 0) {
    return null;
  }

  const enable = screenSize > ScreenSize.xs;
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
            <button className="btn btn-xs md:btn-xs btn-ghost" ref={ref} {...props}>
              <EllipsisVerticalIcon className="size-4" />
            </button>
          )}
        >
          {(close) => (
            <div data-theme="dim" style={{ background: "transparent" }}>
              <ul className="menu menu-sm px-1 p-0">
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

  if (!a.onClick) {
    if (!a.href) {
      throw new Error("href or onClick is required");
    }

    if (enable) {
      return (
        <Link
          className={`btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}`}
          href={addLocale(a.href)}
          onClick={() => !a.disabled && close()}
          data-tooltip-id={TOOLTIP_GLOBAL_ID}
          data-tooltip-content={a.label}
        >
          {Icon ? <Icon className="size-4" /> : a.label}
        </Link>
      );
    }

    return (
      <Link className="" href={addLocale(a.href)} onClick={() => close()}>
        {Icon && <Icon className="size-4" />}
        {a.label}
      </Link>
    );
  }

  return (
    <a
      className={enable ? `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}` : undefined}
      onClick={(e) => {
        e.preventDefault();
        if (!a.disabled) {
          return;
        }
        setIsLoading(true);
        a.onClick!()
          .then((result) => {
            if (typeof result === "string") {
              router.push(addLocale(result));
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

export const ArchiveButton = (props: {
  size?: "xs" | "sm" | "lg" | "xl";
  onClick?: (e: MouseEvent) => void;
  href?: string;
  tooltipId?: string;
}) => {
  const t = useTranslations("actionButtons");
  return (
    <ActionButton {...props} icon={TrashIcon} data-testid="button-archive" tooltip={t("archive")} size={props.size} />
  );
};

export const ActionButton = ({
  tooltipId = TOOLTIP_GLOBAL_ID,
  icon,
  tooltip,
  className,
  size,
  ...props
}: {
  size?: "xs" | "sm" | "lg" | "xl";
  href?: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  tooltipId?: string;
  icon: React.ElementType;
  tooltip: React.ReactNode;
  prefetch?: boolean;
}) => {
  const params = useParams();
  const Icon = icon;
  const L = props.href ? Link : "button";

  if (props.href) {
    props.href = addLocale(props.href, params.locale as string);
    props.prefetch = props.prefetch ?? false;
  }

  return (
    // @ts-expect-error TS2322
    <L
      {...props}
      data-tooltip-id={tooltipId}
      data-tooltip-place="top"
      data-tooltip-content={tooltip}
      className={cx("btn uppercase btn-ghost", className, {
        "btn-xs": size === "xs",
        "btn-sm": size === "sm",
        "btn-lg": size === "lg",
        "btn-xl": size === "xl",
        "btn-xs md:btn-sm": !size,
      })}
    >
      <Icon className="inline" width={16} />
    </L>
  );
};
