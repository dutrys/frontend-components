import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  QueueListIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconSolid } from "@heroicons/react/24/solid";
import { MoreActions, MoreActionType } from "./ActionButtons";
import { Pagination } from "./Pagination";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./PaginatedTable.module.css";
import cx from "classnames";
import { Link, addLocale } from "./Link";
import { Hotkeys } from "@/HotKeys";
import { HeaderResponsivePaginated } from "@/pagination/HeaderResponsivePaginated";
import { PaginationConfiguration } from "@/pagination/Configuration";
import { LocalStorage, StorageInterface } from "@/pagination/StorageInterface";
import { useQuery } from "@tanstack/react-query";
import { ResponseMeta, setPartialParams } from "@/utils/paginate";
import { IndeterminateCheckbox } from "@/form/Input";
import { DateTime } from "@/utils/DateTime";
import { HumanDate } from "@/utils/HumanDate";
import { TOOLTIP_GLOBAL_ID } from "@/utils/Toaster";

const limits = [10, 20, 50, 100];

export type ActionColumn<TModel> = {
  type: "actions";
  actions: (model: TModel) => MoreActionType[];
  className?: string;
  hiddenByDefault?: boolean;
};
export type SimpleColumn<TModel> = {
  name: keyof TModel;
  title: string;
  truncate?: number;
  type?: "code";
  pin?: true;
  translate?: string;
  className?: string;
  hiddenByDefault?: boolean;
};

export type DateColumn<TModel> = {
  name: keyof TModel;
  type: "date";
  format?: string;
  title: string;
  pin?: true;
  className?: string;
  hiddenByDefault?: boolean;
};
export type FunctionColumn<TModel> = {
  name: string;
  body: (data: TModel) => string | number | React.ReactNode;
  title: string;
  pin?: true;
  className?: string;
  hiddenByDefault?: boolean;
};
export type ColumnType<TModel> =
  | SimpleColumn<TModel>
  | FunctionColumn<TModel>
  | ActionColumn<TModel>
  | DateColumn<TModel>;

export function isActionColumn<TModel>(column: ColumnType<TModel>): column is ActionColumn<TModel> {
  return typeof column === "object" && (column as any).type === "actions";
}

export function isFunctionColumn<TModel>(column: ColumnType<TModel>): column is FunctionColumn<TModel> {
  return typeof column === "object" && typeof (column as any).body === "function";
}

