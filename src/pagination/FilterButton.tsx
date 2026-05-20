import React, { useEffect, useRef } from "react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelSolidIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import { useForm, useWatch, Watch } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { endOfDay, format, isValid, startOfDay } from "date-fns";
import { NumericFormatProps } from "react-number-format";
import { PaginateQuery, ResponseMeta, setPartialParams } from "../utils/paginate";
import { parseDateTime, stringToDate } from "../utils/date";
import { Popover } from "../dialog/Popover";
import {
  DateFormField,
  NumberFormField,
  SaveButton,
  SelectPaginatedFromApiField,
  SelectPaginatedFromApiFormField,
  TextFormField,
} from "../form/Input";

export enum FilterType {
  TEXT = "text",
  BOOLEAN = "boolean",
  PAGINATION = "pagination",
  DATE_RANGE = "date-range",
  NUMBER_RANGE = "number-range",
  OPTIONS = "options",
}

const getDefaultValues = (
  searchParams: URLSearchParams,
  filter: Record<string, FilterColumn<{ data: { id: number }[]; meta: ResponseMeta }>>,
) => {
  const defaultValues: Partial<Record<string, unknown>> = {};
  let filterIsActive = false;
  for (const [k, v] of Array.from(searchParams.entries())) {
    const key = k.endsWith("[]") ? k.slice(0, -2) : k;
    if (!key.startsWith("filter.") || filter[key.substring("filter.".length)] === undefined) {
      continue;
    }
    const value = Array.isArray(v) ? v[0] : v;
    const type = filter[key.substring("filter.".length)]?.type;
    if (type === FilterType.PAGINATION) {
      if (value.startsWith("$in:")) {
        const vals: number[] = (value.substring("$in:".length).split(",") as string[])
          .map((v) => parseInt(v, 10))
          .filter((v) => !isNaN(v));
        defaultValues[key.substring("filter.".length)] = vals;
        if (vals.length > 0) {
          filterIsActive = true;
        }
        continue;
      }

      const val = parseInt(value, 10) || null;
      defaultValues[key.substring("filter.".length)] = val;
      if (val) {
        filterIsActive = true;
      }
    } else if (type === FilterType.OPTIONS) {
      if (value) {
        filterIsActive = true;
        defaultValues[key.substring("filter.".length)] = value;
      }
    } else if (type === FilterType.BOOLEAN) {
      if (value === "1" || value === "true") {
        defaultValues[key.substring("filter.".length)] = true;
        filterIsActive = true;
      } else if (value === "0" || value === "false") {
        defaultValues[key.substring("filter.".length)] = false;
        filterIsActive = true;
      }
    } else if (type === FilterType.DATE_RANGE) {
      const btw = value.match(/^\$btw:(.*),(.*)$/);
      if (btw && btw[1] && btw[2]) {
        const from = parseDateTime(btw[1], null) ?? null;
        const to = parseDateTime(btw[2], null) ?? null;
        if (from || to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, to];
      } else if (value.startsWith("$gte:") || value.startsWith("$gt:")) {
        const from = parseDateTime(value.split(":")[1], null);
        if (from) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, null];
      } else if (value.startsWith("$lte:") || value.startsWith("$lt:")) {
        const to = parseDateTime(value.split(":")[1], null);
        if (to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [null, to];
      } else {
        defaultValues[key.substring("filter.".length)] = [null, null];
      }
    } else if (type === FilterType.NUMBER_RANGE) {
      const btw = value.match(/^\$btw:(.*),(.*)$/);
      if (btw && btw[1] && btw[2]) {
        const from = parseInt(btw[1], 10) || null;
        const to = parseInt(btw[2], 10) || null;
        if ((typeof from === "number" && isNaN(from)) || (typeof to === "number" && isNaN(to))) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, to];
      } else {
        const match = value.match(/^\$(gt|gte|lt|lte):\d+$/);
        if (match && match[1] && match[2]) {
          const from = parseInt(match[2], 10);
          if (from) {
            filterIsActive = true;
          }
          defaultValues[key.substring("filter.".length)] = ["gt", "gte"].includes(match[1])
            ? [from, null]
            : [null, from];
        } else {
          defaultValues[key.substring("filter.".length)] = [null, null];
        }
      }
    } else {
      defaultValues[key.substring("filter.".length)] = value;
      if (value && value !== "") {
        filterIsActive = true;
      }
    }
  }
  return { filterIsActive, defaultValues };
};

type FilterTextColumn = { type: FilterType.TEXT | FilterType.DATE_RANGE | FilterType.BOOLEAN; label: string };
type FilterNumberRangeColumn = { type: FilterType.NUMBER_RANGE; label: string; options?: NumericFormatProps };
type FilterOptionsColumn = { type: FilterType.OPTIONS; options?: Record<string, string> };

