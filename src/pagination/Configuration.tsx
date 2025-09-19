import React, { ChangeEvent, useEffect, useMemo } from "react";
import { useMotionValue, Reorder, useDragControls, motion, animate, DragControls, MotionValue } from "framer-motion";
import { AdjustmentsHorizontalIcon, CheckIcon, Cog6ToothIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/16/solid";
import { ColumnType, isActionColumn } from "@/pagination/PaginatedTable";
import { StorageInterface } from "@/pagination/StorageInterface";
import { LoadingComponent } from "@/Loading";
import { captureException } from "@sentry/nextjs";
import toast from "react-hot-toast";
import { Popover } from "@/dialog/Popover";
import { isServerError } from "@/form/UseForm";
import { createPortal } from "react-dom";
import log from "eslint-plugin-react/lib/util/log";

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

export const PaginationConfiguration = <T = unknown,>({
  name,
  configName,
  columns,
  setConfigName,
  store,
  configs: configsFromRemote,
  refresh,
}: {
  setConfigName: (configName: string) => void;
  refresh: () => void;
  name: string;
  configName?: string;
  columns: ColumnType<T>[];
  store: StorageInterface<T>;
  configs: Record<string, { name: string; enabled: boolean }[]> | undefined;
}) => {
  const [show, setShow] = useState<boolean>();
  const t = useTranslations();
  const [isLoading, setLoading] = useState(false);

  const cc = useMemo(() => {
    if (!configsFromRemote) {
      return undefined;
    }
    const configs: Record<string, { name: string; enabled: boolean; column: ColumnType<any> }[]> = {};
    for (const [key, value] of Object.entries(configsFromRemote)) {
      value.forEach((c, i) => {
        configs[key] = configs[key] || [];
        const column = columns.find((col) => (isActionColumn(col) ? "action" : col.name) === c.name);
        if (column) {
          configs[key][i] = { name: c.name, column: column!, enabled: c.enabled };
        }
      });
    }
    return configs;
  }, [columns, configsFromRemote]);

  const [configs, setConfigs] = useState<
    Record<string, { column: ColumnType<any>; enabled: boolean; name: string }[]> | undefined
  >(cc);
  const [activeConfigName, setActiveConfigName] = useState(configName || "default");

  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Popover
        showOnClick
        hoverClassName="bg-slate-600"
        title={(ref, p) => (
          <button ref={ref} {...p} className={`btn btn-neutral btn-xs ${p.className ? p.className : undefined}`}>
            <AdjustmentsHorizontalIcon className="size-4" />
          </button>
        )}
      >
        {(close) =>
          configs ? (
            <ul className="p-1 menu menu-sm" data-theme="dim">
              {Object.keys(configs).map((configName) => (
                <li key={configName}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setConfigName(configName);
                      close();
                      store
                        .setConfigName(name, configName)
                        .then(() => {
                          toast(configName === "default" ? t("pagination.configuration.defaultTitle") : configName);
                          setActiveConfigName(configName);
                        })
                        .catch((e) => {
                          captureException(e);
                          toast.error(t("general.error"));
                        });
                    }}
                  >
                    {activeConfigName === configName ? (
                      <CheckIcon className="size-4" />
                    ) : (
                      <div className="size-4"></div>
                    )}
                    {configName === "default" ? t("pagination.configuration.defaultTitle") : configName}
                  </button>
                </li>
              ))}
              <li className="border-t border-t-base-content mx-2"></li>
              <li>
                <button
                  onClick={() => {
                    close();
                    setShow(!show);
                  }}
                >
                  <Cog6ToothIcon className="size-4" />
                  {t("general.settings")}
                </button>
              </li>
            </ul>
          ) : (
            <LoadingComponent />
          )
        }
      </Popover>
      {show !== undefined &&
        createPortal(
          <dialog className={`modal z-[1001] ${show ? "modal-open" : ""}`} onClose={() => setShow(false)}>
            <div className="modal-box max-h-[calc(100vh-150px)] overflow-y-auto mt-10">
              <h3 className="font-bold text-lg">{t("pagination.configuration.title")}</h3>

              {configs ? (
                <>
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
                              className="collapse-title font-semibold cursor-pointer"
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
                            className="collapse-title font-semibold cursor-pointer p-4!"
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
                          [name]: columns.map((c) => ({
                            column: c,
                            enabled: true,
                            name: isActionColumn(c) ? "action" : (c.name as string),
                          })),
                        }));
                        setOpen(name);
                      }}
                    />
                  </div>
                  <hr className="my-4" />

                  <div className="flex justify-center">
                    <button
                      disabled={isLoading}
                      className="btn btn-primary"
                      onClick={() => {
                        const configsWinNoColumns: Record<string, { name: string; enabled: boolean }[]> = {};
                        for (const [key, value] of Object.entries(configs)) {
                          if (key !== "default") {
                            configsWinNoColumns[key] = value.map((d) => ({ enabled: d.enabled, name: d.name }));
                          }
                        }

                        setLoading(true);
                        store
                          .setConfigs(name, configsWinNoColumns)
                          .then(() => {
                            setShow(false);
                            refresh();
                          })
                          .catch((e) => {
                            if (isServerError(e)) {
                              for (const value of Object.values(e.errors)) {
                                if (Array.isArray(value) && typeof value[0] === "string") {
                                  toast.error(value[0]);
                                  return;
                                }
                              }
                            }
                            toast.error(t("general.error"));
                            captureException(e);
                          })
                          .finally(() => setLoading(false));
                      }}
                    >
                      {t("general.saveButton")}
                    </button>
                  </div>
                </>
              ) : (
                <LoadingComponent />
              )}
            </div>
            <form method="dialog" className="modal-backdrop" onSubmit={() => setShow(false)}>
              <button>close</button>
            </form>
          </dialog>,
          document.body,
        )}
    </>
  );
};

export const OrderColumns = ({
  name,
  items,
  setOrder,
}: {
  name: string;
  items: { column: ColumnType<any>; enabled: boolean; name: string }[];
  setOrder: (columns: { column: ColumnType<any>; enabled: boolean; name: string }[]) => void;
}) => {
  return (
    <Reorder.Group axis="y" values={items} onReorder={setOrder} className="space-y-2 w-full max-w-2xl mx-auto">
      {items.map((column, i) => (
        <ColumnItem
          onChange={(e) => {
            const itemCopy = [...items];
            const col = itemCopy.find((c) => c === column);
            if (col) {
              col.enabled = e.target.checked;
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
  item: { column: ColumnType<any>; enabled: boolean; name: string };
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
          <input type="checkbox" checked={item.enabled} onChange={onChange} className="checkbox checkbox-xs mr-2" />
          {isActionColumn(item.column) ? t("pagination.configuration.actionColumn") : item.column.title}
        </label>
      </div>
      <ReorderHandle dragControls={dragControls} />
    </Reorder.Item>
  );
}
