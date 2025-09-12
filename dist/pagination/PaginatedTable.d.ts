import React from "react";
import { ResponseMeta } from "@/utils";
import { ColumnType } from "@/pagination/columnTypes";
export declare const PaginatedTable: <TModel extends {
    id: number;
}>({ pagination, title, sortEnum, extraHeading, columns, caption, pathname, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, displayFilters, configName, }: {
    caption?: React.ReactNode;
    bulkActions?: {
        children: React.ReactNode;
        onSelect: (models: number[]) => Promise<boolean | void>;
    }[];
    sortEnum: any;
    extraHeading?: React.ReactNode;
    isSearchable?: boolean;
    title: React.ReactNode;
    pathname: string;
    addNew?: string;
    displayFilters?: {
        name: string;
        filters: string[];
    }[];
    searchableShortcuts?: {
        link: Record<string, string>;
        text: string;
    }[][];
    columns: ColumnType<TModel>[];
    pagination: {
        data: TModel[];
        meta: ResponseMeta;
    };
    addNewText?: string;
    configName?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TableLink: ({ href, children, className, isLink, ...rest }: {
    className?: string;
    href: string;
    children: React.ReactNode;
    isLink?: boolean;
}) => string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
export declare const FilterLink: ({ children, className, params, }: {
    className: string;
    children: React.ReactNode;
    params: Record<string, string>;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PaginatedTable.d.ts.map