export const PaginatedTable = <TModel extends { data: { id: number }[]; meta: ResponseMeta }>({
  pagination,
  title,
  sortEnum,
  extraHeading,
  columns,
  caption,
  isSearchable = false,
  searchableShortcuts = [],
  addNew,
  bulkActions,
  addNewText,
  displayFilters,
  displayConfig,
  renderGridItem,
  defaultDisplayAs = "list",
}: {
  caption?: React.ReactNode;
  defaultDisplayAs?: "list" | "grid";
  renderGridItem?: (model: TModel["data"][number]) => React.ReactNode;
  bulkActions?: {
    children: React.ReactNode;
    onSelect: (models: number[]) => Promise<boolean | void>;
  }[];
  sortEnum: any;
  extraHeading?: React.ReactNode;
  isSearchable?: boolean;
  title: React.ReactNode;
  addNew?: string;
  displayFilters?: {
    name: string;
    filters: string[];
  }[];
  searchableShortcuts?: { link: Record<string, string>; text: string }[][];
  columns: Array<ColumnType<TModel["data"][number]>>;
  pagination: TModel;
  addNewText?: string;
  displayConfig?: {
    name: string;
    store?: StorageInterface<TModel["data"][number]>;
    stored?: {
      name?: string;
      value: Record<string, { name: string; enabled: boolean }[]>;
    };
  };
}) => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const [selected, setSelected] = React.useState<number[]>([]);
  const [displayAs, setDisplayAs] = useState<"list" | "grid">(defaultDisplayAs || "list");

  const store = useMemo(() => displayConfig?.store || new LocalStorage(), [displayConfig]);
  const [configName, setConfigName] = useState(displayConfig?.stored?.name || "default");

  const { data: paginationConfigs, refetch: refetchPaginationConfigs } = useQuery({
    enabled: !!displayConfig,
    queryKey: ["paginationConfiguration", store],
    queryFn: () => store.getConfigs(displayConfig!.name, columns),
    initialData: displayConfig?.stored?.value || {},
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  paginationConfigs.default = columns.map((c, i) => ({
    name: isActionColumn(c) ? "action" : (c.name as string),
    enabled: !c.hiddenByDefault,
  }));

  if (!paginationConfigs[configName]) {
    paginationConfigs[configName] = paginationConfigs.default;
  }

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
                (path + setPartialParams({ search, page: "1" }, searchParams)).replace(/^\/(en|lt)\//, "/"),
                params.locale as string,
              ),
            );
          }}
        >
          {" "}
          <div className="join w-full pr-2">
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

  const elements: { link: Record<string, string>; text: string }[][] = [];

  if (bulkActions && bulkActions?.length > 0) {
    elements.push([{ link: { bulk: "bulk" }, text: "" }]);
  }

  for (const d of displayFilters || []) {
    if (d.filters.some((filter) => searchParams.get(`filter.${filter}`) !== null)) {
      const filterToDisplay: Record<string, string> = {};
      d.filters.forEach((filter) => {
        filterToDisplay[`filter.${filter}`] = searchParams.get(`filter.${filter}`) || "";
      });

      elements.push([{ text: d.name, link: filterToDisplay }]);
    }
  }

  elements.push(...searchableShortcuts);

  const heading = (
    <>
      <div className="flex items-center flex-end w-full border-b border-b-base-content/5 h-12 max-w-[calc(100vw)] sm:max-w-[calc(100vw-6rem)]">
        <h1 className={`pl-4 py-3 pr-2 font-bold mr-auto ${searchableShortcuts.length > 0 ? "" : "grow"}`}>{title}</h1>
        <Hotkeys id="paginatedTable" hotKeys={hotKeys} />

        {(elements.length > 0 || (bulkActions && bulkActions?.length > 0)) && (
          <HeaderResponsivePaginated
            bulkActions={bulkActions ? { actions: bulkActions, setSelected, selected } : undefined}
            elements={elements}
          />
        )}
        {extraHeading}
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
        {renderGridItem && (
          <div className="join mr-2">
            <button
              className={cx("btn btn-xs join-item", { "btn-active": displayAs === "grid" })}
              onClick={() => {
                setDisplayAs("grid");
                if (displayConfig) {
                  void store.setDisplayAs(displayConfig.name, "grid");
                }
              }}
            >
              <RectangleStackIcon className="size-4" />
            </button>
            <button
              className={cx("btn btn-xs join-item", { "btn-active": displayAs === "list" })}
              onClick={() => {
                setDisplayAs("list");
                if (displayConfig) {
                  void store.setDisplayAs(displayConfig.name, "list");
                }
              }}
            >
              <QueueListIcon className="size-4" />
            </button>
          </div>
        )}
        {isSearchable && <SearchField />}

        {displayConfig && (
          <div className="pr-2">
            <PaginationConfiguration
              disabled={displayAs !== "list"}
              store={store}
              name={displayConfig.name}
              configName={configName}
              columns={columns}
              configs={paginationConfigs}
              setConfigName={(name) => setConfigName(name)}
              refresh={() => void refetchPaginationConfigs()}
            />
          </div>
        )}
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
        {displayAs === "grid" && renderGridItem ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4 2xl:grid-cols-4">
            {pagination.data.map((d) => renderGridItem(d))}
          </div>
        ) : (
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
                {paginationConfigs[configName].map((item, i) => {
                  const column = columns.find((c) =>
                    isActionColumn(c) ? "action" === item.name : (c.name as string) === item.name,
                  );
                  if (!column || !item.enabled) {
                    return null;
                  }
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
                            { page: "1", sortBy: `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}` },
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
              {pagination.data.map((model: TModel["data"][number], o: number) => (
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
                  {paginationConfigs[configName].map((item, i) => {
                    const column = columns.find((c) =>
                      isActionColumn(c) ? "action" === item.name : (c.name as string) === item.name,
                    );
                    if (!column || !item.enabled) {
                      return null;
                    }
                    if (isActionColumn(column)) {
                      return (
                        <th key={`actions-td-${i}`} className={column.className || "whitespace-nowrap text-right"}>
                          <MoreActions actions={column.actions(model)} />
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
                        <Component key={`${model.id}-${column.name.toString()}`} className={column.className}>
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
                      ? t(`${column.translate}.${model[column.name]}`)
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
                        {column.truncate ? (
                          <TruncateText text={translatedValue} length={column.truncate} />
                        ) : (
                          translatedValue
                        )}
                      </Component>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
                    href={setPartialParams({ page: "1", limit: `${l}` }, searchParams)}
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
      href={addLocale(href, useParams().locale as string)}
      {...rest}
      prefetch={false}
      className={`${styles.link} ${className || ""} text-primary-700 hover:text-primary-500`}
    >
      {children}{" "}
    </Link>
  );
};

export const FilterLink = ({
  children,
  className,
  params,
}: {
  className: string;
  children: React.ReactNode;
  params: Record<string, string>;
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [isFiltering, setIsFiltering] = useState(
    !Object.entries(params).every(([key, value]) => searchParams.get(key) === value.toString()),
  );

  useEffect(() => {
    setIsFiltering(!Object.entries(params).every(([key, value]) => searchParams.get(key) === value.toString()));
  }, [searchParams, setIsFiltering, params]);

  const p = params;
  if (!isFiltering) {
    Object.keys(params).forEach((key) => {
      p[key] = "";
    });
  }

  return (
    <div className="flex items-center">
      {children}
      <TableLink
        data-tooltip-id={TOOLTIP_GLOBAL_ID}
        data-tooltip-content={isFiltering ? t("general.filter") : t("general.clearFilter")}
        className={`${className || ""} px-2 invisible`}
        href={`${pathname}${setPartialParams(p, searchParams)}`}
      >
        {isFiltering ? <FunnelIcon className="size-5" /> : <FunnelIconSolid className="size-5" />}
      </TableLink>
    </div>
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
