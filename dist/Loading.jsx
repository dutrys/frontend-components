import React from "react";
export const LoadingComponent = ({ style, className, loadingClassName, size, }) => (<div className={`flex justify-center ${className}`} style={style}>
    <span className={`${loadingClassName || "text-primary"} loading loading-spinner ${size}`}></span>
  </div>);
//# sourceMappingURL=Loading.jsx.map