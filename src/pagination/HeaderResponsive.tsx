import React, { useEffect, useRef, useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Popover } from "@/dialog";

const MORE_WIDTH = 40;

export const HeaderResponsive = <T extends object>({
  renderVisible,
  renderDropdown,
  heightClassName,
  elements,
}: {
  heightClassName: string;
  renderVisible: (r: T, i: number) => React.ReactNode;
  renderDropdown: (r: T, i: number, closeFn: () => void) => React.ReactNode;
  elements: T[];
}) => {
  const [showItems, setShowItems] = useState<number>(elements.length);
  const [elWidth, setElWidth] = useState<number[]>();
  const bar = useRef<HTMLDivElement>(null);
  const cont = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bar.current && !elWidth) {
      const navItems = Array.from(bar.current.getElementsByClassName("item"));
      setElWidth(navItems.map((nav) => (nav as HTMLUListElement).offsetWidth));
    }
  }, [bar, elWidth]);

  useEffect(() => {
    if (!cont.current || !elWidth) {
      return;
    }
    cont.current.style.maxWidth = `${elWidth.reduce((curr, acc) => acc + curr, 0)}px`;
    window.dispatchEvent(new Event("resize"));
  }, [cont, elWidth]);

  useEffect(() => {
    const checkNavbarWidth = () => {
      if (!elWidth || !bar.current) {
        return;
      }

      const currentWidth = bar.current.offsetWidth;
      let navItemsWidth = 0;
      for (let i = 0; i < elWidth.length; i++) {
        navItemsWidth += elWidth[i];

        if (navItemsWidth > currentWidth) {
          setShowItems(i);
          return;
        }
      }

      setShowItems(elWidth.length);
    };

    checkNavbarWidth();
    window.addEventListener("resize", checkNavbarWidth);

    return () => {
      window.removeEventListener("resize", checkNavbarWidth);
    };
  }, [showItems, bar, elWidth]);

  return (
    <>
      <div className="overflow-hidden grow" style={{ overflow: "hidden" }} ref={cont}>
        <div ref={bar} className="flex overflow-hidden">
          <div className={`${heightClassName || ""} w-full`}>
            <ul className={`flex flex-nowrap shrink justify-end flex-row ${heightClassName || ""} items-center`}>
              {elements.map((elementCollection, i) => (
                <li
                  key={i}
                  className={`item pr-2 shrink-0 flex-nowrap flex flex-row ${i >= showItems ? "hidden" : ""}`}
                >
                  {renderVisible(elementCollection, i)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {showItems < elements.length && (
        <div style={{ width: MORE_WIDTH }} className="pr-2">
          <Popover
            showOnClick
            borderColor="border-base-300"
            backgroundColor="bg-base-200"
            title={(ref, props) => (
              <a tabIndex={0} ref={ref} {...props} role="button" className="btn btn-xs w-full">
                <EllipsisHorizontalIcon className="h-3 w-3" />
              </a>
            )}
          >
            {(closeFn) => (
              <div className="max-h-96 overflow-y-auto">
                <ul tabIndex={0} className="menu px-1 py-0">
                  {[...elements].splice(showItems).map((e, i) => renderDropdown(e, i, closeFn))}
                </ul>
              </div>
            )}
          </Popover>
        </div>
      )}
    </>
  );
};
