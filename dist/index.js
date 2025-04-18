'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from 'react';
import { useFloating, offset, flip, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow } from '@floating-ui/react';
import cx from 'classnames';
import LinkNext from 'next/link';
import { useParams, useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon, PencilIcon, EyeIcon, TrashIcon, ChevronDownIcon, EllipsisHorizontalIcon, PlusIcon, ChevronUpIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { format, parseJSON, isValid, differenceInSeconds, formatDistance, differenceInMinutes, differenceInDays } from 'date-fns';
import { lt } from 'date-fns/locale';
import toast from 'react-hot-toast';
import 'react-tooltip';
import 'date-fns-tz';
import '@sentry/nextjs';
import 'react-hook-form';
import 'react-day-picker';
import 'react-day-picker/locale';
import '@tanstack/react-query';
import '@headlessui/react';
import '@heroicons/react/20/solid';
import 'react-intersection-observer';
import 'react-number-format';

const LoadingComponent = ({ style, className, loadingClassName, size, }) => (jsx("div", { className: `flex justify-center ${className}`, style: style, children: jsx("span", { className: `${loadingClassName || "text-primary"} loading loading-spinner ${size}` }) }));

const Popover = ({ title, children, popoverClassName = "py-1", onShow, open: openProp, showOnHover = true, showOnClick = false, showOnFocus = false, popoverWidth, backgroundColor = "bg-slate-800", borderColor = "border-slate-600", disabled, }) => {
    const [isOpen, setIsOpen] = useState(openProp || false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        open: isOpen,
        onOpenChange: (open) => {
            onShow?.(open);
            setIsOpen(open);
        },
        whileElementsMounted: autoUpdate,
        middleware: [offset(10), flip({ padding: 10 }), arrow({ element: arrowRef })],
    });
    useEffect(() => {
        if (typeof openProp !== "undefined") {
            setIsOpen(openProp);
        }
    }, [openProp, setIsOpen]);
    const focus = useFocus(context, { enabled: showOnFocus });
    const hover = useHover(context, { enabled: showOnHover, handleClose: safePolygon() });
    const click = useClick(context, { enabled: showOnClick, keyboardHandlers: false });
    const dismiss = useDismiss(context, { escapeKey: false, bubbles: true });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);
    if (disabled) {
        return title(null, {});
    }
    return (jsxs(Fragment, { children: [title(refs.setReference, getReferenceProps()), isOpen && (jsx(FloatingPortal, { children: jsxs("div", { ref: refs.setFloating, style: { ...floatingStyles, zIndex: 1100 }, ...getFloatingProps(), className: cx("border rounded-sm shadow-lg shadow-base-100 border-1", popoverClassName, backgroundColor, borderColor), children: [jsx(FloatingArrow, { strokeWidth: 1, fill: `var(--color-${backgroundColor.replace("bg-", "")})`, stroke: `var(--color-${borderColor.replace("border-", "")})`, context: context, ref: arrowRef }), jsx("div", { className: popoverWidth, children: children(() => setIsOpen(false)) })] }) }))] }));
};

const Link = (props) => {
    const params = useParams();
    let href = props.href;
    if (typeof href === "string" && !/^\/(lt|en)\//.test(href) && href.startsWith("/")) {
        href = `/${params.locale || "lt"}${props.href}`;
    }
    return jsx(LinkNext, { ...props, href: href });
};

({
    loading: {
        icon: jsx("span", { className: "loading loading-infinity loading-xs" }),
    },
    error: {
        icon: jsx(ExclamationCircleIcon, { width: 15 }),
    },
    success: {
        icon: jsx(CheckCircleIcon, { width: 15 }),
    },
    warn: {
        icon: jsx(ExclamationTriangleIcon, { width: 15 }),
    },
});
const TOOLTIP_GLOBAL_ID = "global";

const dateToStringDate = (date) => {
    return format(date, "yyyy-MM-dd");
};

/**
 * Displays date with tooltip
 * if includeSeconds is passed, then it will update every:
 *  - second where difference is less than 60 seconds
 *  - 30 seconds where difference is less than an hour
 */
