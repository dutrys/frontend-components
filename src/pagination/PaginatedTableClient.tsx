import React from "react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import cx from "classnames";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import styles from "./PaginatedTableClient.module.css";
import { ResponseMeta } from "../utils/paginate";
import { ColumnType, isActionColumn, isFunctionColumn } from "./PaginatedTable";
import { DateTime } from "../utils/DateTime";
import { HumanDate } from "../utils/HumanDate";
import { Pagination } from "./Pagination";
import { MoreActions } from "./MoreAction";

export const PaginatedTableClient = <
  TModel extends { data: { id: number }[]; meta: ResponseMeta },
  TSort extends Record<string, string> = Record<string, string>,
>({
  data,
  isLoading,
  columns,
  sortEnum,
}: {
  isLoading: boolean;
  sortEnum: TSort;
  data: TModel | undefined;
  columns: Array<ColumnType<TModel["data"][number]>>;
}) => {
  const t = useTranslations();
  const [paginationOptions, setPaginationOptions] = useState<{ sortBy: TSort[keyof TSort] | null; page: number }>({
    page: 1,
    sortBy: null,
  });

  return (
    <>
      <div className="overflow-x-auto">
        {!isLoading && data?.meta?.totalItems === 0 ? (
          <div className="px-2 text-gray-500">{t("pagination.noItems")}</div>
        ) : (
          <>
            <table className="table table-xs">
              <thead>
                <tr className="top-28">
                  {columns.map((column, i) => {
                    if (isActionColumn(column)) {
                      return (
                        <th
                          key={`actions-${i}`}
                          className={`${styles.thead} ${styles.colAction} w-12 max-w-24 text-xs`}
                        ></th>
                      );
                    }

                    const [sortBy, sortOrder] = Array.isArray(data?.meta.sortBy) ? data.meta.sortBy[0] : ["id", "DESC"];

                    const Component: React.ElementType = column.pin ? "th" : "td";
                    if (
                      column.name &&
                      Object.values(sortEnum as Record<string, string>).includes(`${column.name.toString()}:DESC`)
                    ) {
                      const args = {
                        className: "inline",
                        width: 10,
                      };

                      return (
                        <Component key={column.name.toString()} className={`${styles.thead} text-xs`}>
                          <button
                            type="button"
                            data-testid={`sort-table-${column.name.toString()}-${sortOrder === "DESC" ? "asc" : "desc"}`}
                            {...(sortBy === column.name ? { className: "text-primary" } : {})}
                            onClick={() => {
                              setPaginationOptions({
                                ...paginationOptions,
                                sortBy:
                                  `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}` as TSort[keyof TSort],
                                page: 1,
                              });
                            }}
                          >
                            {column.title}
                            {sortOrder === "DESC" ? <ChevronDownIcon {...args} /> : <ChevronUpIcon {...args} />}
                          </button>
                        </Component>
                      );
                    }

                    return (
                      <Component key={column.title.toString()} className={`${styles.thead} text-xs`}>
                        {column.title}
                      </Component>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  [0, 1, 2, 3, 4, 5].map((d) => (
                    <tr key={d} className={styles.loading}>
                      {columns.map((_, i) => (
                        <td key={i}>
                          <div className="skeleton h-4" />
                        </td>
                      ))}
                    </tr>
                  ))}
                {data?.data.map((model: TModel["data"][number], o: number) => (
                  <tr key={o} data-testid={`table-row-${o}`}>
                    {columns.map((column, i) => {
                      if (isActionColumn(column)) {
                        return (
                          <th
                            key={`actions-td-${i}`}
                            className={cx(
                              "action-cell",
                              styles.colAction,
                              column.className ?? "whitespace-nowrap text-right",
                            )}
                          >
                            <div className={styles.actionCellContent}>
                              <div className={styles.moreActionsContainer}>
                                <MoreActions actions={column.actions(model)} />
                              </div>
                            </div>
                          </th>
                        );
                      }

                      const Component: React.ElementType = column.pin ? "th" : "td";
                      if (isFunctionColumn(column)) {
                        return (
                          <Component key={`actions-td-${i}`} className={column.className}>
                            {column.body(model)}
                          </Component>
                        );
                      }
                      if (column.type === "date") {
                        return (
                          <Component
                            key={`${model.id}-${column.name.toString()}`}
                            className={column.className ?? "text-nowrap"}
                          >
                            {model[column.name] &&
                              (column.format ? (
                                <DateTime date={model[column.name] as string} format={column.format} />
                              ) : (
                                <HumanDate date={model[column.name] as string} />
                              ))}
                          </Component>
                        );
                      }

                      const translatedValue = column.translate
                        ? t(`${column.translate}.${model[column.name]}` as any)
                        : (model[column.name] as string);
                      if (column.type === "code") {
                        return (
                          <Component key={column.name.toString()} className={column.className}>
                            {model[column.name] && (
                              <div className="badge badge-sm">
                                <code>{translatedValue}</code>
                              </div>
                            )}
                          </Component>
                        );
                      }
                      return (
                        <Component key={column.name.toString()} className={column.className}>
                          {translatedValue}
                        </Component>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {data && typeof data?.meta?.totalPages === "number" && data.meta.totalPages > 1 && (
              <div className="flex">
                <Pagination
                  size="xs"
                  page={data?.meta}
                  visiblePages={5}
                  onClick={(page) => setPaginationOptions({ ...paginationOptions, page })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
