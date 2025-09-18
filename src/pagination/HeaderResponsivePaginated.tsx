import React from "react";
import { BulkActions, BulkDropDownActions } from "@/pagination/BulkActions";
import { Link } from "@/pagination/Link";
import { HeaderResponsive } from "@/pagination/HeaderResponsive";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { isParamActive, setPartialParams } from "@/utils/paginate";

export const HeaderResponsivePaginated = ({
  elements,
  bulkActions,
}: {
  elements: { link: Record<string, string>; text: string }[][];
  bulkActions?: {
    actions: {
      children: React.ReactNode;
      onSelect: (models: number[]) => Promise<boolean | void>;
    }[];
    selected: number[];
    setSelected: (selected: number[]) => void;
  };
}) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  return (
    <HeaderResponsive
      heightClassName="h-12"
      elements={elements}
      renderDropdown={(shortcuts, i) => {
        return (
          <React.Fragment key={i}>
            {i !== 0 && <li className="disabled"></li>}
            {shortcuts.map(({ link, text }) => {
              if (bulkActions && bulkActions.actions.length > 0 && link.bulk === "bulk") {
                return (
                  <>
                    <li className="menu-disabled">
                      <span>{t("pagination.bulkActions")}</span>
                    </li>
                    <BulkDropDownActions
                      disabled={bulkActions.selected.length === 0}
                      bulkActions={bulkActions.actions.map((b) => ({
                        children: b.children,
                        onSelect: async () => {
                          const success = await b.onSelect(bulkActions.selected);
                          if (success) {
                            bulkActions.setSelected([]);
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
        if (i === 0 && bulkActions && bulkActions.actions.length > 0) {
          return (
            <BulkActions
              disabled={bulkActions.selected.length === 0}
              bulkActions={bulkActions.actions.map((b) => ({
                children: b.children,
                onSelect: async () => {
                  const success = await b.onSelect(bulkActions.selected);
                  if (success) {
                    bulkActions.setSelected([]);
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
  );
};