const HumanDate = ({ date, from = new Date(), includeSeconds = false, tooltipId = TOOLTIP_GLOBAL_ID, disableTooltip, }) => {
    const params = useParams();
    const t = useTranslations();
    const dateDate = typeof date === "string" ? parseJSON(date) : date;
    const [show, setShow] = useState(false);
    const formatDateTime = useCallback(() => {
        if (!dateDate || !isValid(dateDate)) {
            return "";
        }
        const diffInSeconds = differenceInSeconds(from ? from : new Date(), dateDate);
        if (includeSeconds && diffInSeconds < 60) {
            return t("dateTime.lessThanSeconds", { seconds: diffInSeconds });
        }
        return formatDistance(dateDate, from ? from : new Date(), {
            addSuffix: true,
            locale: params.locale === "lt" ? lt : undefined,
        });
    }, [includeSeconds, t, params, from, dateDate]);
    const [dateString, setDateString] = useState(formatDateTime());
    useEffect(() => {
        if (!dateDate || !isValid(dateDate)) {
            return;
        }
        let interval = undefined;
        const diffMinutes = Math.abs(differenceInMinutes(dateDate, from ? from : new Date()));
        if (includeSeconds && diffMinutes < 60) {
            interval = setInterval(() => {
                const newDateString = formatDateTime();
                if (dateString !== newDateString) {
                    setDateString(formatDateTime());
                }
            }, diffMinutes < 1 ? 1000 : 30000);
        }
        setShow(true);
        return () => {
            if (typeof interval === "number") {
                clearInterval(interval);
            }
        };
    }, [includeSeconds, dateString, dateDate, setDateString, from, formatDateTime]);
    if (!dateDate || !isValid(dateDate) || !show) {
        return null;
    }
    const displayDate = dateDate && differenceInDays(new Date(), dateDate) > 7;
    return (jsx(Fragment, { children: jsx("span", { "data-testid": "datewithtooltip", className: `date-with-tooltip-${dateDate.getTime()}`, "data-tooltip-id": disableTooltip ? undefined : tooltipId, "data-tooltip-content": disableTooltip ? undefined : format(dateDate, displayDate ? "HH:mm:ss" : "yyyy-MM-dd HH:mm:ss"), children: displayDate ? dateToStringDate(dateDate) : dateString }) }));
};

const setPartialParams = (partialParams, searchParams) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.keys(partialParams).forEach((key) => {
        const value = partialParams[key].toString();
        if (value === "" || !value) {
            params.delete(key);
        }
        else {
            params.set(key, value);
        }
    });
    return `?${params}`;
};
const isParamActive = (link, searchParams) => {
    for (const key in link) {
        if (link[key] === "" && !searchParams.has(key)) {
            continue;
        }
        if (link[key] !== searchParams.get(key)) {
            return false;
        }
    }
    return true;
};

const DateTime = ({ date, format: format$1 = "yyyy-MM-dd HH:mm:ss" }) => {
    const [formattedDate, setFormattedDate] = useState(null);
    useEffect(() => {
        const fromDate = parseJSON(date);
        if (isValid(fromDate)) {
            setFormattedDate(format(fromDate, format$1));
        }
    }, [date, format$1]);
    return formattedDate;
};

const ActionButtons = ({ id, archive, edit, view, pathname, }) => {
    const searchParams = useSearchParams();
    return (jsxs(Fragment, { children: [view && jsx(ViewButton, { href: `${pathname}/view/${id}?${searchParams.toString()}` }), edit && jsx(EditButton, { href: `${pathname}/edit/${id}?${searchParams.toString()}` }), archive && jsx(ArchiveButton, { href: `${pathname}/archive/${id}?${searchParams.toString()}` })] }));
};
const EditButton = ({ href, size }) => {
    const t = useTranslations("actionButtons");
    return jsx(ActionButton, { href: href, icon: PencilIcon, tooltip: t("edit"), "data-testid": "button-edit", size: size });
};
const ViewButton = ({ href, size }) => {
    const t = useTranslations("actionButtons");
    return jsx(ActionButton, { href: href, icon: EyeIcon, tooltip: t("view"), "data-testid": "button-view", size: size });
};
const ArchiveButton = (props) => {
    const t = useTranslations("actionButtons");
    return (jsx(ActionButton, { ...props, icon: TrashIcon, "data-testid": "button-archive", tooltip: t("archive"), size: props.size }));
};
const ActionButton = ({ tooltipId = TOOLTIP_GLOBAL_ID, icon, tooltip, className, size, ...props }) => {
    const Icon = icon;
    const L = props.href ? Link : "button";
    return (
    // @ts-expect-error TS2322
    jsx(L, { ...props, "data-tooltip-id": tooltipId, "data-tooltip-place": "top", "data-tooltip-content": tooltip, className: cx("btn uppercase btn-ghost", className, {
            "btn-xs": size === "xs",
            "btn-xs md:btn-sm": !size,
        }), children: jsx(Icon, { className: "inline", width: 16 }) }));
};

