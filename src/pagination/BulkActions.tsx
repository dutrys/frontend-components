import React from "react";
import { useTranslations } from "next-intl";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import styles from "./BulkActions.module.css";
import { Popover } from "../dialog/Popover";

export const BulkActions = ({
  bulkActions,
  disabled,
}: {
  disabled?: boolean;
  bulkActions: {
    children: React.ReactNode;
    onSelect: () => Promise<boolean | void>;
  }[];
}) => {
  const t = useTranslations();

  if (disabled) {
    return (
      <button disabled className="btn btn-xs btn-primary uppercase">
        {t("pagination.bulkActions")} <ChevronDownIcon className="size-4" />
      </button>
    );
  }

  return (
    <Popover
      disabled={disabled}
      showOnClick
      backgroundColor="bg-primary"
      borderColor="border-primary"
      title={(ref, props) => (
        <button disabled={disabled} ref={ref} {...props} className="btn btn-xs btn-primary uppercase">
          {t("pagination.bulkActions")} <ChevronDownIcon className="size-4" />
        </button>
      )}
    >
      {(close) => {
        return (
          <ul className={`menu px-1 py-0 ${styles.menu}`}>
            <BulkDropDownActions
              bulkActions={bulkActions.map((b) => ({
                ...b,
                onSelect: async () => {
                  close();
                  return b.onSelect();
                },
              }))}
            />
          </ul>
        );
      }}
    </Popover>
  );
};

export const BulkDropDownActions = ({
  bulkActions,
  disabled,
}: {
  disabled?: boolean;
  bulkActions: {
    children: React.ReactNode;
    onSelect: () => Promise<boolean | void>;
  }[];
}) => {
  return (
    <>
      {bulkActions.map((bulkAction, i) => {
        return (
          <li key={i}>
            <button type="button" disabled={disabled} onClick={() => bulkAction.onSelect()}>
              {bulkAction.children}
            </button>
          </li>
        );
      })}
    </>
  );
};
