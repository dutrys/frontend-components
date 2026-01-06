import React from "react";
import cx from "classnames";

export const Title = ({
  children,
  outerHeight,
  truncate,
  paddingLeft = "pl-4",
  noBackground,
}: {
  truncate?: boolean;
  outerHeight?: string;
  children: React.ReactNode;
  paddingLeft?: string;
  noOverlap?: boolean;
  noBackground?: boolean;
}) => {
  return (
    <>
      {!noBackground && (
        <div
          className={cx(
            "absolute bg-base-100/50 backdrop-blur-xs z-500 w-full left-0 top-0",
            { "h-16": !outerHeight },
            outerHeight,
          )}
        />
      )}
      <div
        className={cx(
          "h-16 absolute z-501 flex items-center font-bold ml-[var(--top-left-bar)] w-[calc(100vw-var(--sidebar-width)-var(--top-right-bar)-var(--top-left-bar))]",
          { truncate },
          paddingLeft,
        )}
      >
        {children}
      </div>
    </>
  );
};