const HotkeysContext = createContext({
    addHotKey: () => { },
    removeHotKey: () => { },
    getHotKeys: () => ({}),
});

const Hotkeys = ({ hotKeys, id }) => {
    const mapping = useContext(HotkeysContext);
    useEffect(() => {
        const handleKeyPress = (e) => {
            for (let i = 0; i < hotKeys.length; i++) {
                const metaKey = hotKeys[i].metaKey ?? false;
                const ctrlKey = hotKeys[i].ctrlKey ?? false;
                const altKey = hotKeys[i].altKey ?? false;
                if (hotKeys[i].key === e.key && metaKey === e.metaKey && ctrlKey === e.ctrlKey && altKey === e.altKey) {
                    toast.custom(jsxs("div", { className: "bg-black/50 text-white rounded-md py-2 px-4 text-sm", children: [metaKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "\u2318" }), " +"] })), ctrlKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "ctrl" }), " +"] })), altKey && (jsxs(Fragment, { children: [jsx("kbd", { className: "kbd text-gray-700 kbd-sm", children: "alt" }), " +"] })), jsx("kbd", { className: "kbd text-gray-700 kbd-sm mr-2", children: hotKeys[i].key }, "key"), hotKeys[i].description] }), {
                        duration: 50,
                        position: "bottom-center",
                    });
                    hotKeys[i].callback();
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
            }
        };
        mapping.addHotKey(id, hotKeys);
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            mapping.removeHotKey(id);
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [mapping, hotKeys, id]);
    return null;
};

var styles$1 = {"menu":"BulkActions-module_menu__m9kWg"};

const BulkActions = ({ bulkActions, disabled, }) => {
    const t = useTranslations();
    if (disabled) {
        return (jsxs("button", { disabled: true, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] }));
    }
    return (jsx(Popover, { disabled: disabled, showOnClick: true, backgroundColor: "bg-primary", borderColor: "border-primary", title: (ref, props) => (jsxs("button", { disabled: disabled, ref: ref, ...props, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] })), children: (close) => {
            return (jsx("ul", { className: `menu px-1 py-0 ${styles$1.menu}`, children: jsx(BulkDropDownActions, { bulkActions: bulkActions.map((b) => ({
                        ...b,
                        onSelect: async () => {
                            close();
                            return b.onSelect();
                        },
                    })) }) }));
        } }));
};
const BulkDropDownActions = ({ bulkActions, disabled, }) => {
    return (jsx(Fragment, { children: bulkActions.map((bulkAction, i) => {
            return (jsx("li", { children: jsx("button", { type: "button", disabled: disabled, onClick: () => bulkAction.onSelect(), children: bulkAction.children }) }, i));
        }) }));
};

