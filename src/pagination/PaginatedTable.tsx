import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { ArchiveButton, EditButton, ViewButton } from "./ActionButtons";
import { DateTime, isParamActive, setPartialParams } from "@/utils";
import { Pagination } from "./Pagination";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import styles from "./PaginatedTable.module.css";
import { HeaderResponsive } from "./HeaderResponsive";
import { HumanDate, TOOLTIP_GLOBAL_ID } from "@/utils";
import cx from "classnames";
import { BulkActions, BulkDropDownActions } from "./BulkActions";
import { ResponseMeta } from "@/utils";
import { Link, addLocale } from "./Link";
import { Hotkeys } from "@/HotKeys";
import { IndeterminateCheckbox } from "@/form";

const limits = [10, 20, 50, 100];

type ActionColumn<TModel> = {
  type: "actions";
  archive?: string | false | ((model: TModel) => string | false);
  edit?: string | false | ((model: TModel) => string | false);
  view?: string | false | ((model: TModel) => string | false);
  idField: keyof TModel;
  extraButtons?: [(model: TModel) => React.ReactNode];
};
type SimpleColumn<TModel> = {
  name: keyof TModel;
  title: string;
  truncate?: number;
  type?: "code";
  pin?: true;
};

type DateColumn<TModel> = {
  name: keyof TModel;
  type: "date";
  format?: string;
  title: string;
  pin?: true;
};
type FunctionColumn<TModel> = {
  name?: string;
  body: (data: TModel) => string | number | React.ReactNode;
  title: string;
  pin?: true;
};
export type ColumnType<TModel> =
  | SimpleColumn<TModel>
  | FunctionColumn<TModel>
  | ActionColumn<TModel>
  | DateColumn<TModel>;

function isActionColumn<TModel>(column: ColumnType<TModel>): column is ActionColumn<TModel> {
  return typeof column === "object" && (column as any).type === "actions";
}

function isFunctionColumn<TModel>(column: ColumnType<TModel>): column is FunctionColumn<TModel> {
  return typeof column === "object" && typeof (column as any).body === "function";
}

