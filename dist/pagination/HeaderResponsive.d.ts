import React from "react";
type ObjOrNode = object | ((isVisible: boolean) => React.ReactNode);
export declare const HeaderResponsive: <T extends ObjOrNode>({ renderVisible, renderDropdown, heightClassName, elements, }: {
    heightClassName: string;
    renderVisible: (r: T, i: number) => React.ReactNode;
    renderDropdown: (r: T, i: number, closeFn: () => void) => React.ReactNode;
    elements: T[];
}) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=HeaderResponsive.d.ts.map