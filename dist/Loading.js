import { jsx as _jsx } from "react/jsx-runtime";
export const LoadingComponent = ({ style, className, loadingClassName, size, }) => (_jsx("div", { className: `flex justify-center ${className}`, style: style, children: _jsx("span", { className: `${loadingClassName || "text-primary"} loading loading-spinner ${size}` }) }));
//# sourceMappingURL=Loading.js.map