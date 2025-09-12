import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';
import React__default from 'react';
import { ResponseMeta } from '@/utils';
import { ColumnType } from '@/pagination/columnTypes';

declare const LoadingComponent: ({ style, className, loadingClassName, size, }: {
    className?: string;
    loadingClassName?: string;
    size?: "loading-lg" | "loading-md" | "loading-sm" | "loading-xs";
    style?: React__default.CSSProperties;
}) => react_jsx_runtime.JSX.Element;

declare const Popover: ({ title, children, popoverClassName, onShow, open: openProp, hoverClassName, showOnHover, showOnClick, showOnFocus, popoverWidth, backgroundColor, borderColor, disabled, }: {
    disabled?: boolean;
    open?: boolean;
    showOnHover?: boolean;
    showOnClick?: boolean;
    showOnFocus?: boolean;
    popoverClassName?: string;
    hoverClassName?: string;
    popoverWidth?: string;
    title: (ref: ((node: HTMLElement | null) => void) | null, props: Record<string, unknown>) => React.ReactNode;
    children: (close: () => void) => React.ReactNode;
    onShow?: (show: boolean) => void;
    borderColor?: `border-${string}`;
    backgroundColor?: `bg-${string}`;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;

declare const EditButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => react_jsx_runtime.JSX.Element;
declare const ViewButton: ({ href, size }: {
    href: string;
    size?: "xs" | "sm" | "lg" | "xl";
}) => react_jsx_runtime.JSX.Element;
type MoreActionType = {
    label: string;
    icon: React__default.ComponentType<{
        className?: string;
    }>;
    onClick?: () => Promise<string>;
    href?: string;
    hidden?: boolean;
};
declare const MoreActions: ({ actions }: {
    actions: MoreActionType[];
}) => react_jsx_runtime.JSX.Element | null;
declare const ArchiveButton: (props: {
    size?: "xs" | "sm" | "lg" | "xl";
    onClick?: (e: MouseEvent) => void;
    href?: string;
    tooltipId?: string;
}) => react_jsx_runtime.JSX.Element;
declare const ActionButton: ({ tooltipId, icon, tooltip, className, size, ...props }: {
    size?: "xs" | "sm" | "lg" | "xl";
    href?: string;
    onClick?: (e: MouseEvent) => void;
    className?: string;
    tooltipId?: string;
    icon: React__default.ElementType;
    tooltip: React__default.ReactNode;
    prefetch?: boolean;
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

declare const PaginatedTable: <TModel extends {
    id: number;
}>({ pagination, title, sortEnum, extraHeading, columns, caption, pathname, isSearchable, searchableShortcuts, addNew, bulkActions, addNewText, displayFilters, configName, }: {
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
}) => react_jsx_runtime.JSX.Element;
declare const TableLink: ({ href, children, className, isLink, ...rest }: {
    className?: string;
    href: string;
    children: React__default.ReactNode;
    isLink?: boolean;
}) => string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React__default.ReactNode> | Promise<string | number | bigint | boolean | React__default.ReactPortal | React__default.ReactElement<unknown, string | React__default.JSXElementConstructor<any>> | Iterable<React__default.ReactNode> | null | undefined> | null | undefined;
declare const FilterLink: ({ children, className, params, }: {
    className: string;
    children: React__default.ReactNode;
    params: Record<string, string>;
}) => react_jsx_runtime.JSX.Element;

declare const HeaderResponsivePaginated: ({ elements, bulkActions, }: {
    elements: {
        link: Record<string, string>;
        text: string;
    }[][];
    bulkActions?: {
        actions: {
            children: React__default.ReactNode;
            onSelect: (models: number[]) => Promise<boolean | void>;
        }[];
        selected: number[];
        setSelected: (selected: number[]) => void;
    };
}) => react_jsx_runtime.JSX.Element;

export { ActionButton, ArchiveButton, BulkActions, BulkDropDownActions, EditButton, FilterLink, HeaderResponsive, HeaderResponsivePaginated, LoadingComponent, MoreActions, PaginatedTable, Pagination, Popover, TableLink, ViewButton };
