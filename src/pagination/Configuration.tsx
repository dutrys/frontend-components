import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useMotionValue, Reorder, useDragControls, motion, animate, DragControls, MotionValue } from "framer-motion";
import { AdjustmentsHorizontalIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/16/solid";
import { Popover } from "@/dialog";
import { ColumnType, isActionColumn } from "@/pagination/columnTypes";

function AddNew({ onAdd, names }: { onAdd: (name: string) => void; names: string[] }) {
  const [name, setName] = useState("");
  const t = useTranslations();
  return (
    <div className="join w-full">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input input-bordered join-item grow"
        type="text"
      />
      <button
        disabled={name.trim() === "" || names.includes(name)}
        className="btn btn-success join-item"
        onClick={() => {
          if (name.trim() === "") {
            return;
          }

          onAdd(name);
          setName("");
        }}
      >
        {t("general.addNew")}
      </button>
    </div>
  );
}

export const PaginationConfiguration = ({
  title,
  columns,
  setConfig,
}: {
  setConfig: (config: { index: number; checked: boolean }[]) => void;
  title: string;
  columns: ColumnType<any>[];
}) => {
  const [show, setShow] = useState(false);
  const t = useTranslations();

  const configsFromLocalStorage = useMemo(() => {
    const configs = getPaginationConfigsFromLocalStorage(title, columns) as Record<
      string,
      { index: number; checked: boolean; column: ColumnType<any> }[]
    >;

    for (const configName of Object.keys(configs)) {
      for (let i = 0; i < configs[configName].length; i++) {
        configs[configName][i].column = columns[configs[configName][i].index];
      }
    }
    return configs;
  }, [title]);
  const [configs, setConfigs] =
    useState<Record<string, { column: ColumnType<any>; checked: boolean; index: number }[]>>(configsFromLocalStorage);

  const configNameFromLocalStorage = useMemo(() => {
    const config = localStorage.getItem(title) || "default";
    if (typeof configsFromLocalStorage[config] === "object") {
      return config;
    }
    return "default";
  }, [title, configsFromLocalStorage]);

  const [activeConfigName, setActiveConfigName] = useState(configNameFromLocalStorage);

  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Popover
        hoverClassName="bg-slate-600"
        title={(ref, p) => (
          <button
            ref={ref}
            {...p}
            onClick={() => setShow(!show)}
            className={`btn btn-neutral btn-xs ${p.className ? p.className : undefined}`}
          >
            <AdjustmentsHorizontalIcon className="size-4" />
          </button>
        )}
      >
        {(close) => {
          return (
            <ul className="p-1 menu menu-sm text-white">
              {Object.keys(configs).map((configName) => (
                <li key={configName}>
                  <a
                    href="#"
                    className="hover:bg-slate-600 pl-2"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.setItem(title, configName);
                      setConfig(configs[configName]);
                      setActiveConfigName(configName);
                      close();
                    }}
                  >
                    {activeConfigName === configName ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <div className="size-4"></div>
                    )}
                    {configName === "default" ? t("pagination.configuration.defaultTitle") : configName}
                  </a>
                </li>
              ))}
            </ul>
          );
        }}
      </Popover>
      <dialog className={`modal ${show ? "modal-open" : ""}`} onClose={() => setShow(false)}>
        <div className="modal-box max-h-[calc(100vh-150px)] overflow-y-auto mt-10">
          <h3 className="font-bold text-lg">{t("pagination.configuration.title")}</h3>

          <div className="space-y-4 mt-4">
            {Object.entries(configs).map(([configName, value]) => {
              if (configName === "default") {
                return (
                  <div
                    tabIndex={0}
                    className={`collapse bg-base-200 border-base-300 border ${open === configName ? "collapse-open" : "collapse-close"}`}
                    key={configName}
                  >
                    <div
                      className="collapse-title font-semibold"
                      onClick={() => setOpen(configName === open ? null : configName)}
                    >
                      {t("pagination.configuration.defaultTitle")}
                    </div>
                    <div className="collapse-content text-sm space-y-2">
                      {value.map((item, index) => (
                        <div
                          className="flex justify-between items-center p-2 bg-base-100 rounded-xl border border-border shadow-sm grow-0"
                          key={index}
                        >
                          <label>
                            <input disabled type="checkbox" checked className="checkbox checkbox-xs mr-2" />
                            {isActionColumn(item.column)
                              ? t("pagination.configuration.actionColumn")
                              : item.column.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  tabIndex={0}
                  className={`collapse bg-base-200 border-base-300 border ${open === configName ? "collapse-open" : "collapse-close"}`}
                  key={configName}
                >
                  <div
                    className="collapse-title font-semibold p-4!"
                    onClick={() => setOpen(configName === open ? null : configName)}
                  >
                    <div className="flex">
                      <div className="grow">{configName}</div>

                      <button
                        className="btn btn-xs btn-circle btn-error btn-ghost"
                        onClick={() => {
                          setConfigs((configs) => {
                            const newConfigs = { ...configs };
                            delete newConfigs[configName];
                            return newConfigs;
                          });
                          if (open === configName) {
                            setOpen(null);
                          }
                        }}
                      >
                        <XMarkIcon className="size-4" />
                      </button>
                    </div>
                  </div>
                  <div className="collapse-content text-sm">
                    <OrderColumns
                      name={configName}
                      items={value}
                      setOrder={(c) => setConfigs((oldCfg) => ({ ...oldCfg, [configName]: c }))}
                    />
                  </div>
                </div>
              );
            })}

            <AddNew
              names={Object.keys(configs)}
              onAdd={(name) => {
                setConfigs((oldCfg) => ({
                  ...oldCfg,
                  [name]: columns.map((c, index) => ({ column: c, checked: true, index })),
                }));
                setOpen(name);
              }}
            />
          </div>
          <hr className="my-4" />

          <div className="flex justify-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                localStorage.setItem(`${title}Columns`, JSON.stringify(configs));
                setShow(false);
              }}
            >
              {t("general.saveButton")}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop" onSubmit={() => setShow(false)}>
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export const OrderColumns = ({
  name,
  items,
  setOrder,
}: {
  name: string;
  items: { column: ColumnType<any>; checked: boolean; index: number }[];
  setOrder: (columns: { column: ColumnType<any>; checked: boolean; index: number }[]) => void;
}) => {
  return (
    <Reorder.Group axis="y" values={items} onReorder={setOrder} className="space-y-2 w-full max-w-2xl mx-auto">
      {items.map((column, i) => (
        <ColumnItem
          onChange={(e) => {
            const itemCopy = [...items];
            const col = itemCopy.find((c) => c === column);
            if (col) {
              col.checked = e.target.checked;
              setOrder(itemCopy);
            }
          }}
          key={`${name}-${isActionColumn(column.column) ? "action" : column.column.title}`}
          item={column}
        />
      ))}
    </Reorder.Group>
  );
};

function ReorderHandle({ dragControls }: { dragControls: DragControls }) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onPointerDown={(e) => {
        e.preventDefault();
        dragControls.start(e);
      }}
      className="cursor-grab text-base-content/40 active:cursor-grabbing p-2"
    >
      <ArrowsUpDownIcon className="size-4" />
    </motion.div>
  );
}
const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";

function useRaisedShadow(value: MotionValue<number>) {
  const boxShadow = useMotionValue(inactiveShadow);

  useEffect(() => {
    let isActive = false;
    value.on("change", (latest) => {
      const wasActive = isActive;
      if (latest !== 0) {
        isActive = true;
        if (isActive !== wasActive) {
          animate(boxShadow, "5px 5px 15px rgba(0,0,0,0.15)");
        }
      } else {
        isActive = false;
        if (isActive !== wasActive) {
          animate(boxShadow, inactiveShadow);
        }
      }
    });
  }, [value]);

  return boxShadow;
}

function ColumnItem({
  item,
  onChange,
}: {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  item: { column: ColumnType<any>; checked: boolean; index: number };
}) {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();
  const t = useTranslations();

  return (
    <Reorder.Item
      value={item}
      onChange={onChange}
      style={{ boxShadow, y }}
      dragListener={false}
      dragControls={dragControls}
      className="flex justify-between items-center pl-2 bg-base-100 rounded-xl border border-border shadow-sm"
    >
      <div className="grow-0">
        <label>
          <input
            disabled={isActionColumn(item.column)}
            type="checkbox"
            checked={item.checked}
            onChange={onChange}
            className="checkbox checkbox-xs mr-2"
          />
          {isActionColumn(item.column) ? t("pagination.configuration.actionColumn") : item.column.title}
        </label>
      </div>
      <ReorderHandle dragControls={dragControls} />
    </Reorder.Item>
  );
}

function getPaginationConfigsFromLocalStorage(
  configName: string,
  columns: Array<ColumnType<any>>,
): Record<"default" | string, { index: number; checked: boolean }[]> {
  const configString = localStorage.getItem(`${configName}Columns`);

  if (configString === null) {
    return { default: columns.map((c, i) => ({ index: i, checked: true })) };
  }

  const parsed = JSON.parse(configString || "null");
  if (typeof parsed !== "object" || parsed === null) {
    return { default: columns.map((c, i) => ({ index: i, checked: true })) };
  }

  for (const key of Object.keys(parsed)) {
    if (!Array.isArray(parsed[key])) {
      return { default: columns.map((c, i) => ({ index: i, checked: true })) };
    }

    if (parsed[key].length !== columns.length) {
      return { default: columns.map((c, i) => ({ index: i, checked: true })) };
    }

    for (const item of parsed[key]) {
      if (
        typeof item !== "object" ||
        item === null ||
        typeof item.index !== "number" ||
        typeof item.checked !== "boolean"
      ) {
        return { default: columns.map((c, i) => ({ index: i, checked: true })) };
      }
    }
  }

  return parsed;
}

function getPaginationConfigNameFromLocalStorage(configName: string) {
  return localStorage.getItem(configName) || "default";
}

export function getPaginationConfigs<TModel = any>(
  configName: string | undefined,
  columns: ColumnType<TModel>[],
): { index: number; checked: boolean }[] {
  if (!configName) {
    console.log("HAS NO CONFIG NAME");
    return columns.map((c, i) => ({ index: i, checked: true }));
  }

  const configs = getPaginationConfigsFromLocalStorage(configName, columns);
  const config = getPaginationConfigNameFromLocalStorage(configName);

  console.log(`HAVE "${config}" NAME, CONFIG`, configs);

  if (!configs[config]) {
    return configs.default;
  }

  return configs[config];
}
