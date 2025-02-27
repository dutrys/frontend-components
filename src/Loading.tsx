import React from "react";

export const LoadingComponent = ({
  style,
  className,
  loadingClassName,
  size,
}: {
  className?: string;
  loadingClassName?: string;
  size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
  style?: React.CSSProperties;
}) => (
  <div className={`flex justify-center ${className}`} style={style}>
    <span className={`${loadingClassName || "text-primary"} loading loading-spinner ${size}`}></span>
  </div>
);