const MORE_WIDTH = 40;
const HeaderResponsive = ({ renderVisible, renderDropdown, heightClassName, elements, }) => {
    const [showItems, setShowItems] = useState(elements.length);
    const [elWidth, setElWidth] = useState();
    const bar = useRef(null);
    useEffect(() => {
        if (bar.current && !elWidth) {
            const navItems = Array.from(bar.current.getElementsByClassName("item"));
            setElWidth(navItems.map((nav) => nav.offsetWidth));
        }
    }, [bar, elWidth]);
    useEffect(() => {
        const checkNavbarWidth = () => {
            if (!elWidth || !bar.current) {
                return;
            }
            const currentWidth = bar.current.offsetWidth;
            let navItemsWidth = 0;
            for (let i = 0; i < elWidth.length; i++) {
                navItemsWidth += elWidth[i];
                if (navItemsWidth > currentWidth) {
                    setShowItems(i);
                    return;
                }
            }
            setShowItems(elWidth.length);
        };
        checkNavbarWidth();
        window.addEventListener("resize", checkNavbarWidth);
        return () => {
            window.removeEventListener("resize", checkNavbarWidth);
        };
    }, [showItems, bar, elWidth]);
    return (jsxs(Fragment, { children: [jsx("div", { className: "overflow-hidden grow", style: { overflow: "hidden" }, children: jsx("div", { ref: bar, className: "flex overflow-hidden", children: jsx("div", { className: `${heightClassName || ""} w-full`, children: jsx("ul", { className: `flex flex-nowrap shrink justify-end flex-row ${heightClassName || ""} items-center`, children: elements.map((elementCollection, i) => (jsx("li", { className: `item pr-2 shrink-0 flex-nowrap flex flex-row ${i >= showItems ? "hidden" : ""}`, children: renderVisible(elementCollection, i) }, i))) }) }) }) }), showItems < elements.length && (jsx("div", { style: { width: MORE_WIDTH }, className: "pr-2", children: jsx(Popover, { borderColor: "border-base-300", backgroundColor: "bg-base-200", title: (ref, props) => (jsx("a", { tabIndex: 0, ref: ref, ...props, role: "button", className: "btn btn-xs w-full", children: jsx(EllipsisHorizontalIcon, { className: "h-3 w-3" }) })), children: () => (jsx("div", { className: "max-h-96 overflow-y-auto", children: jsx("ul", { tabIndex: 0, className: "menu px-1 py-0", children: [...elements].splice(showItems).map(renderDropdown) }) })) }) }))] }));
};

const Pagination = ({ page, visiblePages, onClick, }) => {
    const searchParams = useSearchParams();
    let minPage = Math.max(1, page.currentPage - Math.floor(visiblePages / 2));
    const maxPage = Math.min(page.totalPages, minPage + visiblePages - 1);
    const pageNumbers = [];
    if (maxPage - minPage + 1 < visiblePages) {
        minPage = Math.max(1, maxPage - visiblePages + 1);
    }
    for (let i = minPage; i <= maxPage; i++) {
        pageNumbers.push(onClick ? (jsx("button", { className: `btn uppercase join-item ${i === page.currentPage ? "btn-active" : ""}`, onClick: (e) => {
                e.preventDefault();
                onClick(i);
            }, children: i }, i)) : (jsx(Link, { prefetch: false, className: `btn uppercase join-item ${i === page.currentPage ? "btn-active" : ""}`, href: setPartialParams({ page: i }, searchParams), children: i }, i)));
    }
    return jsx("div", { className: "join mx-auto py-2", children: pageNumbers });
};

var styles = {"table":"PaginatedTable-module_table__efs0Y","selectedRow":"PaginatedTable-module_selectedRow__Xi-QH","thead":"PaginatedTable-module_thead__Jb-pD"};

const IndeterminateCheckbox = ({ checked, className = "checkbox checkbox-xs", indeterminate, onChange, }) => {
    const checkboxRef = useRef(null);
    useEffect(() => {
        if (!checkboxRef.current) {
            return;
        }
        if (indeterminate === true) {
            checkboxRef.current.indeterminate = true;
        }
        else {
            checkboxRef.current.indeterminate = false;
        }
    }, [indeterminate, checked]);
    return (jsx("input", { type: "checkbox", ref: checkboxRef, className: className, onChange: onChange, checked: checked || false }));
};

