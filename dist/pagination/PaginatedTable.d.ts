import { MoreActionType } from "./ActionButtons";
import React from "react";
import { StorageInterface } from "@/pagination/StorageInterface";
import { ResponseMeta } from "@/utils/paginate";
export type ActionColumn<TModel> = {
    type: "actions";
    actions: (model: TModel) => MoreActionType[];
    className?: string;
    hiddenByDefault?: boolean;
};
export type SimpleColumn<TModel> = {
    name: keyof TModel;
    title: string;
    truncate?: number;
    type?: "code";
    pin?: true;
    translate?: string;
    className?: string;
    hiddenByDefault?: boolean;
};
export type DateColumn<TModel> = {
    name: keyof TModel;
    type: "date";
    format?: string;
    title: string;
    pin?: true;
    className?: string;
    hiddenByDefault?: boolean;
};
export type FunctionColumn<TModel> = {
    name: string;
    body: (data: TModel) => string | number | React.ReactNode;
    title: string;
    pin?: true;
    className?: string;
    hiddenByDefault?: boolean;
};
export type ColumnType<TModel> = SimpleColumn<TModel> | FunctionColumn<TModel> | ActionColumn<TModel> | DateColumn<TModel>;
export declare function isActionColumn<TModel>(column: ColumnType<TModel>): column is ActionColumn<TModel>;
export declare function isFunctionColumn<TModel>(column: ColumnType<TModel>): column is FunctionColumn<TModel>;
export declare const PaginatedTable: <TModel extends {
    data: {
        id: number;
    }[];
    meta: ResponseMeta;
}>({ pagination, title, sortEnum, extraHeading, columns, caption, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, displayFilters, displayConfig, renderGridItem, rowClickHref, defaultDisplayAs, }: {
    caption?: React.ReactNode;
    defaultDisplayAs?: "list" | "grid";
    renderGridItem?: (model: TModel["data"][number]) => React.ReactNode;
    bulkActions?: {
        children: React.ReactNode;
        onSelect: (models: number[]) => Promise<boolean | void>;
    }[];
    sortEnum: any;
    extraHeading?: React.ReactNode;
    isSearchable?: boolean;
    title: React.ReactNode;
    addNew?: string;
    rowClickHref?: (model: TModel["data"][number]) => string;
    displayFilters?: {
        name: string;
        filters: string[];
    }[];
    searchableShortcuts?: {
        link: Record<string, string>;
        text: string;
    }[][];
    columns: Array<ColumnType<TModel["data"][number]>>;
    pagination: TModel;
    addNewText?: string;
    displayConfig?: {
        name: string;
        store?: StorageInterface<TModel["data"][number]>;
        stored?: {
            name?: string;
            value: Record<string, {
                name: string;
                enabled: boolean;
            }[]>;
        };
    };
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