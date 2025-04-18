import { Link } from "./Link";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { TOOLTIP_GLOBAL_ID } from "@/utils";
import cx from "classnames";

export const ActionButtons = ({
  id,
  archive,
  edit,
  view,
  pathname,
}: {
  pathname: string;
  id: number | string;
  view?: boolean;
  edit?: boolean;
  archive?: boolean;
}) => {
  const searchParams = useSearchParams();
  return (
    <>
      {view && <ViewButton href={`${pathname}/view/${id}?${searchParams.toString()}`} />}
      {edit && <EditButton href={`${pathname}/edit/${id}?${searchParams.toString()}`} />}
      {archive && <ArchiveButton href={`${pathname}/archive/${id}?${searchParams.toString()}`} />}
    </>
  );
};

export const EditButton = ({ href, size }: { href: string; size?: "xs" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={PencilIcon} tooltip={t("edit")} data-testid="button-edit" size={size} />;
};

export const ViewButton = ({ href, size }: { href: string; size?: "xs" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={EyeIcon} tooltip={t("view")} data-testid="button-view" size={size} />;
};

export const ArchiveButton = (props: {
  size?: "xs";
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
  size?: "xs";
  href?: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  tooltipId?: string;
  icon: React.ElementType;
  tooltip: React.ReactNode;
}) => {
  const Icon = icon;
  const L = props.href ? Link : "button";

  return (
    // @ts-expect-error TS2322
    <L
      {...props}
      data-tooltip-id={tooltipId}
      data-tooltip-place="top"
      data-tooltip-content={tooltip}
      className={cx("btn uppercase btn-ghost", className, {
        "btn-xs": size === "xs",
        "btn-xs md:btn-sm": !size,
      })}
    >
      <Icon className="inline" width={16} />
    </L>
  );
};
