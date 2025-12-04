import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectProps } from "./Select";
import { LoadingComponent } from "../Loading";

export type SelectFromApiProps<TModel = unknown> = {
  queryFn: () => Promise<TModel[]>;
  queryKey: ReadonlyArray<any>;
  value: number | string | null;
  onChange: (model: TModel | null) => void;
  optionLabel?: (model: TModel) => string;
  optionValue?: (model: TModel) => string | number;
  filter?: (model: TModel, query: string) => boolean;
} & Omit<SelectProps<TModel>, "onChange" | "optionLabel" | "value" | "options">;

export const SelectFromApi = <TModel = unknown,>({
  name,
  value,
  queryKey,
  queryFn,
  optionLabel = (model) => (model as any).name,
  optionValue = (model) => (model as any).id,
  filter,
  ...rest
}: SelectFromApiProps<TModel>) => {
  const [query, setQuery] = useState("");
  const { isLoading, data, refetch } = useQuery<TModel[]>({
    enabled: !rest.disabled,
    queryKey: [...queryKey, rest.disabled],
    queryFn: () => {
      if (rest.disabled) {
        return Promise.reject();
      }
      return queryFn();
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    void refetch();
  }, [refetch, query]);

  return (
    <Select<TModel>
      {...rest}
      disabled={rest.disabled}
      onChange={rest.onChange}
      optionLabel={optionLabel}
      options={data ?? []}
      onQueryChange={setQuery}
      afterInput={isLoading ? <LoadingComponent loadingClassName="size-4 text-primary" /> : undefined}
      hideNoItemsOption={isLoading}
      value={
        typeof value === "number" || typeof value === "string"
          ? ((data || []).find((b: TModel) => optionValue(b) === value) ?? null)
          : (value ?? null)
      }
      afterOptions={
        <>
          {rest.afterOptions}
          {isLoading && <LoadingComponent className="my-2" />}
        </>
      }
    />
  );
};
