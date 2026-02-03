import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelSolidIcon } from "@heroicons/react/24/solid";
import cx from "classnames";
import { useForm, useWatch } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { useRouter } from "next-nprogress-bar";
import { format, isValid } from "date-fns";
import { NumericFormatProps } from "react-number-format";
import { PaginateQuery, ResponseMeta, setPartialParams } from "../utils/paginate";
import { stringToDate } from "../utils/date";
import { Popover } from "../dialog/Popover";
import {
  DateFormField,
  NumberFormField,
  SaveButton,
  SelectPaginatedFromApiFormField,
  TextFormField,
} from "../form/Input";

export enum FilterType {
  TEXT = "text",
  BOOLEAN = "boolean",
  PAGINATION = "pagination",
  DATE_RANGE = "date-range",
  NUMBER_RANGE = "number-range",
}

const getDefaultValues = (
  searchParams: URLSearchParams,
  filter: Record<string, FilterColumn<{ data: { id: number }[]; meta: ResponseMeta }>>,
) => {
  const defaultValues: Partial<Record<string, unknown>> = {};
  let filterIsActive = false;
  for (const [key, value] of Array.from(searchParams.entries())) {
    if (!key.startsWith("filter.") || filter[key.substring("filter.".length)] === undefined) {
      continue;
    }

    const type = filter[key.substring("filter.".length)]?.type;
    if (type === FilterType.PAGINATION) {
      const val = parseInt(value, 10) || null;
      defaultValues[key.substring("filter.".length)] = val;
      if (val) {
        filterIsActive = true;
      }
    } else if (type === FilterType.BOOLEAN) {
      if (value === "1" || value === "true") {
        defaultValues[key.substring("filter.".length)] = true;
      } else if (value === "0" || value === "false") {
        defaultValues[key.substring("filter.".length)] = false;
      }
    } else if (type === FilterType.DATE_RANGE) {
      if (value.startsWith("$btw:")) {
        const [fromString, toString] = value.split(":")[1].split(",");
        const from = stringToDate(fromString) ?? null;
        const to = stringToDate(toString) ?? null;
        if (from || to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, to];
      } else if (value.startsWith("$gte:") || value.startsWith("$gt:")) {
        const from = stringToDate(value.split(":")[1]) ?? null;
        if (from) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, null];
      } else if (value.startsWith("$lte:") || value.startsWith("$lt:")) {
        const to = stringToDate(value.split(":")[1]) ?? null;
        if (to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [null, to];
      } else {
        defaultValues[key.substring("filter.".length)] = [null, null];
      }
    } else if (type === FilterType.NUMBER_RANGE) {
      if (value.startsWith("$btw:")) {
        const [fromString, toString] = value.split(":")[1].split(",");
        const from = parseInt(fromString, 10) || null;
        const to = parseInt(toString, 10) || null;
        if (from || to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, to];
      } else if (value.startsWith("$gte:") || value.startsWith("$gt:")) {
        const from = parseInt(value.split(":")[1], 10) || null;
        if (from) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [from, null];
      } else if (value.startsWith("$lte:") || value.startsWith("$lt:")) {
        const to = parseInt(value.split(":")[1], 10) || null;
        if (to) {
          filterIsActive = true;
        }
        defaultValues[key.substring("filter.".length)] = [null, to];
      } else {
        defaultValues[key.substring("filter.".length)] = [null, null];
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
export type FilterPaginationColumn<T extends { data: { id: number }[]; meta: ResponseMeta }> = {
  type: FilterType.PAGINATION;
  label: string;
  queryKey: ReadonlyArray<unknown>;
  queryFn: (query: PaginateQuery<unknown>) => Promise<T>;
  optionLabel: (model: T["data"][number]) => string;
  groupBy?: (model: T["data"][number]) => string;
};
type FilterColumn<T extends { data: { id: number }[]; meta: ResponseMeta }> =
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter: Record<string, FilterColumn<any>>;
  className?: string;
}) => {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { filterIsActive, defaultValues } = getDefaultValues(searchParams, filter);

  const { handleSubmit, register, setValue, control } = useForm<Record<string, unknown>>({
    defaultValues: async () => (onParseParams ? onParseParams(defaultValues) : defaultValues),
  });

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
            const params: Record<string, string | string[]> = {};

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
                    params[`filter.${key}`] = `$btw:${format(from, "yyyy-MM-dd")},${format(to, "yyyy-MM-dd")}`;
                  }
                }
              } else if (filter[key].type === FilterType.PAGINATION) {
                params[`filter.${key}`] = val?.toString() ?? "";
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
            console.error(e); // eslint-disable-line no-console
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
              <SelectPaginatedFromApiFormField
                queryFn={v.queryFn}
                queryKey={v.queryKey}
                optionLabel={v.optionLabel}
                groupBy={v.groupBy}
                portalEnabled
                control={control}
                label={v.label}
                name={key}
                size="sm"
              />
            )}
            {v.type === FilterType.BOOLEAN && (
              <div className="join w-full">
                <button
                  className={cx("btn grow btn-sm join-item", { "btn-success": watched[key] === true })}
                  type="button"
                  onClick={() => (watched[key] === true ? setValue(key, undefined) : setValue(key, true))}
                >
                  {v.label}
                </button>
                <button
                  onClick={() => (watched[key] === false ? setValue(key, undefined) : setValue(key, false))}
                  className={cx("btn grow btn-sm join-item", { "btn-error": watched[key] === false })}
                  type="button"
                >{`${t("general.no")} ${v.label.toLowerCase()}`}</button>
              </div>
            )}
          </div>
        ))}
        <SaveButton className="btn-sm w-full">{t("general.filter")}</SaveButton>
      </form>
    </Popover>
  );
};