export const PaginatedTable = <TModel extends { id: number }>({
  pagination,
  title,
  sortEnum,
  extraHeading,
  columns,
  caption,
  pathname,
  isSearchable = false,
  searchableShortcuts = [],
  addNew,
  bulkActions,
  addNewText,
}: {
  caption?: React.ReactNode;
  bulkActions?: {
    children: React.ReactNode;
    onSelect: (models: number[]) => Promise<boolean | void>;
  }[];
  sortEnum: any;
  extraHeading?: React.ReactNode;
  isSearchable?: boolean;
  title: React.ReactNode;
  pathname: string;
  addNew?: string;
  searchableShortcuts?: { link: Record<string, string>; text: string }[][];
  columns: Array<ColumnType<TModel>>;
  pagination: { data: TModel[]; meta: ResponseMeta };
  addNewText?: string;
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [selected, setSelected] = React.useState<number[]>([]);

  const hotKeys = [];
  if (addNew) {
    hotKeys.push({
      key: "n",
      metaKey: true,
      ctrlKey: true,
      description: t("pagination.addNew"),
      callback: () => {
        router.push(addLocale(addNew.replace(/^\/(en|lt)\//, "/"), params.locale as string));
      },
    });
  }

  const SearchField = () => {
    const router = useRouter();
    const path = usePathname();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    return (
      <div className="w-32 sm:w-52 shrink-0 grow-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(
              addLocale(
                (path + setPartialParams({ search, page: 1 }, searchParams)).replace(/^\/(en|lt)\//, "/"),
                params.locale as string,
              ),
            );
          }}
        >
          {" "}
          <div className="join w-full pr-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              className="join-item input input-bordered input-xs outline-0 focus:ring-0 w-full focus:outline-0 focus:border-gray-500"
              placeholder={t("pagination.searchPlaceholder")}
            />
            <button className="join-item btn btn-neutral btn-xs uppercase" type="submit">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    );
  };

  const elements =
    bulkActions && bulkActions?.length > 0
      ? [[{ link: { bulk: "bulk" }, text: "" }], ...searchableShortcuts]
      : searchableShortcuts;

  const heading = (
    <>
      <div className="flex items-center flex-end w-full border-b border-b-base-content/5 h-12 max-w-[calc(100vw)] sm:max-w-[calc(100vw-6rem)]">
        <h1 className={`pl-4 pb-3 pt-3 font-bold mr-2 ${searchableShortcuts.length > 0 ? "" : "grow"}`}>{title}</h1>
        {extraHeading}
        <Hotkeys id="paginatedTable" hotKeys={hotKeys} />

        {(searchableShortcuts.length > 0 || (bulkActions && bulkActions?.length > 0)) && (
          <HeaderResponsive
            heightClassName="h-12"
            elements={elements}
            renderDropdown={(shortcuts, i) => {
              return (
                <React.Fragment key={i}>
                  {i !== 0 && <li className="disabled"></li>}
                  {shortcuts.map(({ link, text }) => {
                    if (bulkActions && bulkActions.length > 0 && link.bulk === "bulk") {
                      return (
                        <>
                          <li className="menu-disabled">
                            <span>{t("pagination.bulkActions")}</span>
                          </li>
                          <BulkDropDownActions
                            disabled={selected.length === 0}
                            bulkActions={bulkActions.map((b) => ({
                              children: b.children,
                              onSelect: async () => {
                                const success = await b.onSelect(selected);
                                if (success) {
                                  setSelected([]);
                                }
                              },
                            }))}
                          />
                          <li className="menu-disabled"></li>
                          <li className="menu-disabled">
                            <span>{t("pagination.filters")}</span>
                          </li>
                        </>
                      );
                    }

                    const active = isParamActive(link, searchParams);
                    link = { ...link };
                    if (active) {
                      Object.keys(link).forEach((key) => {
                        link[key] = "";
                      });
                    }
                    const params = setPartialParams({ ...link, page: "" }, searchParams);
                    return (
                      <li key={text}>
                        <Link
                          prefetch={false}
                          className={active ? "bg-base-300/50 font-bold hover:bg-base-300" : ""}
                          href={params === "" ? "?" : params}
                        >
                          {text}
                        </Link>
                      </li>
                    );
                  })}
                </React.Fragment>
              );
            }}
            renderVisible={(element, i) => {
              if (i === 0 && bulkActions && bulkActions.length > 0) {
                return (
                  <BulkActions
                    disabled={selected.length === 0}
                    bulkActions={bulkActions.map((b) => ({
                      children: b.children,
                      onSelect: async () => {
                        const success = await b.onSelect(selected);
                        if (success) {
                          setSelected([]);
                        }
                      },
                    }))}
                  />
                );
              }
              return (
                <div className={element.length > 1 ? "join" : undefined} key={i}>
                  {element.map(({ text, link }) => {
                    const active = isParamActive(link, searchParams);
                    link = { ...link };
                    if (active) {
                      Object.keys(link).forEach((key) => {
                        link[key] = "";
                      });
                    }
                    const params = setPartialParams({ ...link, page: "" }, searchParams);
                    return (
                      <Link
                        prefetch={false}
                        key={text}
                        className={`btn join-item uppercase btn-xs ${active ? "btn-neutral" : ""}`}
                        href={params === "" ? "?" : params}
                      >
                        {text}
                      </Link>
                    );
                  })}
                </div>
              );
            }}
          />
        )}
        {addNew && (
          <Link
            className="btn uppercase btn-accent gap-2 justify-end  btn-xs mr-2"
            href={addLocale(addNew, params.locale as string)}
            data-testid="add-new"
          >
            <PlusIcon className="w-4 h-4" />{" "}
            <span className="hidden sm:inline">{addNewText || t("pagination.addNew")}</span>
          </Link>
        )}
        {isSearchable && <SearchField />}
      </div>
    </>
  );

  if (pagination.meta.totalItems === 0) {
    return (
      <>
        {heading}
        {caption}
        <div className="text-center mt-20">
          <span className="text-gray-400">
            {t("pagination.noItems")} <span className="align-middle text-3xl ">😿</span>
          </span>
          {addNew && (searchParams.get("search") || "") === "" && (
            <p className="mt-4">
              <Link className="btn uppercase btn-outline" href={addLocale(addNew, params.locale as string)}>
                <PlusIcon width={20} /> {addNewText || t("pagination.tryCreatingOne")}
              </Link>
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div
      data-testid="paginate-table"
      className="relative h-full"
      data-test-sort={(pagination.meta.sortBy || []).flat().join("-")}
    >
      {heading}
      <div className="overflow-x-auto max-h-[calc(100%-7rem)] w-[calc(100vw)] sm:w-[calc(100vw-6rem)]">
        <table className={`${styles.table} table table-xs sm:table-sm md:table-md table-pin-rows table-pin-cols`}>
          {caption && <caption>{caption}</caption>}
          <thead>
            <tr>
              {bulkActions && (
                <th>
                  <IndeterminateCheckbox
                    className="checkbox checkbox-xs"
                    onChange={(e) => {
                      setSelected(e.target.checked ? pagination.data.map((model) => model.id) : []);
                    }}
                    indeterminate={selected.length > 0 && selected.length < pagination.data.length}
                    checked={pagination.data.every((model) => selected.includes(model.id))}
                  />
                </th>
              )}
              {columns.map((column, i) => {
                if (isActionColumn(column)) {
                  return (
                    <th key={`actions-${i}`} className={`${styles.thead} w-12 max-w-24 text-xs`}>
                      &nbsp;
                    </th>
                  );
                }

                const [sortBy, sortOrder] = Array.isArray(pagination.meta.sortBy)
                  ? pagination.meta.sortBy[0]
                  : ["id", "DESC"];
                const Component: React.ElementType = column.pin ? "th" : "td";
                if (column.name && Object.values(sortEnum).includes(`${column.name.toString()}:DESC`)) {
                  const args = {
                    className: "inline",
                    width: 10,
                  };

                  return (
                    <Component key={column.name.toString()} className={`${styles.thead} text-xs`}>
                      <Link
                        prefetch={false}
                        data-testid={`sort-table-${column.name.toString()}-${sortOrder === "DESC" ? "asc" : "desc"}`}
                        {...(sortBy === column.name ? { className: "text-primary-500" } : {})}
                        href={setPartialParams(
                          { page: 1, sortBy: `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}` },
                          searchParams,
                        )}
                      >
                        {column.title}
                        {sortOrder === "DESC" ? <ChevronDownIcon {...args} /> : <ChevronUpIcon {...args} />}
                      </Link>
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
            {pagination.data.map((model: TModel, o: number) => (
              <tr
                key={o}
                data-testid={`table-row-${o}`}
                className={cx({
                  [styles.selectedRow]: selected.includes(model.id),
                })}
              >
                {bulkActions && (
                  <th>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-xs"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected((prev) => [...prev, model.id]);
                        } else {
                          setSelected((prev) => prev.filter((id) => id !== model.id));
                        }
                      }}
                      checked={selected.includes(model.id)}
                    />
                  </th>
                )}
                {columns.map((column, i) => {
                  if (isActionColumn(column)) {
                    if (!column.idField) {
                      throw new Error("Model must have an id");
                    }
                    const idFieldValue = model[column.idField];
                    if (typeof idFieldValue !== "string" && typeof idFieldValue !== "number") {
                      throw new Error("idField must be a string or a number");
                    }

                    const view: string | false =
                      typeof column.view === "function"
                        ? column.view(model)
                        : column.view
                          ? `${pathname}/${idFieldValue}/${column.view}`
                          : false;
                    const archive: string | false =
                      typeof column.archive === "function"
                        ? column.archive(model)
                        : column.archive
                          ? `${pathname}/${idFieldValue}/${column.archive}`
                          : false;
                    const edit: string | false =
                      typeof column.edit === "function"
                        ? column.edit(model)
                        : column.edit
                          ? `${pathname}/${idFieldValue}/${column.edit}?${searchParams.toString()}`
                          : false;

                    return (
                      <th key={`actions-td-${i}`} className="whitespace-nowrap text-right">
                        {column.extraButtons?.map((Button, i) => (
                          <React.Fragment key={`${model[column.idField]}-${i}`}>{Button(model)}</React.Fragment>
                        ))}
                        {view && <ViewButton href={view} />}
                        {edit && <EditButton href={edit} />}
                        {archive && <ArchiveButton href={archive} />}
                      </th>
                    );
                  }

                  const Component: React.ElementType = column.pin ? "th" : "td";
                  if (isFunctionColumn(column)) {
                    return <Component key={`actions-td-${i}`}>{column.body(model)}</Component>;
                  }
                  if (column.type === "date") {
                    return (
                      <Component key={`${model.id}-${column.name.toString()}`}>
                        {column.format ? (
                          <DateTime date={model[column.name] as string} format={column.format} />
                        ) : (
                          <HumanDate date={model[column.name] as string} />
                        )}
                      </Component>
                    );
                  }
                  if (column.type === "code") {
                    return (
                      <Component key={column.name.toString()}>
                        {model[column.name] && (
                          <div className="badge badge-sm">
                            <code>{model[column.name] as string}</code>
                          </div>
                        )}
                      </Component>
                    );
                  }
                  return (
                    <Component key={column.name.toString()}>
                      {column.truncate ? (
                        <TruncateText text={model[column.name] as string} length={column.truncate} />
                      ) : (
                        (model[column.name] as string)
                      )}
                    </Component>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="absolute left-0 bottom-0 w-full h-16 z-1">
        <div className="bg-base-100">
          <div className="flex justify-center items-center">
            <div className={`shrink-1 w-60 text-xs pl-4 ${pagination.meta.totalPages > 1 ? "hidden md:block" : ""}`}>
              {t("pagination.showing", {
                from: (pagination.meta.currentPage - 1) * pagination.meta.itemsPerPage + 1,
                to: Math.min(pagination.meta.currentPage * pagination.meta.itemsPerPage, pagination.meta.totalItems),
                total: pagination.meta.totalItems,
              })}
            </div>
            <div className="grow text-center h-16">
              {pagination.meta.totalPages > 1 && <Pagination visiblePages={5} page={pagination.meta} />}
            </div>
            {pagination.meta.totalPages > 1 && (
              <div className="shrink-1 w-60 hidden md:block text-xs text-right pr-4">
                <span className="text-gray-400">{t("pagination.itemsPerPage")}</span>{" "}
                {limits.map((l) => (
                  <LimitLink
                    isActive={pagination.meta.itemsPerPage === l}
                    key={l}
                    text={l.toString()}
                    href={setPartialParams({ page: 1, limit: l }, searchParams)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LimitLink = ({ href, text, isActive }: { href: string; text: string; isActive: boolean }) => {
  return (
    <Link
      prefetch={false}
      className={`text-gray-400 hover:text-primary-600 mr-1 ${isActive ? "font-bold text-primary-600" : ""}`}
      href={href}
    >
      {text}
    </Link>
  );
};

export const TableLink = ({
  href,
  children,
  className,
  isLink = true,
  ...rest
}: {
  className?: string;
  href: string;
  children: React.ReactNode;
  isLink?: boolean;
}) => {
  if (!isLink) {
    return children;
  }
  return (
    <Link
      href={href}
      {...rest}
      prefetch={false}
      className={`${styles.link} ${className || ""} text-primary-700 hover:text-primary-500`}
    >
      {children}{" "}
    </Link>
  );
};

const TruncateText = ({ text, length }: { text: string; length: number }) => {
  return (
    <div
      data-tooltip-id={TOOLTIP_GLOBAL_ID}
      data-tooltip-content={text}
      className="text-left text-ellipsis overflow-hidden"
      style={{ width: length }}
    >
      {text}
    </div>
  );
};
