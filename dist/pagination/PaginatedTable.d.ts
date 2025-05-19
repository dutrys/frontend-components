import React from "react";
import { ResponseMeta } from "@/utils";
type ActionColumn<TModel> = {
    type: "actions";
    archive?: string | boolean | false | ((model: TModel) => string | boolean);
    edit?: string | boolean | false | ((model: TModel) => string | boolean);
    view?: string | boolean | false | ((model: TModel) => string | boolean);
    idField: keyof TModel;
    extraButtons?: [(model: TModel) => React.ReactNode];
    className?: string;
};
type SimpleColumn<TModel> = {
    name: keyof TModel;
    title: string;
    truncate?: number;
    type?: "code";
    pin?: true;
    className?: string;
};
type DateColumn<TModel> = {
    name: keyof TModel;
    type: "date";
    format?: string;
    title: string;
    pin?: true;
    className?: string;
};
type FunctionColumn<TModel> = {
    name?: string;
    body: (data: TModel) => string | number | React.ReactNode;
    title: string;
    pin?: true;
    className?: string;
};
export type ColumnType<TModel> = SimpleColumn<TModel> | FunctionColumn<TModel> | ActionColumn<TModel> | DateColumn<TModel>;
export declare const PaginatedTable: <TModel extends {
    id: number;
}>({ pagination, title, sortEnum, extraHeading, columns, caption, pathname, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, }: {
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
    searchableShortcuts?: {
        link: Record<string, string>;
        text: string;
    }[][];
    columns: Array<ColumnType<TModel>>;
    pagination: {
        data: TModel[];
        meta: ResponseMeta;
    };
    addNewText?: string;
}) => import("react/jsx-runtime").JSX.Element;
export declare const TableLink: ({ href, children, className, isLink, ...rest }: {
    className?: string;
    href: string;
    children: React.ReactNode;
    isLink?: boolean;
}) => string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
export {};
//# sourceMappingURL=PaginatedTable.d.ts.map