const limits = [10, 20, 50, 100];
function isActionColumn(column) {
    return typeof column === "object" && column.type === "actions";
}
function isFunctionColumn(column) {
    return typeof column === "object" && typeof column.body === "function";
}
const PaginatedTable = ({ pagination, title, sortEnum, extraHeading, columns, pathname, isSearchable = false, searchableShortcuts = [], addNew, bulkActions, }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const [selected, setSelected] = React.useState([]);
    const hotKeys = [];
    if (addNew) {
        hotKeys.push({
            key: "n",
            metaKey: true,
            ctrlKey: true,
            description: t("pagination.addNew"),
            callback: () => {
                router.push(addNew.replace(/^\/(en|lt)\//, "/"));
            },
        });
    }
    const SearchField = () => {
        const router = useRouter();
        const path = usePathname();
        const [search, setSearch] = useState(searchParams.get("search") || "");
        return (jsx("div", { className: "w-32 sm:w-52 shrink-0 grow-0", children: jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    router.push((path + setPartialParams({ search, page: 1 }, searchParams)).replace(/^\/(en|lt)\//, "/"));
                }, children: [" ", jsxs("div", { className: "join w-full pr-4", children: [jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), name: "search", className: "join-item input input-bordered input-xs outline-0 focus:ring-0 w-full focus:outline-0 focus:border-gray-500", placeholder: t("pagination.searchPlaceholder") }), jsx("button", { className: "join-item btn btn-neutral btn-xs uppercase", type: "submit", children: jsx(MagnifyingGlassIcon, { className: "w-4 h-4" }) })] })] }) }));
    };
    const elements = bulkActions && bulkActions?.length > 0
        ? [[{ link: { bulk: "bulk" }, text: "" }], ...searchableShortcuts]
        : searchableShortcuts;
    const heading = (jsx(Fragment, { children: jsxs("div", { className: "flex items-center flex-end w-full border-b border-b-base-content/5 h-12 max-w-[calc(100vw)] sm:max-w-[calc(100vw-6rem)]", children: [jsx("h1", { className: `pl-4 pb-3 pt-3 font-bold mr-2 ${searchableShortcuts.length > 0 ? "" : "grow"}`, children: title }), extraHeading, jsx(Hotkeys, { id: "paginatedTable", hotKeys: hotKeys }), (searchableShortcuts.length > 0 || (bulkActions && bulkActions?.length > 0)) && (jsx(HeaderResponsive, { heightClassName: "h-12", elements: elements, renderDropdown: (shortcuts, i) => {
                        return (jsxs(React.Fragment, { children: [i !== 0 && jsx("li", { className: "disabled" }), shortcuts.map(({ link, text }) => {
                                    if (bulkActions && bulkActions.length > 0 && link.bulk === "bulk") {
                                        return (jsxs(Fragment, { children: [jsx("li", { className: "menu-disabled", children: jsx("span", { children: t("pagination.bulkActions") }) }), jsx(BulkDropDownActions, { disabled: selected.length === 0, bulkActions: bulkActions.map((b) => ({
                                                        children: b.children,
                                                        onSelect: async () => {
                                                            const success = await b.onSelect(selected);
                                                            if (success) {
                                                                setSelected([]);
                                                            }
                                                        },
                                                    })) }), jsx("li", { className: "menu-disabled" }), jsx("li", { className: "menu-disabled", children: jsx("span", { children: t("pagination.filters") }) })] }));
                                    }
                                    const active = isParamActive(link, searchParams);
                                    link = { ...link };
                                    if (active) {
                                        Object.keys(link).forEach((key) => {
                                            link[key] = "";
                                        });
                                    }
                                    const params = setPartialParams({ ...link, page: "" }, searchParams);
                                    return (jsx("li", { children: jsx(Link, { prefetch: false, className: active ? "bg-gray-300 font-bold" : "", href: params === "" ? "?" : params, children: text }) }, text));
                                })] }, i));
                    }, renderVisible: (element, i) => {
                        if (i === 0 && bulkActions && bulkActions.length > 0) {
                            return (jsx(BulkActions, { disabled: selected.length === 0, bulkActions: bulkActions.map((b) => ({
                                    children: b.children,
                                    onSelect: async () => {
                                        const success = await b.onSelect(selected);
                                        if (success) {
                                            setSelected([]);
                                        }
                                    },
                                })) }));
                        }
                        return (jsx("div", { className: element.length > 1 ? "join" : undefined, children: element.map(({ text, link }) => {
                                const active = isParamActive(link, searchParams);
                                link = { ...link };
                                if (active) {
                                    Object.keys(link).forEach((key) => {
                                        link[key] = "";
                                    });
                                }
                                const params = setPartialParams({ ...link, page: "" }, searchParams);
                                return (jsx(Link, { prefetch: false, className: `btn join-item uppercase btn-xs ${active ? "btn-neutral" : ""}`, href: params === "" ? "?" : params, children: text }, text));
                            }) }, i));
                    } })), addNew && (jsxs(Link, { className: "btn uppercase btn-accent gap-2 justify-end  btn-xs mr-2", href: addNew, "data-testid": "add-new", children: [jsx(PlusIcon, { className: "w-4 h-4" }), " ", jsx("span", { className: "hidden sm:inline", children: t("pagination.addNew") })] })), isSearchable && jsx(SearchField, {})] }) }));
    if (pagination.meta.totalItems === 0) {
        return (jsxs(Fragment, { children: [heading, jsxs("div", { className: "text-center mt-20", children: [jsxs("span", { className: "text-gray-400", children: [t("pagination.noItems"), " ", jsx("span", { className: "align-middle text-3xl ", children: "\uD83D\uDE3F" })] }), addNew && (searchParams.get("search") || "") === "" && (jsx("p", { className: "mt-4", children: jsxs(Link, { className: "btn uppercase btn-outline", href: addNew, children: [jsx(PlusIcon, { width: 20 }), " ", t("pagination.tryCreatingOne")] }) }))] })] }));
    }
    return (jsxs("div", { "data-testid": "paginate-table", className: "relative h-full", "data-test-sort": (pagination.meta.sortBy || []).flat().join("-"), children: [heading, jsx("div", { className: "overflow-x-auto max-h-[calc(100%-7rem)] w-[calc(100vw)] sm:w-[calc(100vw-6rem)]", children: jsxs("table", { className: `${styles.table} table table-xs sm:table-sm md:table-md table-pin-rows table-pin-cols`, children: [jsx("thead", { children: jsxs("tr", { children: [bulkActions && (jsx("th", { children: jsx(IndeterminateCheckbox, { className: "checkbox checkbox-xs", onChange: (e) => {
                                                setSelected(e.target.checked ? pagination.data.map((model) => model.id) : []);
                                            }, indeterminate: selected.length > 0 && selected.length < pagination.data.length, checked: pagination.data.every((model) => selected.includes(model.id)) }) })), columns.map((column, i) => {
                                        if (isActionColumn(column)) {
                                            return (jsx("th", { className: `${styles.thead} w-12 max-w-24 text-xs`, children: "\u00A0" }, `actions-${i}`));
                                        }
                                        const [sortBy, sortOrder] = Array.isArray(pagination.meta.sortBy)
                                            ? pagination.meta.sortBy[0]
                                            : ["id", "DESC"];
                                        const Component = column.pin ? "th" : "td";
                                        if (column.name && Object.values(sortEnum).includes(`${column.name.toString()}:DESC`)) {
                                            const args = {
                                                className: "inline",
                                                width: 10,
                                            };
                                            return (jsx(Component, { className: `${styles.thead} text-xs`, children: jsxs(Link, { prefetch: false, "data-testid": `sort-table-${column.name.toString()}-${sortOrder === "DESC" ? "asc" : "desc"}`, ...(sortBy === column.name ? { className: "text-primary-500" } : {}), href: setPartialParams({ page: 1, sortBy: `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}` }, searchParams), children: [column.title, sortOrder === "DESC" ? jsx(ChevronDownIcon, { ...args }) : jsx(ChevronUpIcon, { ...args })] }) }, column.name.toString()));
                                        }
                                        return (jsx(Component, { className: `${styles.thead} text-xs`, children: column.title }, column.title.toString()));
                                    })] }) }), jsx("tbody", { children: pagination.data.map((model, o) => (jsxs("tr", { "data-testid": `table-row-${o}`, className: cx({
                                    [styles.selectedRow]: selected.includes(model.id),
                                }), children: [bulkActions && (jsx("th", { children: jsx("input", { type: "checkbox", className: "checkbox checkbox-xs", onChange: (e) => {
                                                if (e.target.checked) {
                                                    setSelected((prev) => [...prev, model.id]);
                                                }
                                                else {
                                                    setSelected((prev) => prev.filter((id) => id !== model.id));
                                                }
                                            }, checked: selected.includes(model.id) }) })), columns.map((column, i) => {
                                        if (isActionColumn(column)) {
                                            if (!column.idField) {
                                                throw new Error("Model must have an id");
                                            }
                                            const idFieldValue = model[column.idField];
                                            if (typeof idFieldValue !== "string" && typeof idFieldValue !== "number") {
                                                throw new Error("idField must be a string or a number");
                                            }
                                            let archive;
                                            if (typeof column.archive === "function") {
                                                archive = column.archive(model);
                                            }
                                            else {
                                                archive = typeof column.archive === "undefined" ? false : column.archive;
                                            }
                                            let edit;
                                            if (typeof column.edit === "function") {
                                                edit = column.edit(model);
                                            }
                                            else {
                                                edit = typeof column.edit === "undefined" ? false : column.edit;
                                            }
                                            let view;
                                            if (typeof column.view === "function") {
                                                view = column.view(model);
                                            }
                                            else {
                                                view = typeof column.view === "undefined" ? false : column.view;
                                            }
                                            return (jsxs("th", { className: "whitespace-nowrap", children: [column.extraButtons?.map((Button, i) => (jsx(React.Fragment, { children: Button(model) }, `${model[column.idField]}-${i}`))), jsx(ActionButtons, { archive: archive, pathname: pathname, view: view, edit: edit, id: idFieldValue })] }, `actions-td-${i}`));
                                        }
                                        const Component = column.pin ? "th" : "td";
                                        if (isFunctionColumn(column)) {
                                            return jsx(Component, { children: column.body(model) }, `actions-td-${i}`);
                                        }
                                        if (column.type === "date") {
                                            return (jsx(Component, { children: column.format ? (jsx(DateTime, { date: model[column.name], format: column.format })) : (jsx(HumanDate, { date: model[column.name] })) }, `${model.id}-${column.name.toString()}`));
                                        }
                                        if (column.type === "code") {
                                            return (jsx(Component, { children: model[column.name] && (jsx("div", { className: "badge badge-sm", children: jsx("code", { children: model[column.name] }) })) }, column.name.toString()));
                                        }
                                        return (jsx(Component, { children: column.truncate ? (jsx(TruncateText, { text: model[column.name], length: column.truncate })) : model[column.name] }, column.name.toString()));
                                    })] }, o))) })] }) }), jsx("div", { className: "absolute left-0 bottom-0 w-full h-16 z-1", children: jsx("div", { className: "bg-base-100", children: jsxs("div", { className: "flex justify-center items-center", children: [jsx("div", { className: `shrink-1 w-60 text-xs pl-4 ${pagination.meta.totalPages > 1 ? "hidden md:block" : ""}`, children: t("pagination.showing", {
                                    from: (pagination.meta.currentPage - 1) * pagination.meta.itemsPerPage + 1,
                                    to: Math.min(pagination.meta.currentPage * pagination.meta.itemsPerPage, pagination.meta.totalItems),
                                    total: pagination.meta.totalItems,
                                }) }), jsx("div", { className: "grow text-center h-16", children: pagination.meta.totalPages > 1 && jsx(Pagination, { visiblePages: 5, page: pagination.meta }) }), pagination.meta.totalPages > 1 && (jsxs("div", { className: "shrink-1 w-60 hidden md:block text-xs text-right pr-4", children: [jsx("span", { className: "text-gray-400", children: t("pagination.itemsPerPage") }), " ", limits.map((l) => (jsx(LimitLink, { isActive: pagination.meta.itemsPerPage === l, text: l.toString(), href: setPartialParams({ page: 1, limit: l }, searchParams) }, l)))] }))] }) }) })] }));
};
const LimitLink = ({ href, text, isActive }) => {
    return (jsx(Link, { prefetch: false, className: `text-gray-400 hover:text-primary-600 mr-1 ${isActive ? "font-bold text-primary-600" : ""}`, href: href, children: text }));
};
const TableLink = ({ href, children, className, isLink = true, ...rest }) => {
    if (!isLink) {
        return children;
    }
    return (jsxs(Link, { href: href, ...rest, prefetch: false, className: `${styles.link} ${className || ""} text-primary-700 hover:text-primary-500`, children: [children, " "] }));
};
const TruncateText = ({ text, length }) => {
    return (jsx("div", { "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": text, className: "text-left text-ellipsis overflow-hidden", style: { width: length }, children: text }));
};

export { ActionButton, ActionButtons, ArchiveButton, BulkActions, BulkDropDownActions, EditButton, HeaderResponsive, LoadingComponent, PaginatedTable, Pagination, Popover, TableLink, ViewButton };
//# sourceMappingURL=index.js.map
