import React, { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useFloating, size as floatingSize, autoUpdate } from "@floating-ui/react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Portal,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import cx from "classnames";

export function PortalSSR(props: { enabled?: boolean; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (props.enabled && mounted) {
    return <Portal>{props.children}</Portal>;
  }
  return props.children;
}

export type SelectProps<T> = {
  size?: "sm" | "xs";
  name?: string;
  inputRef?: any;
  placeholder?: string;
  value: T | null;
  className?: string;
  onChange: (model: T | null) => void;
  disabled?: boolean;
  required?: boolean;
  empty?: string;
  portalEnabled?: boolean;
  header?: React.ReactNode;
  beforeOptions?: React.ReactNode;
  afterOptions?: React.ReactNode;
  options: T[];
  minWidth?: number;
  maxHeight?: number;
  optionLabel?: (model: T) => string;
  groupBy?: (model: T) => string;
  onQueryChange?: (query: string) => void;
  afterInput?: React.ReactNode;
  hideNoItemsOption?: boolean;
};

export const Select = <T = unknown,>({
  onChange,
  disabled,
  required,
  inputRef,
  options,
  name,
  portalEnabled,
  optionLabel = (m) => (m as any).name,
  value,
  size,
  className,
  placeholder,
  groupBy,
  empty,
  beforeOptions,
  header,
  afterOptions,
  onQueryChange,
  minWidth = 100,
  maxHeight = 500,
  afterInput,
  hideNoItemsOption,
  ...rest
}: SelectProps<T>) => {
  const t = useTranslations();

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      floatingSize({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${Math.max(minWidth ?? 0, rects.reference.width)}px`,
            maxHeight: `${Math.min(availableHeight - 10, maxHeight)}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  let currentGroupBy: string | undefined = undefined;
  return (
    <Combobox<T | null> immediate data-testid="select" disabled={disabled} value={value} onChange={onChange} {...rest}>
      {({ open }) => (
        <div>
          <div
            className={cx("relative input input-bordered pr-1", className, {
              "w-full": !className?.includes("w-"),
              "input-sm gap-1": size === "sm",
              "input-xs gap-0.5": size === "xs",
            })}
            ref={refs.setReference}
          >
            <ComboboxInput<T | null>
              required={required}
              ref={inputRef}
              data-testid="select-input"
              placeholder={placeholder}
              onFocus={(e) => e?.target?.select()}
              autoComplete="off"
              name={name}
              displayValue={(model) => (model ? optionLabel(model) : "")}
              onChange={onQueryChange && ((event) => onQueryChange(event.target.value))}
            />
            {header}
            {!required && value ? (
              <button className="z-1 cursor-pointer" type="button" onClick={() => onChange(null)}>
                <XMarkIcon className="size-4" />
              </button>
            ) : (
              !open && afterInput
            )}
            <ComboboxButton
              data-testid="select-input-btn"
              className=""
              onClick={(e) => {
                (e.target as HTMLButtonElement)?.parentNode?.parentNode?.querySelector("input")?.select();
              }}
            >
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </ComboboxButton>
          </div>
          <PortalSSR enabled={portalEnabled}>
            <Transition as={Fragment} leave="transition-none">
              <div
                style={floatingStyles}
                ref={refs.setFloating}
                className="z-[2000] bg-base-100 mt-1 pb-1 w-full border-base-content/10 border overflow-y-auto rounded-box shadow-lg"
              >
                <ComboboxOptions>
                  {beforeOptions}
                  {!required && (
                    <SelectOption size={size} data-testid="select-option-empty" key="empty" value={null}>
                      {empty || t("selectFromApi.select")}
                    </SelectOption>
                  )}
                  {options.length === 0 && !hideNoItemsOption ? (
                    <div className="cursor-default select-none py-2 px-4 text-base-content/60">
                      <span className={cx({ "text-xs": "xs" === size || "sm" === size })}>
                        {t("selectFromApi.nothingFound")}
                      </span>
                    </div>
                  ) : (
                    options.map((model: T, i: number) => {
                      const group = groupBy?.(model);
                      let groupNode: React.ReactNode;
                      if (currentGroupBy !== group) {
                        currentGroupBy = group;
                        groupNode = (
                          <div className="sticky top-0 bg-base-100 font-bold z-10 p-2 text-xs text-base-content/40 border-b border-b-base-200 cursor-default select-none truncate">
                            {group}
                          </div>
                        );
                      }
                      return (
                        <React.Fragment key={`${optionLabel(model)}-${i}`}>
                          {groupNode}
                          <SelectOption
                            data-testid={`select-option-${i}`}
                            className={groupBy ? "pl-4" : undefined}
                            value={model}
                            size={size}
                          >
                            {optionLabel(model)}
                          </SelectOption>
                        </React.Fragment>
                      );
                    })
                  )}

                  {afterOptions}
                </ComboboxOptions>
              </div>
            </Transition>
          </PortalSSR>
        </div>
      )}
    </Combobox>
  );
};

export const SelectOption = ({
  value,
  size,
  children,
  className,
  ...rest
}: {
  children: React.ReactNode;
  value: unknown;
  className?: string;
  size?: "xs" | "sm";
}) => (
  <ComboboxOption
    {...rest}
    className={({ focus }) =>
      cx(`relative cursor-default select-none`, className, {
        "px-2 py-1": size === "xs" || size === "sm",
        "p-2": !size,
        "bg-primary text-white": focus,
        "text-base-content": !focus,
      })
    }
    value={value}
  >
    {({ selected, focus }) => (
      <>
        <span
          className={cx({
            "text-white": focus,
            "pr-3 font-bold": selected,
            "font-normal": !selected,
            "text-sm": !size,
            "text-xs": "xs" === size || "sm" === size,
          })}
        >
          {children}
        </span>
        {selected && (
          <span
            className={cx("absolute inset-y-0 right-1 flex items-center pl-3", {
              "text-white": focus,
              "text-teal-600": !focus,
            })}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        )}
      </>
    )}
  </ComboboxOption>
);
