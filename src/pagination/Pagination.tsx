import React from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "./Link";
import { ResponseMeta, setPartialParams } from "../utils/paginate";
import cx from "classnames";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";

export const Pagination = ({
  page,
  visiblePages,
  onClick,
  size,
  className = "py-2",
}: {
  className?: string;
  size?: "sm" | "xs";
  onClick?: (page: number) => void;
  page: ResponseMeta;
  visiblePages: number;
}) => {
  const searchParams = useSearchParams();
  let minPage = Math.max(1, page.currentPage - Math.floor(visiblePages / 2));
  const maxPage = Math.min(page.totalPages, minPage + visiblePages - 1);
  const pageNumbers: React.ReactNode[] = [];

  if (maxPage - minPage + 1 < visiblePages) {
    minPage = Math.max(1, maxPage - visiblePages + 1);
  }

  for (let i = minPage; i <= maxPage; i++) {
    pageNumbers.push(
      onClick ? (
        <button
          className={cx("btn uppercase join-item", {
            "btn-active": i === page.currentPage,
            "btn-xs": size === "xs",
            "btn-sm": size === "sm",
          })}
          key={i}
          onClick={(e) => {
            e.preventDefault();
            onClick(i);
          }}
        >
          {i}
        </button>
      ) : (
        <Link
          prefetch={false}
          className={cx("btn uppercase join-item", {
            "btn-active": i === page.currentPage,
            "btn-xs": size === "xs",
            "btn-sm": size === "sm",
          })}
          key={i}
          href={setPartialParams({ page: `${i}` }, searchParams)}
        >
          {i}
        </Link>
      ),
    );
  }

  return <div className={cx("join mx-auto", className)}>{pageNumbers}</div>;
};

export const NoCountPagination = ({ nextPageAvailable }: { nextPageAvailable: boolean }) => {
  const searchParams = useSearchParams();
  const t = useTranslations();
  const pageString = searchParams.get("page");
  const page = Math.max(Number(pageString), 1);

  return (
    <div className="my-4 gap-2">
      <Link
        className={cx("btn btn-sm mr-2 w-30", { "btn-disabled": page <= 1 })}
        href={setPartialParams({ page: page <= 2 ? "" : `${page - 1}` }, searchParams)}
        prefetch={false}
      >
        <ChevronLeftIcon className="size-4" /> {t("pagination.previous")}
      </Link>
      <Link
        href={setPartialParams(nextPageAvailable ? { page: `${page + 1}` } : {}, searchParams)}
        className={cx("btn btn-sm w-30", { "btn-disabled": !nextPageAvailable })}
        prefetch={false}
      >
        {t("pagination.next")} <ChevronRightIcon className="size-4" />
      </Link>
    </div>
  );
};