export type FilterPaginationColumn<T extends { data: { id: number }[]; meta: ResponseMeta }> = {
  type: FilterType.PAGINATION;
  label: string;
  queryKey: ReadonlyArray<unknown>;
  queryFn: (query: PaginateQuery<unknown>) => Promise<T>;
  optionLabel: (model: T["data"][number]) => string;
  idField?: string;
  groupBy?: (model: T["data"][number]) => string;
};
type FilterColumn<T extends { data: { id: number }[]; meta: ResponseMeta }> =
  | FilterOptionsColumn
  | FilterTextColumn
  | FilterNumberRangeColumn
  | FilterPaginationColumn<T>;

export const FilterButton = ({
  className,
  filter,
  onSubmitParams,
  onParseParams,
}: {
  onParseParams?: (params: Record<string, unknown>) => Record<string, unknown>;
  onSubmitParams?: (params: Record<string, unknown>) => Record<string, unknown>;
  filter: Record<string, FilterColumn<any>>;
  className?: string;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { filterIsActive, defaultValues } = getDefaultValues(searchParams, filter);

  const { handleSubmit, register, setValue, control, getValues } = useForm<Record<string, unknown>>({
    defaultValues: async () => (onParseParams ? onParseParams(defaultValues) : defaultValues),
  });

  const paginationValues = useRef<Record<string, Record<string, string>>>({});

  useEffect(() => {
    for (const [key, f] of Object.entries(filter)) {
      if (f.type === FilterType.PAGINATION) {
        const ids: (number | string)[] = (
          Array.isArray(defaultValues[key]) ? defaultValues[key] : [defaultValues[key]]
        ).filter((itemId) => itemId && !paginationValues.current[key]?.[itemId]);

        if (ids.length > 0) {
          f.queryFn({ [`filter.${f.idField ?? "id"}`]: [`$in:${ids.join(",")}`] }).then((res) => {
            paginationValues.current[key] = paginationValues.current[key] ?? {};
            for (const item of res.data) {
              const id = item[f.idField ?? "id"];
              paginationValues.current[key][id.toString()] = f.optionLabel(item);
            }
          });
        }
      }
    }
  }, []);

  const watched = useWatch({ control });

  return (
    <Popover
      placement="bottom-end"
      popoverClassName="w-55 sm:w-70 rounded-box!"
      showOnClick
      showOnHover={false}
      borderColor="border-gray-300"
      backgroundColor="bg-gray-200"
      title={(ref, props) => (
        <button ref={ref} {...props} className={cx("btn btn-xs", { "btn-accent": filterIsActive }, className)}>
          {filterIsActive ? <FunnelSolidIcon className="size-4" /> : <FunnelIcon className="size-4" />}
        </button>
      )}
    >
      <form
        className="px-2 py-3 space-y-2"
        onSubmit={handleSubmit(
          (v) => {
            const params: Record<string, string | string[]> = { page: "" };

            v = onSubmitParams ? onSubmitParams(v) : v;

            for (const [key, val] of Object.entries(v)) {
              if (filter[key].type === FilterType.NUMBER_RANGE) {
                if (Array.isArray(val)) {
                  if (!val[0] && !val[1]) {
                    params[`filter.${key}`] = "";
                  } else if (!val[1]) {
                    params[`filter.${key}`] = `$gte:${val[0]}`;
                  } else if (!val[0]) {
                    params[`filter.${key}`] = `$lte:${val[1]}`;
                  } else {
                    params[`filter.${key}`] = `$btw:${val[0]},${val[1]}`;
                  }
                }
              } else if (filter[key].type === FilterType.BOOLEAN) {
                if (val === true) {
                  params[`filter.${key}`] = "1";
                } else if (val === false) {
                  params[`filter.${key}`] = "0";
                } else {
                  params[`filter.${key}`] = "";
                }
              } else if (filter[key].type === FilterType.DATE_RANGE) {
                if (Array.isArray(val)) {
                  const from = val[0] instanceof Date && isValid(val[0]) ? val[0] : undefined;
                  const to = val[1] instanceof Date && isValid(val[1]) ? val[1] : undefined;
                  if (!from && !to) {
                    params[`filter.${key}`] = "";
                  } else if (!from) {
                    params[`filter.${key}`] = `$lte:${format(to!, "yyyy-MM-dd")}`;
                  } else if (!to) {
                    params[`filter.${key}`] = `$gte:${format(from, "yyyy-MM-dd")}`;
                  } else {
                    params[`filter.${key}`] =
                      `$btw:${format(startOfDay(from), "yyyy-MM-dd HH:mm:ss")},${format(endOfDay(to), "yyyy-MM-dd HH:mm:ss")}`;
                  }
                }
              } else if (filter[key].type === FilterType.PAGINATION) {
                if (Array.isArray(val)) {
                  if (val.length === 0) {
                    params[`filter.${key}`] = "";
                  } else {
                    params[`filter.${key}`] = `$in:${val.join(",")}`;
                  }
                } else {
                  params[`filter.${key}`] = val?.toString() ?? "";
                }
              } else {
                if (!val || val === "") {
                  params[`filter.${key}`] = "";
                } else {
                  params[`filter.${key}`] = val.toString();
                }
              }
            }

            router.replace(setPartialParams(params, searchParams));
          },
          (e) => {
            toast.error(t("general.error"));
            console.error(e);
          },
        )}
      >
        {Object.entries(filter).map(([key, v], i) => (
          <div key={`${key}-${i}`} className="">
            {v.type === FilterType.TEXT && <TextFormField register={register} label={v.label} name={key} size="sm" />}
            {v.type === FilterType.NUMBER_RANGE && (
              <div className="join">
                <NumberFormField
                  className="join-item"
                  control={control}
                  label={t("general.fromWithArgs", { value: v.label.toLowerCase() })}
                  name={`${key}.0`}
                  size="sm"
                  options={v.options}
                />
                <NumberFormField
                  className="join-item"
                  control={control}
                  label={t("general.toWithArgs", { value: v.label.toLowerCase() })}
                  name={`${key}.1`}
                  size="sm"
                  options={v.options}
                />
              </div>
            )}
            {v.type === FilterType.DATE_RANGE && (
              <div className="join">
                <DateFormField
                  useDate
                  className="join-item"
                  control={control}
                  label={t("general.fromWithArgs", { value: v.label.toLowerCase() })}
                  name={`${key}.0`}
                  matcher={
                    Array.isArray(watched[key]) && watched[key][1] instanceof Date
                      ? { after: watched[key][1] }
                      : undefined
                  }
                  size="sm"
                />
                <DateFormField
                  useDate
                  className="join-item"
                  control={control}
                  label={t("general.toWithArgs", { value: v.label.toLowerCase() })}
                  name={`${key}.1`}
                  matcher={
                    Array.isArray(watched[key]) && watched[key][0] instanceof Date
                      ? { before: watched[key][0] }
                      : undefined
                  }
                  size="sm"
                />
              </div>
            )}
            {v.type === FilterType.PAGINATION && (
              <Watch
                control={control}
                name={key}
                render={(keyVal) => (
                  <>
                    <SelectPaginatedFromApiField
                      value={null}
                      queryFn={v.queryFn}
                      queryKey={v.queryKey}
                      optionLabel={v.optionLabel}
                      optionValue={v.idField ? (c) => c[v.idField!] : undefined}
                      groupBy={v.groupBy}
                      portalEnabled
                      label={v.label}
                      name={key}
                      size="sm"
                      onChange={(val) => {
                        if (typeof keyVal === "undefined" || keyVal === null) {
                          keyVal = [];
                        }

                        const id: number | string = val[v.idField ?? "id"];
                        paginationValues.current[key] = paginationValues.current[key] ?? {};
                        if (!paginationValues.current[key][id.toString()]) {
                          paginationValues.current[key][id.toString()] = v.optionLabel(val);
                        }
                        if (Array.isArray(keyVal)) {
                          const b = [...keyVal, id];
                          setValue(key, b);
                          return;
                        }

                        setValue(key, id);
                      }}
                    />
                    {Array.isArray(keyVal) &&
                      keyVal.length > 0 &&
                      keyVal.map((val, i) => (
                        <span className="badge badge-xs" key={JSON.stringify(val) + "_" + i}>
                          {paginationValues.current[key]?.[val] ?? val}

                          <button
                            type="button"
                            onClick={() => {
                              if (Array.isArray(keyVal)) {
                                const b = [...keyVal];
                                b.splice(i, 1);
                                setValue(key, b);
                              } else {
                                setValue(key, undefined);
                              }
                            }}
                          >
                            <XMarkIcon className="size-3" />
                          </button>
                        </span>
                      ))}
                  </>
                )}
              />
            )}
            {v.type === FilterType.BOOLEAN && (
              <div className="join w-full">
                <button
                  type="button"
                  className={cx("btn grow btn-xs join-item", { "btn-neutral": watched[key] === true })}
                  onClick={() => (watched[key] === true ? setValue(key, undefined) : setValue(key, true))}
                >
                  {v.label.toUpperCase()}
                </button>
                <button
                  onClick={() => (watched[key] === false ? setValue(key, undefined) : setValue(key, false))}
                  className={cx("btn grow btn-xs join-item", { "btn-neutral": watched[key] === false })}
                  type="button"
                >{`${t("general.no").toUpperCase()} ${v.label.toUpperCase()}`}</button>
              </div>
            )}
            {v.type === FilterType.OPTIONS && (
              <div className={cx("join w-full", { "join-vertical": Object.entries(v.options ?? {}).length > 2 })}>
                {Object.entries(v.options ?? {}).map(([value, label]) => (
                  <button
                    key={value}
                    className={cx("btn grow btn-xs join-item", { "btn-neutral": watched[key] === value })}
                    type="button"
                    onClick={() => (watched[key] === value ? setValue(key, undefined) : setValue(key, value))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <SaveButton className="btn-sm w-full">{t("general.filter")}</SaveButton>
      </form>
    </Popover>
  );
};
