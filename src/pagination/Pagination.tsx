import React from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "./Link";
import { ResponseMeta, setPartialParams } from "@/utils/paginate";

export const Pagination = ({
  page,
  visiblePages,
  onClick,
}: {
  onClick?: (page: number) => void;
  page: ResponseMeta;
  visiblePages: number;
}) => {
  const searchParams = useSearchParams();
  let minPage = Math.max(1, page.currentPage - Math.floor(visiblePages / 2));
  const maxPage = Math.min(page.totalPages, minPage + visiblePages - 1);
  const pageNumbers = [];

  if (maxPage - minPage + 1 < visiblePages) {
    minPage = Math.max(1, maxPage - visiblePages + 1);
  }

  for (let i = minPage; i <= maxPage; i++) {
    pageNumbers.push(
      onClick ? (
        <button
          className={`btn uppercase join-item ${i === page.currentPage ? "btn-active" : ""}`}
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
          className={`btn uppercase join-item ${i === page.currentPage ? "btn-active" : ""}`}
          key={i}
          href={setPartialParams({ page: i }, searchParams)}
        >
          {i}
        </Link>
      ),
    );
  }

  return <div className="join mx-auto py-2">{pageNumbers}</div>;
};
