import React from "react";
export declare const HeaderResponsivePaginated: ({ elements, bulkActions, }: {
    elements: ({
        link: Record<string, string>;
        text: string;
    }[] | ((isVisible: boolean) => React.ReactNode) | React.ReactNode)[];
    bulkActions?: {
        actions: {
            children: React.ReactNode;
            onSelect: (models: number[]) => Promise<boolean | void>;
        }[];
        selected: number[];
        setSelected: (selected: number[]) => void;
    };
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=HeaderResponsivePaginated.d.ts.map