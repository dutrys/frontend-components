import { Link, addLocale } from "./Link";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { TOOLTIP_GLOBAL_ID } from "@/utils";
import cx from "classnames";

export const EditButton = ({ href, size }: { href: string; size?: "xs" | "sm" | "lg" | "xl" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={PencilIcon} tooltip={t("edit")} data-testid="button-edit" size={size} />;
};

export const ViewButton = ({ href, size }: { href: string; size?: "xs" | "sm" | "lg" | "xl" }) => {
  const t = useTranslations("actionButtons");
  return <ActionButton href={href} icon={EyeIcon} tooltip={t("view")} data-testid="button-view" size={size} />;
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
}) => {
  const params = useParams();
  const Icon = icon;
  const L = props.href ? Link : "button";

  if (props.href) {
    props.href = addLocale(props.href, params.locale as string);
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
