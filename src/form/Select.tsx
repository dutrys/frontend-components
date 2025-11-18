import React, { Fragment } from "react";
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

export type SelectProps = {
  size?: "sm" | "xs";
  name?: string;
  inputRef?: any;
  placeholder?: string;
  value: { label: string; value: number | string } | null;
  className?: string;
  onChange: (model: { label: string; value: number | string } | null) => void;
  disabled?: boolean;
  required?: boolean;
  empty?: string;
  header?: React.ReactNode;
  beforeOptions?: React.ReactNode;
  afterOptions?: React.ReactNode;
  options: { label: string; value: number | string }[];
};

export const Select = ({
  onChange,
  disabled,
  required,
  inputRef,
  options,
  name,
  value,
  size,
  className,
  placeholder,
  empty,
  beforeOptions,
  header,
  afterOptions,
  ...rest
}: SelectProps) => {
  const t = useTranslations();

  const { refs, floatingStyles } = useFloating({
    placement: "bottom-start",
    middleware: [
      floatingSize({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Combobox<{ label: string; value: number | string } | null>
      immediate
      data-testid="select"
      disabled={disabled}
      value={value}
      onChange={onChange}
      {...rest}
    >
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
            <ComboboxInput<{ label: string; value: string }>
              required={required}
              ref={inputRef}
              data-testid="select-input"
              placeholder={placeholder}
              onFocus={(e) => e?.target?.select()}
              autoComplete="off"
              name={name}
              displayValue={(model) => model?.label}
            />
            {header}
            {!required && value && (
              <button className="z-1 cursor-pointer" type="button" onClick={() => onChange(null)}>
                <XMarkIcon className="size-4" />
              </button>
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
          <Portal>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div style={{ ...floatingStyles, zIndex: 2000 }} ref={refs.setFloating}>
                <ComboboxOptions className="absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm">
                  {beforeOptions}
                  {!required && (
                    <SelectOption size={size} data-testid="select-option-empty" key="empty" value={null}>
                      {empty || t("selectFromApi.select")}
                    </SelectOption>
                  )}
                  {options.length === 0 ? (
                    <div className="cursor-default select-none py-2 px-4 text-base-content/60">
                      <span className={cx({ "text-xs": "xs" === size || "sm" === size })}>
                        {t("selectFromApi.nothingFound")}
                      </span>
                    </div>
                  ) : (
                    options.map((model, i: number) => (
                      <SelectOption size={size} data-testid={`select-option-${i}`} key={model.value} value={model}>
                        {model.label}
                      </SelectOption>
                    ))
                  )}

                  {afterOptions}
                </ComboboxOptions>
              </div>
            </Transition>
          </Portal>
        </div>
      )}
    </Combobox>
  );
};

export const SelectOption = ({
  value,
  size,
  children,
  ...rest
}: {
  children: React.ReactNode;
  value: unknown;
  size?: "xs" | "sm";
}) => (
  <ComboboxOption
    {...rest}
    className={({ focus }) =>
      cx(`relative cursor-default select-none`, {
        "p-2": size === "xs" || size === "sm",
        "py-2 px-4": !size,
        "bg-primary text-white": focus,
        "text-gray-900": !focus,
      })
    }
    value={value}
  >
    {({ selected, focus }) => (
      <>
        <span
          className={cx("block truncate", {
            "text-white": focus,
            "pr-3 font-bold": selected,
            "font-normal": !selected,
            "text-xs": "xs" === size || "sm" === size,
          })}
        >
          {children}
        </span>
        {selected ? (
          <span
            className={cx("absolute inset-y-0 right-1 flex items-center pl-3", {
              "text-white": focus,
              "text-teal-600": !focus,
            })}
          >
            <CheckIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : null}
      </>
    )}
  </ComboboxOption>
);
