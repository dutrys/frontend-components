import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default from 'react';
import { ResponseMeta } from '@/utils';

declare const LoadingComponent: ({ style, className, loadingClassName, size, }: {
    className?: string;
    loadingClassName?: string;
    size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
    style?: React__default.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, showOnHover, showOnClick, showOnFocus, popoverWidth, backgroundColor, borderColor, disabled, }: {
    disabled?: boolean;
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    popoverWidth?: string;
    title: (ref: ((node: HTMLElement | null) => void) | null, props: Record<string, unknown>) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    borderColor?: `border-${string}`;
    backgroundColor?: `bg-${string}`;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;

declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs";
}) => react_jsx_runtime.JSX.Element;
declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs";
}) => react_jsx_runtime.JSX.Element;
declare const ArchiveButton: (props: {
    size?: "xs";
    onClick?: (e: MouseEvent) => void;
    href?: string;
    tooltipId?: string;
}) => react_jsx_runtime.JSX.Element;
declare const ActionButton: ({ tooltipId, icon, tooltip, className, size, ...props }: {
    size?: "xs";
    href?: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    tooltipId?: string;
    icon: React__default.ElementType;
    tooltip: React__default.ReactNode;
}) => react_jsx_runtime.JSX.Element;

declare const BulkActions: ({ bulkActions, disabled, }: {
    disabled?: boolean;
    bulkActions: {
        children: React__default.ReactNode;
        onSelect: () => Promise<boolean | void>;
    }[];
}) => react_jsx_runtime.JSX.Element;
declare const BulkDropDownActions: ({ bulkActions, disabled, }: {
    disabled?: boolean;
    bulkActions: {
        children: React__default.ReactNode;
        onSelect: () => Promise<boolean | void>;
    }[];
}) => react_jsx_runtime.JSX.Element;

declare const HeaderResponsive: <T extends object>({ renderVisible, renderDropdown, heightClassName, elements, }: {
    heightClassName: string;
    renderVisible: (r: T, i: number) => React__default.ReactNode;
    renderDropdown: (r: T, i: number, closeFn: () => void) => React__default.ReactNode;
    elements: T[];
}) => react_jsx_runtime.JSX.Element;

declare const Pagination: ({ page, visiblePages, onClick, }: {
    onClick?: (page: number) => void;
    page: ResponseMeta;
    visiblePages: number;
}) => react_jsx_runtime.JSX.Element;

type ActionColumn<TModel> = {
    type: "actions";
    archive?: string | boolean | false | ((model: TModel) => string | boolean);
    edit?: string | boolean | false | ((model: TModel) => string | boolean);
    view?: string | boolean | false | ((model: TModel) => string | boolean);
    idField: keyof TModel;
    extraButtons?: [(model: TModel) => React__default.ReactNode];
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
    body: (data: TModel) => string | number | React__default.ReactNode;
    title: string;
    pin?: true;
    className?: string;
};
type ColumnType<TModel> = SimpleColumn<TModel> | FunctionColumn<TModel> | ActionColumn<TModel> | DateColumn<TModel>;
declare const PaginatedTable: <TModel extends {
    id: number;
}>({ pagination, title, sortEnum, extraHeading, columns, caption, pathname, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, }: {
    caption?: React__default.ReactNode;
    bulkActions?: {
        children: React__default.ReactNode;
        onSelect: (models: number[]) => Promise<boolean | void>;
    }[];
    sortEnum: any;
    extraHeading?: React__default.ReactNode;
    isSearchable?: boolean;
    title: React__default.ReactNode;
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
}) => react_jsx_runtime.JSX.Element;
declare const TableLink: ({ href, children, className, isLink, ...rest }: {
    className?: string;
    href: string;
    children: React__default.ReactNode;
    isLink?: boolean;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;

export { ActionButton, ArchiveButton, BulkActions, BulkDropDownActions, type ColumnType, EditButton, HeaderResponsive, LoadingComponent, PaginatedTable, Pagination, Popover, TableLink, ViewButton };
