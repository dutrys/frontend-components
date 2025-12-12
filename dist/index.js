'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useState, useRef, useEffect, useMemo, createContext, useContext, Fragment as Fragment$1, useCallback } from 'react';
import { useFloating, offset, flip, shift, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow, size } from '@floating-ui/react';
import cx from 'classnames';
import LinkNext from 'next/link';
import { useParams, useSearchParams, useRouter as useRouter$1, usePathname } from 'next/navigation';
import { EllipsisVerticalIcon, ArrowsUpDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next-nprogress-bar';
import toast, { useToasterStore, Toaster as Toaster$1, resolveValue } from 'react-hot-toast';
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon, ChevronDownIcon, EllipsisHorizontalIcon, CheckIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, XMarkIcon, ClockIcon, CalendarIcon, ChevronUpDownIcon, PlusIcon, RectangleStackIcon, QueueListIcon, ChevronUpIcon, FunnelIcon, MagnifyingGlassIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { FunnelIcon as FunnelIcon$1 } from '@heroicons/react/24/solid';
import { Reorder, useMotionValue, useDragControls, animate, motion } from 'framer-motion';
import { captureException } from '@sentry/nextjs';
import { useForm, Controller } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { format, isSameDay, isSameHour, parse, isValid, parseJSON, differenceInSeconds, formatDistance, differenceInMinutes, differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { lt, enGB } from 'react-day-picker/locale';
import { FocusTrap, FocusTrapFeatures, Portal, Combobox, ComboboxInput, ComboboxButton, Transition, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { useInView } from 'react-intersection-observer';
import 'date-fns-tz';
import { NumericFormat } from 'react-number-format';
import { CheckIcon as CheckIcon$1 } from '@heroicons/react/20/solid';
import { lt as lt$1 } from 'date-fns/locale';

const LoadingComponent = ({ style, className, loadingClassName, size, }) => (jsx("div", { className: `flex justify-center ${className}`, style: style, children: jsx("span", { className: `${loadingClassName || "text-primary"} loading loading-spinner ${size}` }) }));

const Popover = ({ title, children, popoverClassName, onShow, open: openProp, showOnHover = true, showOnClick = false, showOnFocus = false, backgroundColor = "bg-slate-800", borderColor, disabled, placement, arrowSize, }) => {
    const [isOpen, setIsOpen] = useState(openProp || false);
    const arrowRef = useRef(null);
    const { refs, floatingStyles, context } = useFloating({
        placement: placement ?? "bottom-start",
        open: isOpen,
        onOpenChange: (open) => {
            onShow?.(open);
            setIsOpen(open);
        },
        whileElementsMounted: autoUpdate,
        middleware: [offset(10), flip({ padding: 10 }), shift({ padding: 10 }), arrow({ element: arrowRef, padding: 10 })],
    });
    useEffect(() => {
        if (typeof openProp !== "undefined") {
            setIsOpen(openProp);
        }
    }, [openProp, setIsOpen]);
    const focus = useFocus(context, { enabled: showOnFocus });
    const hover = useHover(context, { enabled: showOnHover, handleClose: safePolygon() });
    const click = useClick(context, { enabled: showOnClick, keyboardHandlers: false });
    const dismiss = useDismiss(context, { escapeKey: false, bubbles: true, outsidePress: true });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);
    if (disabled) {
        return title(null, {}, false);
    }
    let opacity = 100;
    const opacityString = backgroundColor.match(/\/(\d+)$/);
    if (opacityString) {
        opacity = parseInt(opacityString[1], 10) ?? 100;
    }
    return (jsxs(Fragment, { children: [title(refs.setReference, getReferenceProps(), isOpen), isOpen && (jsx(FloatingPortal, { children: jsxs("div", { ref: refs.setFloating, style: { ...floatingStyles, zIndex: 1100 }, ...getFloatingProps(), className: cx("popover rounded-box shadow-lg shadow-base-100", popoverClassName, backgroundColor, borderColor, { border: borderColor }), children: [jsx(FloatingArrow, { fill: `var(--color-${backgroundColor.replace("bg-", "").replace(/\/\d+$/, "")})`, strokeWidth: borderColor ? 1 : 0, opacity: opacity / 100, stroke: borderColor ? `var(--color-${borderColor.replace("border-", "")})` : undefined, context: context, ref: arrowRef, width: arrowSize?.width, height: arrowSize?.height }), children(() => context.onOpenChange(false))] }) }))] }));
};

const Link = (props) => {
    const params = useParams();
    return jsx(LinkNext, { prefetch: false, ...props, href: addLocale(props.href, params.locale) });
};
const isUrl = (link) => typeof link === "object" && "href" in link && !!link.href;
const addLocale = (link, locale) => {
    const href = isUrl(link) ? link.href : link;
    if (typeof href === "string" && !/^\/api\//.test(href) && !/^\/(lt|en)\//.test(href) && href.startsWith("/")) {
        return `/${locale || "lt"}${href}`;
    }
    return link;
};

class ScreenSize {
    static none = 0;
    static xs = 1;
    static sm = 2;
    static md = 3;
    static lg = 4;
    static xl = 5;
}
const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState(ScreenSize.none);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setScreenSize(ScreenSize.xs);
            }
            else if (window.innerWidth >= 640 && window.innerWidth < 768) {
                setScreenSize(ScreenSize.sm);
            }
            else if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                setScreenSize(ScreenSize.md);
            }
            else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
                setScreenSize(ScreenSize.lg);
            }
            else {
                setScreenSize(ScreenSize.xl);
            }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return screenSize;
};

const options = {
    loading: {
        classNames: "bg-blue-100 dark:text-blue-200 text-blue-500 dark:bg-blue-800",
        icon: jsx("span", { className: "loading loading-infinity loading-xs" }),
    },
    error: {
        classNames: "bg-red-100 dark:text-red-200 text-red-500 dark:bg-red-800",
        icon: jsx(ExclamationCircleIcon, { width: 15 }),
    },
    success: {
        classNames: "bg-green-100 dark:text-green-200 text-green-500 dark:bg-green-800",
        icon: jsx(CheckCircleIcon, { width: 15 }),
    },
    warn: {
        classNames: "bg-orange-100 dark:text-orange-200 text-orange-500 dark:bg-orange-800",
        icon: jsx(ExclamationTriangleIcon, { width: 15 }),
    },
};
const TOOLTIP_GLOBAL_ID = "global";
function Toaster() {
    const { toasts } = useToasterStore();
    // Enforce Limit (1 toast)
    React.useEffect(() => {
        toasts
            .filter((t) => t.visible)
            .filter((_, i) => i >= 1)
            .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);
    return (jsxs(Fragment, { children: [jsx(Tooltip, { id: TOOLTIP_GLOBAL_ID, place: "top" }), jsx(Toaster$1, { position: "top-center", children: (t) => {
                    const type = options[t.type] || options.success;
                    return (jsxs("div", { "data-testid": "toast", onClick: () => toast.remove(t.id), className: "cursor-pointer flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800", role: "alert", children: [t.icon ? (t.icon) : (jsxs("div", { className: `inline-flex items-center justify-center shrink-0 w-8 h-8 rounded-lg ${type.classNames} ${t.className}`, children: [type.icon, jsx("span", { className: "sr-only", children: t.type })] })), jsx("div", { className: "ml-3 text-sm font-normal sentry-unmask", children: resolveValue(t.message, t) })] }));
                } })] }));
}

const MoreActions = ({ className, actions }) => {
    const screenSize = useScreenSize();
    if (actions.filter((a) => !a.hidden).length === 0) {
        return null;
    }
    const enable = screenSize === ScreenSize.none || screenSize > ScreenSize.xs;
    const { menuActions, buttonActions } = useMemo(() => {
        let menuActions = actions.filter((a) => enable ? !a.hidden && !a.enableWhenSpaceIsAvailable : !a.hidden);
        const buttonActions = [];
        if (enable) {
            buttonActions.push(...actions.filter((a) => !a.hidden && a.enableWhenSpaceIsAvailable));
        }
        if (menuActions.length === 1) {
            buttonActions.push(menuActions[0]);
            menuActions = [];
        }
        return { buttonActions, menuActions };
    }, [actions, enable]);
    return (jsxs(Fragment, { children: [buttonActions.map((a) => (jsx(Action, { enable: true, action: a, close: () => { } }, a.label))), menuActions.length > 0 && (jsx(Popover, { showOnClick: true, title: (ref, props) => (jsx("button", { className: cx("btn btn-xs md:btn-xs btn-ghost", className), ref: ref, ...props, children: jsx(EllipsisVerticalIcon, { className: "size-4" }) })), children: (close) => (jsx("div", { "data-theme": "dim", style: { background: "transparent" }, children: jsx("ul", { className: "menu menu-sm p-1 p-0", children: menuActions.map((a, i) => (jsx("li", { className: a.disabled ? "menu-disabled" : undefined, children: jsx(Action, { action: a, close: close }) }, i))) }) })) }))] }));
};
const Action = ({ action: a, close, enable }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const Icon = isLoading ? LoadingComponent : a.icon;
    const searchParams = useSearchParams();
    if (!a.onClick) {
        if (!a.href) {
            throw new Error("href or onClick is required");
        }
        let href = addLocale(a.href);
        if (!href.includes("?")) {
            href += `?${searchParams.toString()}`;
        }
        if (enable) {
            return (jsx(Link, { "data-testid": a.testId, "data-disable-nprogress": a.disableNProgress, className: `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}`, href: href, onClick: () => !a.disabled && close(), "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": a.label, prefetch: false, children: Icon ? jsx(Icon, { className: "size-4" }) : a.label }));
        }
        return (jsxs(Link, { "data-testid": a.testId, "data-disable-nprogress": a.disableNProgress, className: "", href: href, onClick: () => close(), prefetch: false, children: [Icon && jsx(Icon, { className: "size-4" }), a.label] }));
    }
    return (jsxs("a", { "data-testid": a.testId, className: enable ? `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}` : undefined, onClick: (e) => {
            e.preventDefault();
            if (a.disabled) {
                return;
            }
            setIsLoading(true);
            a.onClick()
                .then((result) => {
                if (typeof result === "string") {
                    let href = addLocale(result);
                    if (!href.includes("?")) {
                        href += `?${searchParams.toString()}`;
                    }
                    router.push(href);
                }
                close();
            })
                .finally(() => setIsLoading(false));
        }, children: [Icon && jsx(Icon, { className: "size-4" }), !enable && a.label] }));
};

var styles$4 = {"menu":"BulkActions-module_menu__m9kWg"};

const BulkActions = ({ bulkActions, disabled, }) => {
    const t = useTranslations();
    if (disabled) {
        return (jsxs("button", { disabled: true, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] }));
    }
    return (jsx(Popover, { disabled: disabled, showOnClick: true, backgroundColor: "bg-primary", borderColor: "border-primary", title: (ref, props) => (jsxs("button", { disabled: disabled, ref: ref, ...props, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] })), children: (close) => {
            return (jsx("ul", { className: `menu px-1 py-0 ${styles$4.menu}`, children: jsx(BulkDropDownActions, { bulkActions: bulkActions.map((b) => ({
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
    const cont = useRef(null);
    useEffect(() => {
        if (bar.current && !elWidth) {
            const navItems = Array.from(bar.current.getElementsByClassName("item"));
            setElWidth(navItems.map((nav) => nav.offsetWidth));
        }
    }, [bar, elWidth]);
    useEffect(() => {
        if (!cont.current || !elWidth) {
            return;
        }
        cont.current.style.maxWidth = `${elWidth.reduce((curr, acc) => acc + curr, 0)}px`;
        window.dispatchEvent(new Event("resize"));
    }, [cont, elWidth]);
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
    return (jsxs(Fragment, { children: [jsx("div", { className: "overflow-hidden grow", style: { overflow: "hidden" }, ref: cont, children: jsx("div", { ref: bar, className: "flex overflow-hidden", children: jsx("div", { className: `${heightClassName || ""} w-full`, children: jsx("ul", { className: `flex flex-nowrap shrink justify-end flex-row ${heightClassName || ""} items-center`, children: elements.map((elementCollection, i) => (jsx("li", { className: `item pr-2 shrink-0 flex-nowrap flex flex-row ${i >= showItems ? "hidden" : ""}`, children: renderVisible(elementCollection, i) }, i))) }) }) }) }), showItems < elements.length && (jsx("div", { style: { width: MORE_WIDTH }, className: "pr-2", children: jsx(Popover, { showOnClick: true, showOnHover: false, borderColor: "border-base-300", backgroundColor: "bg-base-200", title: (ref, props) => (jsx("a", { tabIndex: 0, ref: ref, ...props, role: "button", className: "btn btn-xs w-full", children: jsx(EllipsisHorizontalIcon, { className: "h-3 w-3" }) })), children: (closeFn) => (jsx("div", { className: "max-h-96 overflow-y-auto py-2", children: jsx("ul", { tabIndex: 0, className: "menu menu-sm px-1 py-0", children: [...elements].splice(showItems).map((e, i) => renderDropdown(e, i, closeFn)) }) })) }) }))] }));
};

const getPreviousPageParam = (page) => !page?.meta || page?.meta?.currentPage === 1 ? undefined : page.meta.currentPage - 1;
const getNextPageParam = (page) => !page?.meta || page?.meta?.currentPage >= page.meta?.totalPages ? undefined : page.meta.currentPage + 1;
const setPartialParams = (partialParams, searchParams) => {
    const params = new URLSearchParams(Array.from(searchParams?.entries() || []));
    Object.keys(partialParams).forEach((key) => {
        const value = partialParams[key];
        if (value === "" || !value) {
            params.delete(key);
            params.delete(`${key}[]`);
        }
        else if (Array.isArray(value)) {
            params.delete(key);
            params.delete(`${key}[]`);
            for (const item of value) {
                params.append(`${key}[]`, item);
            }
        }
        else {
            params.delete(`${key}[]`);
            params.set(key, value);
        }
    });
    return `?${params}`;
};
const isParamActive = (link, searchParams) => {
    for (const key of Object.keys(link)) {
        if (link[key] === "" && !searchParams.has(key)) {
            continue;
        }
        if (Array.isArray(link[key])) {
            if (!link[key].every((item) => searchParams.getAll(`${key}[]`).includes(item))) {
                return false;
            }
        }
        else if (link[key] !== searchParams.get(key)) {
            return false;
        }
    }
    return true;
};

const Pagination = ({ page, visiblePages, onClick, size, className = "py-2", }) => {
    const searchParams = useSearchParams();
    let minPage = Math.max(1, page.currentPage - Math.floor(visiblePages / 2));
    const maxPage = Math.min(page.totalPages, minPage + visiblePages - 1);
    const pageNumbers = [];
    if (maxPage - minPage + 1 < visiblePages) {
        minPage = Math.max(1, maxPage - visiblePages + 1);
    }
    for (let i = minPage; i <= maxPage; i++) {
        pageNumbers.push(onClick ? (jsx("button", { className: cx("btn uppercase join-item", {
                "btn-active": i === page.currentPage,
                "btn-xs": size === "xs",
                "btn-sm": size === "sm",
            }), onClick: (e) => {
                e.preventDefault();
                onClick(i);
            }, children: i }, i)) : (jsx(Link, { prefetch: false, className: cx("btn uppercase join-item", {
                "btn-active": i === page.currentPage,
                "btn-xs": size === "xs",
                "btn-sm": size === "sm",
            }), href: setPartialParams({ page: `${i}` }, searchParams), children: i }, i)));
    }
    return jsx("div", { className: cx("join mx-auto", className), children: pageNumbers });
};

var styles$3 = {"table":"PaginatedTable-module_table__efs0Y","selectedRow":"PaginatedTable-module_selectedRow__Xi-QH","thead":"PaginatedTable-module_thead__Jb-pD"};

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

const HeaderResponsivePaginated = ({ elements, bulkActions, }) => {
    const t = useTranslations();
    const searchParams = useSearchParams();
    return (jsx(HeaderResponsive, { heightClassName: "h-12", elements: elements, renderDropdown: (shortcuts, i) => {
            return (jsxs(React__default.Fragment, { children: [i !== 0 && jsx("li", { className: "disabled" }), !Array.isArray(shortcuts)
                        ? shortcuts(false)
                        : shortcuts.map(({ link, text }) => {
                            if (bulkActions && bulkActions.actions.length > 0 && link.bulk === "bulk") {
                                return (jsxs(Fragment, { children: [jsx("li", { className: "menu-disabled", children: jsx("span", { children: t("pagination.bulkActions") }) }), jsx(BulkDropDownActions, { disabled: bulkActions.selected.length === 0, bulkActions: bulkActions.actions.map((b) => ({
                                                children: b.children,
                                                onSelect: async () => {
                                                    const success = await b.onSelect(bulkActions.selected);
                                                    if (success) {
                                                        bulkActions.setSelected([]);
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
                            return (jsx("li", { children: jsx(Link, { prefetch: false, className: cx({ "bg-base-300/50 font-bold hover:bg-base-300": active }), href: params === "" ? "?" : params, children: text }) }, text));
                        })] }, i));
        }, renderVisible: (element, i) => {
            if (!Array.isArray(element)) {
                return element(true);
            }
            if (i === 0 && bulkActions && bulkActions.actions.length > 0) {
                return (jsx(BulkActions, { disabled: bulkActions.selected.length === 0, bulkActions: bulkActions.actions.map((b) => ({
                        children: b.children,
                        onSelect: async () => {
                            const success = await b.onSelect(bulkActions.selected);
                            if (success) {
                                bulkActions.setSelected([]);
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
        } }));
};

const GeneralErrorsInToast = ({ errors, translateId, except = [], className = "", }) => {
    const t = useTranslations();
    return (jsx("ul", { className: "list list-disc pl-4", children: Object.keys(errors)
            .filter((key) => !except.includes(key))
            .map((key) => {
            const error = errors[key];
            return (jsx(React__default.Fragment, { children: error.map((error) => (jsxs("li", { children: [translateId && t.has(`${translateId}.${key}`) && (jsxs("span", { className: className || "text-red-800", children: [t(`${translateId}.${key}`), ": "] })), jsx("span", { className: className || "text-red-500", children: error })] }, error))) }, key));
        }) }));
};
const isError = (error) => typeof error === "object" && !!error && typeof error.type === "string" && typeof error.message === "string";
const mapToDot = (errors) => {
    const r = {};
    for (const key of Object.keys(errors)) {
        const error = errors[key];
        if (isError(error)) {
            r[key] = r[key] || [];
            if (typeof error.message === "string") {
                r[key].push(error.message);
            }
        }
        else {
            // @ts-expect-error TS2345
            const dot = mapToDot(error);
            for (const k of Object.keys(dot)) {
                r[`${key}.${k}`] = dot[k];
            }
        }
    }
    return r;
};
const GeneralErrors = (props) => jsx(GeneralErrorsInToast, { ...props, errors: mapToDot(props.errors) });
const InputErrors = ({ errors, className = "text-xs text-primary-700", }) => {
    if (!errors) {
        return null;
    }
    const messages = Array.from(new Set(formatError(errors)));
    if (messages.length === 1) {
        return (jsx("span", { className: className, children: messages[0] }, messages[0]));
    }
    return (jsx("ul", { className: "pl-4 list-disc", children: messages.map((message) => (jsx("li", { className: className, children: message }, message))) }));
};
const formatError = (errors) => {
    const formattedErrors = [];
    if (typeof errors === "object") {
        if (typeof errors.message === "string") {
            errors.message.split(", ").forEach((s) => {
                formattedErrors.push(s);
            });
        }
        if (typeof errors.ref === "undefined") {
            Object.keys(errors).forEach((key) => formattedErrors.push(...formatError(errors[key])));
        }
    }
    if (Array.isArray(errors)) {
        errors.forEach((error) => formattedErrors.push(...formatError(error)));
    }
    return formattedErrors;
};
const isServerError = (error) => typeof error === "object" && typeof error.errors === "object";
const useFormSubmit = (doSubmitCallback, formOptions = {}) => {
    const t = useTranslations();
    const router = useRouter$1();
    const { returnBack, reportProgress, onError, onSuccess, loadingText, savedText, ...options } = formOptions;
    const formProps = useForm(options);
    const handleSubmit = () => formProps.handleSubmit((values) => {
        const promise = new Promise((res, rej) => {
            if (formOptions.confirm && !isConfirmed.current) {
                setNeedsConfirm(true);
                return rej("Form confirmation is required");
            }
            setNeedsConfirm(false);
            isConfirmed.current = false;
            doSubmitCallback(values)
                .then((data) => {
                if (isServerError(data)) {
                    if (typeof onError === "function") {
                        onError(data);
                    }
                    addServerErrors(data.errors, formProps.setError);
                    rej(data);
                    return;
                }
                if (typeof onSuccess === "function") {
                    onSuccess(data);
                }
                res(data);
                if (returnBack !== false) {
                    router.back();
                }
            })
                .catch((e) => {
                captureException(e, { extra: { formValues: values } });
                rej(e);
            });
        });
        if (reportProgress !== false) {
            void toast.promise(promise, {
                loading: loadingText || t("general.saving"),
                success: savedText || t("general.saved"),
                error: (data) => {
                    if (isServerError(data)) {
                        return (jsxs(Fragment, { children: [t("general.validateError"), ":", " ", jsx(GeneralErrors, { errorClassName: "text-gray-500", messageClassName: "text-gray-500", translateId: options.translateErrors, errors: formProps.formState.errors })] }));
                    }
                    return t("general.error");
                },
            }, { id: "form-submit" });
        }
        return promise;
    }, (r) => {
        console.log("INVALID FORM:", r);
    });
    const isConfirmed = useRef(false);
    const [needsConfirm, setNeedsConfirm] = useState(false);
    return {
        ...formProps,
        confirm: formOptions.confirm
            ? {
                needsConfirm,
                setNeedsConfirm: (success) => {
                    if (success) {
                        isConfirmed.current = true;
                    }
                    else {
                        isConfirmed.current = false;
                        setNeedsConfirm(false);
                    }
                },
                showDialog: () => {
                    if (needsConfirm) {
                        return;
                    }
                    setNeedsConfirm(true);
                },
            }
            : undefined,
        handleSubmit,
    };
};
const ConfirmSave = ({ onConfirm }) => {
    const t = useTranslations();
    const buttonRef = useRef(null);
    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [buttonRef]);
    return (jsx("div", { className: "modal modal-open", role: "dialog", children: jsxs("div", { className: "modal-box", children: [jsx("h3", { className: "text-lg font-bold mb-4", children: t("frontendComponents.saveConfirm") }), jsxs("div", { className: "modal-action grid grid-cols-2 gap-2", children: [jsx("button", { ref: buttonRef, className: "btn btn-primary", onClick: () => onConfirm(true), children: t("frontendComponents.save") }), jsx("a", { className: "btn", onClick: () => onConfirm(false), children: t("frontendComponents.cancel") })] })] }) }));
};
const addServerErrors = (errors, setError) => Object.entries(errors).forEach(([key, value]) => {
    const array = Array.isArray(value) ? value : [errors];
    setError(key, { type: "server", message: array?.join(", ") || "" });
});

function AddNew({ onAdd, names }) {
    const [name, setName] = useState("");
    const t = useTranslations();
    return (jsxs("div", { className: "join w-full", children: [jsx("input", { value: name, onChange: (e) => setName(e.target.value), className: "input input-bordered join-item grow", type: "text" }), jsx("button", { disabled: name.trim() === "" || names.includes(name), className: "btn btn-success join-item", onClick: () => {
                    if (name.trim() === "") {
                        return;
                    }
                    onAdd(name);
                    setName("");
                }, children: t("general.addNew") })] }));
}
const PaginationConfiguration = ({ name, configName, columns, setConfigName, store, disabled, configs: configsFromRemote, refresh, }) => {
    const [show, setShow] = useState();
    const t = useTranslations();
    const [isLoading, setLoading] = useState(false);
    const cc = useMemo(() => {
        if (!configsFromRemote) {
            return undefined;
        }
        for (const key of Object.keys(configsFromRemote)) {
            if (configsFromRemote[key].length < columns.length) {
                for (const column of columns) {
                    if (!configsFromRemote[key].find((c) => c.name === (isActionColumn(column) ? "action" : column.name))) {
                        configsFromRemote[key].push({
                            name: isActionColumn(column) ? "action" : column.name,
                            enabled: !column.hiddenByDefault,
                        });
                    }
                }
            }
        }
        const configs = {};
        for (const [key, value] of Object.entries(configsFromRemote)) {
            value.forEach((c, i) => {
                configs[key] = configs[key] || [];
                const column = columns.find((col) => (isActionColumn(col) ? "action" : col.name) === c.name);
                if (column) {
                    configs[key][i] = { name: c.name, column: column, enabled: c.enabled };
                }
            });
        }
        return configs;
    }, [columns, configsFromRemote]);
    const [configs, setConfigs] = useState(cc);
    const [activeConfigName, setActiveConfigName] = useState(configName || "default");
    const [open, setOpen] = useState(null);
    return (jsxs(Fragment, { children: [jsx(Popover, { showOnClick: true, title: (ref, p, isOpen) => (jsx("button", { disabled: disabled, ref: ref, ...p, className: cx("btn btn-xs", { "btn-active": isOpen }), children: jsx(AdjustmentsHorizontalIcon, { className: "size-4" }) })), children: (close) => configs ? (jsxs("ul", { className: "p-1 menu menu-sm", "data-theme": "dim", children: [Object.keys(configs).map((configName) => (jsx("li", { children: jsxs("button", { onClick: (e) => {
                                    e.preventDefault();
                                    setConfigName(configName);
                                    close();
                                    store
                                        .setConfigName(name, configName)
                                        .then(() => {
                                        toast(configName === "default" ? t("pagination.configuration.defaultTitle") : configName);
                                        setActiveConfigName(configName);
                                    })
                                        .catch((e) => {
                                        captureException(e);
                                        toast.error(t("general.error"));
                                    });
                                }, children: [activeConfigName === configName ? (jsx(CheckIcon, { className: "size-4" })) : (jsx("div", { className: "size-4" })), configName === "default" ? t("pagination.configuration.defaultTitle") : configName] }) }, configName))), jsx("li", { className: "border-t border-t-base-content mx-2" }), jsx("li", { children: jsxs("button", { onClick: () => {
                                    close();
                                    setShow(!show);
                                }, children: [jsx(Cog6ToothIcon, { className: "size-4" }), t("general.settings")] }) })] })) : (jsx(LoadingComponent, {})) }), show !== undefined &&
                createPortal(jsxs("dialog", { className: `modal z-[1001] ${show ? "modal-open" : ""}`, onClose: () => setShow(false), children: [jsxs("div", { className: "modal-box max-h-[calc(100vh-150px)] overflow-y-auto mt-10", children: [jsx("h3", { className: "font-bold text-lg", children: t("pagination.configuration.title") }), configs ? (jsxs(Fragment, { children: [jsxs("div", { className: "space-y-4 mt-4", children: [Object.entries(configs).map(([configName, value]) => {
                                                    if (configName === "default") {
                                                        return (jsxs("div", { tabIndex: 0, className: `collapse bg-base-200 border-base-300 border ${open === configName ? "collapse-open" : "collapse-close"}`, children: [jsx("div", { className: "collapse-title font-semibold cursor-pointer", onClick: () => setOpen(configName === open ? null : configName), children: t("pagination.configuration.defaultTitle") }), jsx("div", { className: "collapse-content text-sm space-y-2", children: value.map((item, index) => (jsx("div", { className: "flex justify-between items-center p-2 bg-base-100 rounded-xl border border-border shadow-sm grow-0", children: jsxs("label", { children: [jsx("input", { disabled: true, checked: item.enabled, type: "checkbox", className: "checkbox checkbox-xs mr-2" }), isActionColumn(item.column)
                                                                                    ? t("pagination.configuration.actionColumn")
                                                                                    : item.column.title] }) }, index))) })] }, configName));
                                                    }
                                                    return (jsxs("div", { tabIndex: 0, className: `collapse bg-base-200 border-base-300 border ${open === configName ? "collapse-open" : "collapse-close"}`, children: [jsx("div", { className: "collapse-title font-semibold cursor-pointer p-4!", onClick: () => setOpen(configName === open ? null : configName), children: jsxs("div", { className: "flex", children: [jsx("div", { className: "grow", children: configName }), jsx("button", { className: "btn btn-xs btn-circle btn-error btn-ghost", onClick: () => {
                                                                                setConfigs((configs) => {
                                                                                    const newConfigs = { ...configs };
                                                                                    delete newConfigs[configName];
                                                                                    return newConfigs;
                                                                                });
                                                                                if (open === configName) {
                                                                                    setOpen(null);
                                                                                }
                                                                            }, children: jsx(XMarkIcon, { className: "size-4" }) })] }) }), jsx("div", { className: "collapse-content text-sm", children: jsx(OrderColumns, { name: configName, items: value, setOrder: (c) => setConfigs((oldCfg) => ({ ...oldCfg, [configName]: c })) }) })] }, configName));
                                                }), jsx(AddNew, { names: Object.keys(configs), onAdd: (name) => {
                                                        setConfigs((oldCfg) => ({
                                                            ...oldCfg,
                                                            [name]: columns.map((c) => ({
                                                                column: c,
                                                                enabled: !c.hiddenByDefault,
                                                                name: isActionColumn(c) ? "action" : c.name,
                                                            })),
                                                        }));
                                                        setOpen(name);
                                                    } })] }), jsx("hr", { className: "my-4" }), jsx("div", { className: "flex justify-center", children: jsx("button", { disabled: isLoading, className: "btn btn-primary", onClick: () => {
                                                    const configsWinNoColumns = {};
                                                    for (const [key, value] of Object.entries(configs)) {
                                                        if (key !== "default") {
                                                            configsWinNoColumns[key] = value.map((d) => ({ enabled: d.enabled, name: d.name }));
                                                        }
                                                    }
                                                    setLoading(true);
                                                    store
                                                        .setConfigs(name, configsWinNoColumns)
                                                        .then(() => {
                                                        setShow(false);
                                                        refresh();
                                                    })
                                                        .catch((e) => {
                                                        if (isServerError(e)) {
                                                            for (const value of Object.values(e.errors)) {
                                                                if (Array.isArray(value) && typeof value[0] === "string") {
                                                                    toast.error(value[0]);
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                        toast.error(t("general.error"));
                                                        captureException(e);
                                                    })
                                                        .finally(() => setLoading(false));
                                                }, children: t("general.saveButton") }) })] })) : (jsx(LoadingComponent, {}))] }), jsx("form", { method: "dialog", className: "modal-backdrop", onSubmit: () => setShow(false), children: jsx("button", { children: "close" }) })] }), document.body)] }));
};
const OrderColumns = ({ name, items, setOrder, }) => {
    return (jsx(Reorder.Group, { axis: "y", values: items, onReorder: setOrder, className: "space-y-2 w-full max-w-2xl mx-auto", children: items.map((column, i) => (jsx(ColumnItem, { onChange: (e) => {
                const itemCopy = [...items];
                const col = itemCopy.find((c) => c === column);
                if (col) {
                    col.enabled = e.target.checked;
                    setOrder(itemCopy);
                }
            }, item: column }, `${name}-${isActionColumn(column.column) ? "action" : column.column.title}`))) }));
};
function ReorderHandle({ dragControls }) {
    return (jsx(motion.div, { whileTap: { scale: 0.95 }, onPointerDown: (e) => {
            e.preventDefault();
            dragControls.start(e);
        }, className: "cursor-grab text-base-content/40 active:cursor-grabbing p-2", children: jsx(ArrowsUpDownIcon, { className: "size-4" }) }));
}
const inactiveShadow = "0px 0px 0px rgba(0,0,0,0.8)";
function useRaisedShadow(value) {
    const boxShadow = useMotionValue(inactiveShadow);
    useEffect(() => {
        let isActive = false;
        value.on("change", (latest) => {
            const wasActive = isActive;
            if (latest !== 0) {
                isActive = true;
                if (isActive !== wasActive) {
                    animate(boxShadow, "5px 5px 15px rgba(0,0,0,0.15)");
                }
            }
            else {
                isActive = false;
                if (isActive !== wasActive) {
                    animate(boxShadow, inactiveShadow);
                }
            }
        });
    }, [value]);
    return boxShadow;
}
function ColumnItem({ item, onChange, }) {
    const y = useMotionValue(0);
    const boxShadow = useRaisedShadow(y);
    const dragControls = useDragControls();
    const t = useTranslations();
    return (jsxs(Reorder.Item, { value: item, onChange: onChange, style: { boxShadow, y }, dragListener: false, dragControls: dragControls, className: "flex justify-between items-center pl-2 bg-base-100 rounded-xl border border-border shadow-sm", children: [jsx("div", { className: "grow-0", children: jsxs("label", { children: [jsx("input", { type: "checkbox", checked: item.enabled, onChange: onChange, className: "checkbox checkbox-xs mr-2" }), isActionColumn(item.column) ? t("pagination.configuration.actionColumn") : item.column.title] }) }), jsx(ReorderHandle, { dragControls: dragControls })] }));
}

class LocalStorage {
    async setDisplayAs(title, displayAs) {
        localStorage.setItem(`${title}DisplayAs`, displayAs);
    }
    async getDisplayAs(title) {
        return localStorage.getItem(`${title}DisplayAs`) || "grid";
    }
    async getConfig(title, columns) {
        const configName = title ? await this.getConfigName(title) : undefined;
        if (!configName) {
            return columns.map((c) => ({
                name: isActionColumn(c) ? "action" : c.name,
                enabled: !c.hiddenByDefault,
            }));
        }
        const configs = await this.getConfigs(configName, columns);
        if (!configs[configName]) {
            return configs.default;
        }
        return configs[configName];
    }
    async getConfigName(title) {
        return localStorage.getItem(title) || "default";
    }
    async getConfigs(title, columns) {
        const configString = localStorage.getItem(`${title}Columns`);
        const defaultConfig = {
            default: columns.map((c) => ({
                name: isActionColumn(c) ? "action" : c.name,
                enabled: !c.hiddenByDefault,
            })),
        };
        if (configString === null) {
            return defaultConfig;
        }
        const parsed = JSON.parse(configString || "null");
        if (typeof parsed !== "object" || parsed === null) {
            return defaultConfig;
        }
        for (const key of Object.keys(parsed)) {
            if (!Array.isArray(parsed[key])) {
                return defaultConfig;
            }
            if (parsed[key].length !== columns.length) {
                return defaultConfig;
            }
            for (const item of parsed[key]) {
                if (typeof item !== "object" ||
                    item === null ||
                    typeof item.index !== "number" ||
                    typeof item.enabled !== "boolean") {
                    return defaultConfig;
                }
            }
        }
        return {
            ...parsed,
            default: defaultConfig.default,
        };
    }
    async setConfigName(title, configName) {
        localStorage.setItem(title, configName);
    }
    async setConfigs(title, configs) {
        localStorage.setItem(`${title}Column`, JSON.stringify(configs));
    }
}

var styles$2 = {"dayPicker":"DatePicker-module_dayPicker__VRSSY"};

function DateTimePicker({ value, size, onChange, disabled, required, from, to, placeholder, className, toggleClassName, ...rest }) {
    const [dateString, setDateString] = useState(value ? format(value, "yyyy-MM-dd HH:mm") : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? format(value, "yyyy-MM-dd HH:mm") : "");
    }, [value]);
    const [valueTemp, setValueTemp] = useState(value);
    useEffect(() => {
        setValueTemp(value);
    }, [value]);
    const minutesRef = useRef(null);
    const hoursRef = useRef(null);
    useEffect(() => {
        setDateString(valueTemp ? format(valueTemp, "yyyy-MM-dd HH:mm") : "");
        try {
            if (valueTemp) {
                minutesRef.current
                    ?.querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
                hoursRef.current
                    ?.querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
                    ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        catch (_) {
            /* empty */
        }
    }, [valueTemp]);
    const t = useTranslations();
    let matcher = undefined;
    if (from && to) {
        matcher = { before: from, after: to };
    }
    else if (from) {
        matcher = { before: from };
    }
    else if (to) {
        matcher = { after: to };
    }
    return (jsxs("label", { className: cx("w-full input input-bordered", className, {
            "input-xs": size === "xs",
            "input-sm": size === "sm",
        }), children: [jsx(Popover, { title: (ref, popoverProps) => (jsx("input", { required: required, ...rest, value: dateString, className: "grow", disabled: disabled, ref: ref, placeholder: placeholder, onChange: (e) => {
                        setDateString(e.target.value);
                        if (e.target.value.length !== 16) {
                            return;
                        }
                        const date = parse(e.target.value, "yyyy-MM-dd HH:mm", new Date());
                        if (isValid(date)) {
                            setValueTemp(date);
                        }
                    }, ...popoverProps, onBlur: (e) => {
                        const date = parse(dateString, "yyyy-MM-dd HH:mm", new Date());
                        if (isValid(date)) {
                            onChange(date);
                        }
                        if (typeof popoverProps?.onBlur === "function") {
                            popoverProps.onBlur(e);
                        }
                    } })), onShow: (open) => {
                    if (!open) {
                        onChange(valueTemp);
                        return;
                    }
                    if (minutesRef.current && hoursRef.current && valueTemp) {
                        try {
                            minutesRef.current
                                .querySelector(`[data-minute="${valueTemp.getMinutes() || 0}"]`)
                                ?.scrollIntoView({ behavior: "instant", block: "center" });
                            hoursRef.current
                                .querySelector(`[data-hour="${valueTemp.getHours() || 0}"]`)
                                ?.scrollIntoView({ behavior: "instant", block: "center" });
                        }
                        catch (_) {
                            /* empty */
                        }
                    }
                }, showOnClick: true, showOnFocus: true, showOnHover: false, children: (close) => (jsxs(Fragment, { children: [jsxs("div", { className: "flex", children: [jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$2.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, disabled: matcher, selected: valueTemp || undefined, defaultMonth: valueTemp || undefined, onSelect: (day) => {
                                        day?.setHours((valueTemp || new Date()).getHours(), (valueTemp || new Date()).getMinutes() || 0);
                                        if (from && day && from > day) {
                                            day.setHours(from.getHours(), from.getMinutes());
                                        }
                                        if (to && day && to < day) {
                                            day.setHours(to.getHours(), to.getMinutes());
                                        }
                                        setValueTemp(day || null);
                                    } }), jsxs("div", { children: [jsxs("div", { className: "text-white text-center pt-5 pb-4 text-xs", children: [t("datePicker.time"), ":"] }), jsxs("div", { className: "flex", children: [jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: hoursRef, children: new Array(24).fill(0).map((_, hour) => (jsx("li", { "data-hour": hour, children: (from && valueTemp && isSameDay(from, valueTemp) && from.getHours() > hour) ||
                                                            (to && valueTemp && isSameDay(to, valueTemp) && to.getHours() < hour) ? (jsx(Fragment, {})) : (jsx("button", { className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getHours() === hour ? "bg-primary-500" : "hover:bg-white"}`, onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setHours(hour);
                                                                setValueTemp(date);
                                                            }, children: hour < 10 ? `0${hour}` : hour })) }, hour))) }), jsx("ul", { className: "h-53 mx-1 overflow-y-scroll", ref: minutesRef, children: new Array(60).fill(0).map((_, minute) => (jsx("li", { "data-minute": minute, children: (from && valueTemp && isSameHour(from, valueTemp) && from.getMinutes() > minute) ||
                                                            (to && valueTemp && isSameHour(to, valueTemp) && to.getMinutes() < minute) ? (jsx(Fragment, {})) : (jsx("button", { onClick: () => {
                                                                const date = new Date(valueTemp || new Date());
                                                                date.setMinutes(minute);
                                                                setValueTemp(date);
                                                            }, className: `text-white text-xs rounded-sm px-4 p-2 cursor-pointer hover:text-black ${valueTemp?.getMinutes() === minute ? "bg-primary-500" : "hover:bg-white"}`, children: minute + 1 < 10 ? `0${minute}` : minute })) }, minute))) })] })] })] }), jsx("div", { className: "text-center pb-2", children: jsx("button", { className: "btn btn-xs mx-auto w-30", type: "button", onClick: () => {
                                    onChange(valueTemp);
                                    close();
                                }, children: t("datePicker.ok") }) })] })) }), !required ? (jsx("button", { disabled: !required && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? jsx(XMarkIcon, { className: "size-4" }) : jsx(ClockIcon, { className: "size-4" }) })) : (jsx("div", { className: cx("cursor-pointer", toggleClassName), children: jsx(ClockIcon, { className: "size-4" }) }))] }));
}

const formatDate = (date) => {
    if (!date) {
        return "";
    }
    return format(date, "yyyy-MM-dd");
};
const DateInput = ({ onChange, value, className, toggleClassName, required, disabled, size, placeholder, from, to, ...rest }) => {
    const [dateString, setDateString] = useState(value ? formatDate(value) : "");
    const params = useParams();
    useEffect(() => {
        setDateString(value ? formatDate(value) : "");
    }, [value]);
    let matcher = undefined;
    if (from && to) {
        matcher = { before: from, after: to };
    }
    else if (from) {
        matcher = { before: from };
    }
    else if (to) {
        matcher = { after: to };
    }
    const [isOpen, setIsOpen] = useState(false);
    return (jsx(FocusTrap, { className: "grow", features: isOpen ? FocusTrapFeatures.FocusLock : FocusTrapFeatures.None, children: jsx(Popover, { showOnClick: true, showOnFocus: true, showOnHover: false, onShow: (open) => setIsOpen(open), title: (ref, popoverProps) => (jsxs("div", { ref: ref, ...rest, ...popoverProps, className: cx("input input-bordered", {
                    "input-xs pl-3 pr-1 gap-0.5": size === "xs",
                    "input-sm pl-3 pr-2 gap-1": size === "sm",
                    ["w-full"]: !className?.includes("w-"),
                }, className), children: [jsx("input", { value: dateString, className: "grow", required: required, disabled: disabled, placeholder: placeholder, onChange: (e) => {
                            if (e.target.value.length === 0) {
                                setDateString("");
                                onChange(null);
                                return;
                            }
                            if (e.target.value.length > 10) {
                                return;
                            }
                            setDateString(e.target.value);
                            if (e.target.value.length !== 10) {
                                return;
                            }
                            const date = parse(e.target.value, "yyyy-MM-dd", new Date());
                            if (isValid(date)) {
                                onChange(date);
                            }
                        }, onBlur: (e) => {
                            const date = parse(dateString, "yyyy-MM-dd", new Date());
                            if (isValid(date)) {
                                onChange(date);
                            }
                            rest.onBlur?.(e);
                        } }), required || !value ? (jsx("div", { className: cx(toggleClassName, "cursor-pointer"), children: jsx(CalendarIcon, { className: "size-4" }) })) : (jsx("button", { type: "button", disabled: !required && !value, className: cx("cursor-pointer", toggleClassName), onClick: (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onChange(null);
                        }, children: jsx(XMarkIcon, { className: "size-4" }) }))] })), children: (close) => (jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$2.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, disabled: matcher, weekStartsOn: 1, selected: value || undefined, defaultMonth: value || undefined, onSelect: (day) => {
                    onChange(day || null);
                    close();
                } })) }) }));
};

function PortalSSR(props) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (props.enabled && mounted) {
        return jsx(Portal, { children: props.children });
    }
    return props.children;
}
const Select = ({ onChange, disabled, required, inputRef, options, name, portalEnabled, optionLabel = (m) => m.name, value, size: size$1, className, placeholder, groupBy, empty, beforeOptions, header, afterOptions, onQueryChange, minWidth = 100, maxHeight = 500, afterInput, hideNoItemsOption, ...rest }) => {
    const t = useTranslations();
    const { refs, floatingStyles } = useFloating({
        placement: "bottom-start",
        middleware: [
            size({
                apply({ rects, elements, availableHeight }) {
                    Object.assign(elements.floating.style, {
                        width: `${Math.max(minWidth ?? 0, rects.reference.width)}px`,
                        maxHeight: `${Math.min(availableHeight - 10, maxHeight)}px`,
                    });
                },
            }),
        ],
        whileElementsMounted: autoUpdate,
    });
    let currentGroupBy = null;
    return (jsx(Combobox, { immediate: true, "data-testid": "select", disabled: disabled, value: value, onChange: onChange, ...rest, children: ({ open }) => (jsxs("div", { children: [jsxs("div", { className: cx("relative input input-bordered pr-1", className, {
                        "w-full": !className?.includes("w-"),
                        "input-sm gap-1": size$1 === "sm",
                        "input-xs gap-0.5": size$1 === "xs",
                    }), ref: refs.setReference, children: [jsx(ComboboxInput, { required: required, ref: inputRef, "data-testid": "select-input", placeholder: placeholder, onFocus: (e) => e?.target?.select(), autoComplete: "off", name: name, displayValue: (model) => (model ? optionLabel(model) : ""), onChange: onQueryChange && ((event) => onQueryChange(event.target.value)) }), header, !required && value ? (jsx("button", { className: "z-1 cursor-pointer", type: "button", onClick: () => onChange(null), children: jsx(XMarkIcon, { className: "size-4" }) })) : (!open && afterInput), jsx(ComboboxButton, { "data-testid": "select-input-btn", className: "", onClick: (e) => {
                                e.target?.parentNode?.parentNode?.querySelector("input")?.select();
                            }, children: jsx(ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) })] }), jsx(PortalSSR, { enabled: portalEnabled, children: jsx(Transition, { as: Fragment$1, leave: "transition-none", children: jsx("div", { style: floatingStyles, ref: refs.setFloating, className: "z-[2000] bg-base-100 mt-1 pb-1 w-full border-base-content/10 border overflow-y-auto rounded-box shadow-lg", children: jsxs(ComboboxOptions, { children: [beforeOptions, !required && (jsx(SelectOption, { size: size$1, "data-testid": "select-option-empty", value: null, children: empty || t("selectFromApi.select") }, "empty")), options.length === 0 && !hideNoItemsOption ? (jsx("div", { className: "cursor-default select-none py-2 px-4 text-base-content/60", children: jsx("span", { className: cx({ "text-xs": "xs" === size$1 || "sm" === size$1 }), children: t("selectFromApi.nothingFound") }) })) : (options.map((model, i) => {
                                        const group = groupBy?.(model);
                                        let groupNode;
                                        if (currentGroupBy !== group) {
                                            currentGroupBy = group;
                                            groupNode = (jsx("div", { className: "sticky top-0 bg-base-100 font-bold z-10 p-2 text-xs text-base-content/40 border-b border-b-base-200 cursor-default select-none truncate", children: group }));
                                        }
                                        return (jsxs(React__default.Fragment, { children: [groupNode, jsx(SelectOption, { "data-testid": `select-option-${i}`, className: groupBy ? "pl-4" : undefined, value: model, size: size$1, children: optionLabel(model) })] }, `${optionLabel(model)}-${i}`));
                                    })), afterOptions] }) }) }) })] })) }));
};
const SelectOption = ({ value, size, children, className, ...rest }) => (jsx(ComboboxOption, { ...rest, className: ({ focus }) => cx(`relative cursor-default select-none`, className, {
        "px-2 py-1": size === "xs" || size === "sm",
        "p-2": !size,
        "bg-primary text-white": focus,
        "text-base-content": !focus,
    }), value: value, children: ({ selected, focus }) => (jsxs(Fragment, { children: [jsx("span", { className: cx({
                    "text-white": focus,
                    "pr-3 font-bold": selected,
                    "font-normal": !selected,
                    "text-sm": !size,
                    "text-xs": "xs" === size || "sm" === size,
                }), children: children }), selected && (jsx("span", { className: cx("absolute inset-y-0 right-1 flex items-center pl-3", {
                    "text-white": focus,
                    "text-teal-600": !focus,
                }), children: jsx(CheckIcon, { className: "h-5 w-5", "aria-hidden": "true" }) }))] })) }));

const SelectPaginatedFromApi = ({ onChange, name, value, searchFromChars = 3, queryKey, queryFn, optionLabel = (model) => model.name, optionValue = (model) => model.id, ...rest }) => {
    const [query, setQuery] = useState(value ? `${value}` : "");
    const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        getPreviousPageParam,
        getNextPageParam,
        enabled: !rest.disabled,
        queryKey: [...queryKey, rest.disabled, query.length < searchFromChars ? "" : query],
        initialPageParam: 1,
        queryFn: ({ queryKey, pageParam }) => {
            if (rest.disabled) {
                return Promise.reject();
            }
            const page = typeof pageParam === "number" ? pageParam : undefined;
            const search = queryKey[queryKey.length - 1] || "";
            if (typeof search !== "string" || search === "" || search.length < searchFromChars) {
                return queryFn({ page });
            }
            return queryFn({ search, page });
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const t = useTranslations();
    useEffect(() => {
        void refetch();
    }, [refetch, query]);
    const { ref, inView } = useInView({ threshold: 0.5 });
    useEffect(() => {
        if (inView) {
            void fetchNextPage();
        }
    }, [fetchNextPage, inView]);
    useEffect(() => {
        if (!isLoading) {
            const selected = (data?.pages || [])
                .map((d) => d?.data || [])
                .flat()
                .find((b) => optionValue(b) === value);
            if (selected) {
                onChange(selected);
            }
        }
    }, [isLoading]);
    return (jsx(Select, { ...rest, disabled: rest.disabled, onChange: onChange, onQueryChange: setQuery, options: data?.pages.flatMap((d) => d?.data || []) ?? [], value: typeof value === "number" || typeof value === "string"
            ? ((data?.pages || [])
                .map((d) => d?.data || [])
                .flat()
                .find((b) => optionValue(b) === value) ?? null)
            : (value ?? null), optionLabel: optionLabel, afterInput: isLoading ? jsx(LoadingComponent, { loadingClassName: "size-4 text-primary" }) : undefined, hideNoItemsOption: isLoading, afterOptions: jsxs(Fragment, { children: [rest.afterOptions, isFetchingNextPage || isLoading ? (jsx(LoadingComponent, { className: "my-2" })) : (hasNextPage && (jsx("div", { className: "text-center", children: jsx("button", { ref: ref, className: "btn btn-ghost btn-xs my-1 btn-wide", onClick: () => fetchNextPage(), children: t("infiniteScroll.loadMore") }) })))] }) }));
};

const timeToDate = (date, format = "HH:mm:ss") => {
    const parsed = parse(date, format, new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
const dateToTimeString = (date, timeFormat = "HH:mm:ss") => format(date, timeFormat);
const stringToDate = (date, timeZone) => {
    let parsed = parse(date, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(parsed)) {
        parsed.setMilliseconds(0);
        return parsed;
    }
    return undefined;
};
const dateToStringDate = (date) => {
    return format(date, "yyyy-MM-dd");
};

const TimePicker = ({ className, value, onChange, placeholder, required, disabled }) => {
    const formatValue = (value) => value ? dateToTimeString(timeToDate(value) || new Date(), "HH:mm") : undefined;
    const [innerValue, setInnerValue] = useState(formatValue(value) || "");
    useEffect(() => {
        setInnerValue(formatValue(value) || "");
    }, [value]);
    return (jsx("input", { placeholder: placeholder, type: "text", disabled: disabled, required: required, className: className, value: innerValue, onBlur: () => {
            if (innerValue.match(/^\d{2}:\d{2}$/)) {
                onChange({ target: { value: dateToTimeString(timeToDate(innerValue, "HH:mm") || new Date(), "HH:mm:ss") } });
            }
            else {
                setInnerValue(formatValue(value) || "");
            }
        }, onChange: (e) => {
            setInnerValue(e.target.value);
            if (e.target.value.match(/^\d{2}:\d{2}$/)) {
                onChange({
                    target: { value: dateToTimeString(timeToDate(e.target.value, "HH:mm") || new Date(), "HH:mm:ss") },
                });
            }
        } }));
};

var styles$1 = {"desc":"Input-module_desc__3D3hV"};

const SelectFromApi = ({ name, value, queryKey, queryFn, optionLabel = (model) => model.name, optionValue = (model) => model.id, filter, ...rest }) => {
    const [query, setQuery] = useState("");
    const { isLoading, data, refetch } = useQuery({
        enabled: !rest.disabled,
        queryKey: [...queryKey, rest.disabled],
        queryFn: () => {
            if (rest.disabled) {
                return Promise.reject();
            }
            return queryFn();
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    useEffect(() => {
        void refetch();
    }, [refetch, query]);
    return (jsx(Select, { ...rest, disabled: rest.disabled, onChange: rest.onChange, optionLabel: optionLabel, options: data ?? [], onQueryChange: setQuery, afterInput: isLoading ? jsx(LoadingComponent, { loadingClassName: "size-4 text-primary" }) : undefined, hideNoItemsOption: isLoading, value: typeof value === "number" || typeof value === "string"
            ? ((data || []).find((b) => optionValue(b) === value) ?? null)
            : (value ?? null), afterOptions: jsxs(Fragment, { children: [rest.afterOptions, isLoading && jsx(LoadingComponent, { className: "my-2" })] }) }));
};

const TextFormField = ({ required, disabled, error, className, id, type, register, label, size, options, desc, name, fieldSetClassName, ref, ...rest }) => {
    const r = register(name, {
        required: required,
        disabled: disabled,
        ...(options || {}),
    });
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("input", { id: id, type: type || "text", ...r, ref: (i) => {
                            r.ref(i);
                            if (ref) {
                                ref(i);
                            }
                        }, required: required, placeholder: required ? `${label}*` : label, className: cx("input input-bordered w-full", className, {
                            "input-xs": size === "xs",
                            "input-sm": size === "sm",
                            "input-error": error,
                        }), ...rest }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles$1.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const SelectFormField = ({ id, disabled, fieldSetClassName, label, register, required, name, error, desc, options, size, className, children, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("select", { id: id, ...register(name, {
                            required: required,
                            disabled: disabled,
                            ...(options || {}),
                        }), className: cx("select select-bordered w-full", className, {
                            "select-xs": size === "xs",
                            "select-sm": size === "sm",
                            "select-error": error,
                        }), ...rest, children: children }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles$1.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const TextareaFormField = (props) => {
    const r = props.register(props.name, {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    });
    const [length, setLength] = useState(0);
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("textarea", { id: props.id, placeholder: props.required ? `${props.label}*` : props.label, ...r, className: cx("textarea textarea-bordered w-full", props.className, {
                            "textarea-xs": props.size === "xs",
                            "textarea-sm": props.size === "sm",
                            "textarea-error": props.error,
                        }), ref: (el) => {
                            r.ref(el);
                            if (props.maxLength && el) {
                                setLength(el.value.length ?? 0);
                            }
                        }, onChange: (e) => {
                            if (props.maxLength) {
                                setLength(e.target?.value?.length ?? 0);
                            }
                        } }), props.maxLength && (jsx("div", { className: "badge badge-xs badge-ghost absolute right-1 bottom-1", children: `${length}/${props.maxLength}` })), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles$1.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const RadioBoxFormField = ({ name, options, label = "", value, onChange, }) => (jsxs("div", { children: [label || "", jsx("div", { className: "flex flex-col pt-2 gap-2", children: Object.entries(options).map(([key, label]) => (jsxs("label", { children: [jsx("input", { type: "radio", checked: value === key, name: name, value: key, onChange: () => onChange(key), className: "radio radio-primary" }, key), " ", typeof label === "string" ? label : null] }, key))) })] }));
const CheckboxFormField = (props) => {
    return (jsxs(Fragment, { children: [jsx("div", { className: props.fieldSetClassName, children: jsxs("label", { children: [jsx("input", { id: props.id, type: "checkbox", ...props.register(props.name, {
                                disabled: props.disabled,
                                ...(props.options || {}),
                            }), className: props.checkbox
                                ? cx("checkbox", props.className, {
                                    "checkbox-sm": props.size === "sm",
                                    "checkbox-xs": props.size === "xs",
                                })
                                : cx("toggle", props.className, {
                                    "toggle-sm": props.size === "sm",
                                    "toggle-xs": props.size === "xs",
                                }) }), jsx("span", { className: cx("text-sm text-gray-500 label-text grow pl-2", props.labelClassName), children: props.label })] }) }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles$1.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const DateFormField = ({ fieldSetClassName, label, control, error, desc, disabled, useDate, ...props }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { disabled: disabled, control: control, rules: { required: props.required === true }, name: props.name, render: ({ field }) => (jsx(DateInput, { ...props, className: cx({ "input-error": error }, props.className), placeholder: props.required ? `${label}*` : label, value: field.value, disabled: field.disabled, onChange: (value) => {
                                if (useDate) {
                                    field.onChange(value);
                                }
                                else {
                                    field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                                }
                            } })) }), jsxs("span", { children: [label, props.required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles$1.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const SelectPaginatedFromApiFormField = ({ optionValue = (model) => model.id, ...props }) => {
    return (jsx(Controller, { control: props.control, name: props.name, disabled: props.disabled, rules: { required: props.required === true }, render: ({ field }) => (jsx(SelectPaginatedFromApiField, { ...props, disabled: field.disabled, value: field.value, onChange: (model) => {
                field.onChange(model ? optionValue(model) : null);
                props.onChange?.(model || null);
            } })) }));
};
const SelectFromApiField = ({ label, desc, error, className, fieldSetClassName, ...rest }) => (jsxs("div", { className: fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [jsxs("span", { children: [label, rest.required ? jsx(Required, {}) : null] }), jsx(SelectFromApi, { className: cx(className, { "input-error": error }), ...rest, placeholder: rest.required ? `${label}*` : label })] }), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
const SelectFromApiFormField = ({ control, onChange, optionValue = (model) => model.id, ...props }) => (jsx(Controller, { control: control, name: props.name, rules: { required: props.required === true }, render: ({ field }) => (jsx(SelectFromApiField, { ...props, value: field.value, onChange: (model) => {
            field.onChange(model ? optionValue(model) : null);
            onChange?.(model);
        } })) }));
const DateTimeFormField = ({ label, desc, control, name, disabled, error, className, fieldSetClassName, useDate, ...props }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { control: control, name: name, rules: { required: props.required === true }, disabled: disabled, render: ({ field }) => {
                            return (jsx(DateTimePicker, { ...props, className: cx(className, { "input-error": error }), placeholder: props.required ? `${label}*` : label, disabled: field.disabled, value: field.value ? (useDate ? field.value : stringToDate(field.value)) || null : null, onChange: (value) => {
                                    if (useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                                    }
                                } }));
                        } }), jsxs("span", { children: [label, props.required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: "text-xs my-0.5 text-gray-500", children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const TimeFormField = ({ label, control, className, ...props }) => {
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [!props.disabled && (jsxs("span", { children: [label, props.required && jsx(Required, {})] })), jsx(Controller, { disabled: props.disabled, rules: { required: props.required === true }, render: ({ field }) => (jsx(TimePicker, { ...props, value: field.value, onChange: (v) => field.onChange(v), placeholder: props.required ? `${label}*` : label, className: cx("input w-full", className, {
                                "input-xs": props.size === "xs",
                                "input-sm": props.size === "sm",
                                "input-error": props.error,
                            }) })), name: props.name, control: control })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const NumberFormField = ({ options, ...props }) => (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [!props?.disabled && (jsxs("span", { children: [props.label, props?.required && jsx(Required, {})] })), jsx(Controller, { name: props.name, control: props.control, disabled: props.disabled, render: ({ field }) => (jsx(NumericFormat, { placeholder: props.required ? `${props.label}*` : props.label, ...options, disabled: field?.disabled, required: props?.required, value: field.value, className: cx("w-full input input-bordered focus:outline-blue-400", props.className, {
                            "input-xs": props.size === "xs",
                            "input-sm": props.size === "sm",
                            "input-error": props.error,
                        }), onValueChange: (values) => field.onChange(values.floatValue ?? null) })) })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
const Label = ({ text, required }) => (jsx("label", { className: "label", children: jsxs("span", { className: "text-sm", children: [text, required && jsx(Required, {})] }) }));
const SelectPaginatedFromApiField = ({ label, fieldSetClassName, className, desc, error, ...props }) => (jsxs("div", { className: fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [jsxs("span", { children: [label, props.required ? jsx(Required, {}) : null] }), jsx(SelectPaginatedFromApi, { ...props, className: cx("mx-0", className, { "input-error": error }), placeholder: props.required ? `${label}*` : label })] }), desc, jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
const Required = () => {
    return jsx("span", { className: "text-error align-bottom", children: "*" });
};
const SaveButton = ({ isLoading, icon, disabled, className = "btn-block", onClick, size, children, type = "submit", ...props }) => {
    const t = useTranslations();
    const Icon = icon || CheckIcon$1;
    return (jsxs("button", { type: type, className: `btn btn-primary ${size === "sm" ? "btn-sm" : ""} ${className}`, color: "primary", disabled: isLoading || disabled, "data-testid": type === "submit" ? "submit" : undefined, onClick: (e) => {
            if (onClick) {
                e.preventDefault();
                onClick();
            }
        }, ...props, children: [children ?? t("general.saveButton"), isLoading ? jsx(LoadingComponent, { className: "size-4" }) : jsx(Icon, { className: "size-4" })] }));
};
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
            locale: params.locale === "lt" ? lt$1 : undefined,
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

const Title = ({ children, outerHeight, truncate, paddingLeft = "pl-4", }) => {
    return (jsxs(Fragment, { children: [jsx("div", { className: cx("absolute bg-base-100/50 backdrop-blur-xs z-4 w-full left-0 top-0", { "h-16": !outerHeight }, outerHeight) }), jsx("div", { className: cx("h-16 absolute z-5 flex items-center font-bold ml-[var(--top-left-bar)] w-[calc(100vw-var(--sidebar-width)-var(--top-right-bar)-var(--top-left-bar))]", { truncate }, paddingLeft), children: children })] }));
};

const limits = [10, 20, 50, 100];
function isActionColumn(column) {
    return typeof column === "object" && column.type === "actions";
}
function isFunctionColumn(column) {
    return typeof column === "object" && typeof column.body === "function";
}
const SearchField = () => {
    const t = useTranslations();
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const path = usePathname();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    return (jsx("div", { className: "w-32 sm:w-52 shrink-0 grow-0", children: jsx("form", { onSubmit: (e) => {
                e.preventDefault();
                router.push(addLocale((path + setPartialParams({ search, page: "1" }, searchParams)).replace(/^\/(en|lt)\//, "/"), params.locale));
            }, children: jsxs("div", { className: "join w-full pr-2", children: [jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), name: "search", className: "join-item input input-bordered input-xs outline-0 focus:ring-0 w-full focus:outline-0 focus:border-gray-500", placeholder: t("pagination.searchPlaceholder") }), jsx("button", { className: "join-item btn btn-neutral btn-xs uppercase", type: "submit", children: jsx(MagnifyingGlassIcon, { className: "w-4 h-4" }) })] }) }) }));
};
const PaginatedTable = ({ pagination, title, titleAbove, sortEnum, extraHeading, columns, caption, isSearchable = false, searchableShortcuts = [], addNew, bulkActions, addNewText, displayFilters, displayConfig, renderGridItem, rowClickHref, defaultDisplayAs = "list", }) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const [selected, setSelected] = React__default.useState([]);
    const [displayAs, setDisplayAs] = useState(defaultDisplayAs || "list");
    const store = useMemo(() => displayConfig?.store || new LocalStorage(), [displayConfig]);
    const [configName, setConfigName] = useState(displayConfig?.stored?.name || "default");
    const { data: paginationConfigs, refetch: refetchPaginationConfigs } = useQuery({
        enabled: !!displayConfig,
        queryKey: ["paginationConfiguration", store],
        queryFn: () => store.getConfigs(displayConfig.name, columns),
        initialData: displayConfig?.stored?.value || {},
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    paginationConfigs.default = columns.map((c, i) => ({
        name: isActionColumn(c) ? "action" : c.name,
        enabled: !c.hiddenByDefault,
    }));
    if (!paginationConfigs[configName]) {
        paginationConfigs[configName] = paginationConfigs.default;
    }
    const hotKeys = [];
    if (addNew) {
        hotKeys.push({
            key: "n",
            metaKey: true,
            ctrlKey: true,
            description: t("pagination.addNew"),
            callback: () => {
                router.push(addLocale(addNew.replace(/^\/(en|lt)\//, "/"), params.locale));
            },
        });
    }
    const elements = [];
    if (bulkActions && bulkActions?.length > 0) {
        elements.push([{ link: { bulk: "bulk" }, text: "" }]);
    }
    for (const d of displayFilters || []) {
        if (d.filters.some((filter) => searchParams.get(`filter.${filter}`) !== null)) {
            const filterToDisplay = {};
            d.filters.forEach((filter) => {
                filterToDisplay[`filter.${filter}`] = searchParams.get(`filter.${filter}`) || "";
            });
            elements.push([{ text: d.name, link: filterToDisplay }]);
        }
    }
    elements.push(...searchableShortcuts);
    return (jsxs(Fragment, { children: [titleAbove && (jsx(Title, { truncate: typeof titleAbove === "string", outerHeight: "h-28", children: titleAbove })), jsxs("div", { "data-testid": "paginate-table", className: "relative h-screen", "data-test-sort": (pagination.meta.sortBy || []).flat().join("-"), children: [jsxs("div", { className: "absolute z-5 top-16 flex items-center flex-end w-full border-b border-b-base-content/5 h-12 max-w-screen sm:max-w-[calc(100vw-var(--sidebar-width))]", children: [jsx("h1", { className: `h-16 pl-4 py-3 pr-2 font-bold mr-auto ${searchableShortcuts.length > 0 ? "" : "grow"}`, children: title }), jsx(Hotkeys, { id: "paginatedTable", hotKeys: hotKeys }), (elements.length > 0 || (bulkActions && bulkActions?.length > 0)) && (jsx(HeaderResponsivePaginated, { bulkActions: bulkActions ? { actions: bulkActions, setSelected, selected } : undefined, elements: elements })), extraHeading, addNew && (jsxs(Link, { className: "btn uppercase btn-accent gap-2 justify-end  btn-xs mr-2", href: addLocale(addNew, params.locale), "data-testid": "add-new", children: [jsx(PlusIcon, { className: "w-4 h-4" }), " ", jsx("span", { className: "hidden sm:inline", children: addNewText || t("pagination.addNew") })] })), renderGridItem && (jsxs("div", { className: "join mr-2", children: [jsx("button", { className: cx("btn btn-xs join-item", { "btn-active": displayAs === "grid" }), onClick: () => {
                                            setDisplayAs("grid");
                                            if (displayConfig) {
                                                void store.setDisplayAs(displayConfig.name, "grid");
                                            }
                                        }, children: jsx(RectangleStackIcon, { className: "size-4" }) }), jsx("button", { className: cx("btn btn-xs join-item", { "btn-active": displayAs === "list" }), onClick: () => {
                                            setDisplayAs("list");
                                            if (displayConfig) {
                                                void store.setDisplayAs(displayConfig.name, "list");
                                            }
                                        }, children: jsx(QueueListIcon, { className: "size-4" }) })] })), isSearchable && jsx(SearchField, {}), displayConfig && (jsx("div", { className: "pr-2", children: jsx(PaginationConfiguration, { disabled: displayAs !== "list", store: store, name: displayConfig.name, configName: configName, columns: columns, configs: paginationConfigs, setConfigName: (name) => setConfigName(name), refresh: () => void refetchPaginationConfigs() }) }))] }), pagination.meta.totalItems === 0 ? (jsxs(Fragment, { children: [caption, jsxs("div", { className: "text-center pt-40", children: [jsxs("span", { className: "text-base-content/", children: [t("pagination.noItems"), " ", jsx("span", { className: "align-middle text-3xl ", children: "\uD83D\uDE3F" })] }), addNew && (searchParams.get("search") || "") === "" && (jsx("p", { className: "mt-4", children: jsxs(Link, { className: "btn uppercase btn-outline", href: addLocale(addNew, params.locale), children: [jsx(PlusIcon, { width: 20 }), " ", addNewText || t("pagination.tryCreatingOne")] }) }))] })] })) : (jsxs(Fragment, { children: [jsx("div", { className: "overflow-x-auto max-h-screen w-screen sm:w-[calc(100vw-var(--sidebar-width))]", children: displayAs === "grid" && renderGridItem ? (jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4 m-4 2xl:grid-cols-4", children: pagination.data.map((d) => renderGridItem(d)) })) : (jsxs("table", { className: `${styles$3.table} pt-28 pb-16 table table-xs sm:table-sm md:table-md table-pin-rows table-pin-cols`, children: [caption && jsx("caption", { children: caption }), jsx("thead", { children: jsxs("tr", { className: "top-28", children: [bulkActions && (jsx("th", { children: jsx(IndeterminateCheckbox, { className: "checkbox checkbox-xs", onChange: (e) => {
                                                                setSelected(e.target.checked ? pagination.data.map((model) => model.id) : []);
                                                            }, indeterminate: selected.length > 0 && selected.length < pagination.data.length, checked: pagination.data.every((model) => selected.includes(model.id)) }) })), paginationConfigs[configName].map((item, i) => {
                                                        const column = columns.find((c) => isActionColumn(c) ? "action" === item.name : c.name === item.name);
                                                        if (!column || !item.enabled) {
                                                            return null;
                                                        }
                                                        if (isActionColumn(column)) {
                                                            return (jsx("th", { className: `${styles$3.thead} w-12 max-w-24 text-xs`, children: "\u00A0" }, `actions-${i}`));
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
                                                            return (jsx(Component, { className: `${styles$3.thead} text-xs`, children: jsxs(Link, { prefetch: false, "data-testid": `sort-table-${column.name.toString()}-${sortOrder === "DESC" ? "asc" : "desc"}`, ...(sortBy === column.name ? { className: "text-primary" } : {}), href: setPartialParams({
                                                                        page: "1",
                                                                        sortBy: `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}`,
                                                                    }, searchParams), children: [column.title, sortOrder === "DESC" ? jsx(ChevronDownIcon, { ...args }) : jsx(ChevronUpIcon, { ...args })] }) }, column.name.toString()));
                                                        }
                                                        return (jsx(Component, { className: `${styles$3.thead} text-xs`, children: column.title }, column.title.toString()));
                                                    })] }) }), jsx("tbody", { children: pagination.data.map((model, o) => (jsxs("tr", { "data-testid": `table-row-${o}`, onClick: rowClickHref
                                                    ? (event) => {
                                                        const target = event.nativeEvent.target;
                                                        if (target.closest("a") || target.closest("button") || target.closest("input")) {
                                                            return;
                                                        }
                                                        const url = addLocale(rowClickHref(model), params.locale);
                                                        if (event.ctrlKey || event.metaKey || event.button === 1) {
                                                            window.open(url, "_blank");
                                                        }
                                                        else {
                                                            router.push(url);
                                                        }
                                                    }
                                                    : undefined, className: cx({
                                                    [styles$3.selectedRow]: selected.includes(model.id),
                                                    "cursor-pointer relative": rowClickHref,
                                                }), children: [bulkActions && (jsx("th", { children: jsx("input", { type: "checkbox", className: "checkbox checkbox-xs", onChange: (e) => {
                                                                if (e.target.checked) {
                                                                    setSelected((prev) => [...prev, model.id]);
                                                                }
                                                                else {
                                                                    setSelected((prev) => prev.filter((id) => id !== model.id));
                                                                }
                                                            }, checked: selected.includes(model.id) }) })), paginationConfigs[configName].map((item, i) => {
                                                        const column = columns.find((c) => isActionColumn(c) ? "action" === item.name : c.name === item.name);
                                                        if (!column || !item.enabled) {
                                                            return null;
                                                        }
                                                        if (isActionColumn(column)) {
                                                            return (jsx("th", { className: column.className || "whitespace-nowrap text-right", children: jsx(MoreActions, { actions: column.actions(model) }) }, `actions-td-${i}`));
                                                        }
                                                        const Component = column.pin ? "th" : "td";
                                                        if (isFunctionColumn(column)) {
                                                            return (jsx(Component, { className: column.className, children: column.body(model) }, `actions-td-${i}`));
                                                        }
                                                        if (column.type === "date") {
                                                            return (jsx(Component, { className: column.className ?? "text-nowrap", children: model[column.name] &&
                                                                    (column.format ? (jsx(DateTime, { date: model[column.name], format: column.format })) : (jsx(HumanDate, { date: model[column.name] }))) }, `${model.id}-${column.name.toString()}`));
                                                        }
                                                        const translatedValue = column.translate
                                                            ? t(`${column.translate}.${model[column.name]}`)
                                                            : model[column.name];
                                                        if (column.type === "code") {
                                                            return (jsx(Component, { className: column.className, children: model[column.name] && (jsx("div", { className: "badge badge-sm", children: jsx("code", { children: translatedValue }) })) }, column.name.toString()));
                                                        }
                                                        return (jsx(Component, { className: column.className, children: column.truncate ? (jsx(TruncateText, { text: translatedValue, length: column.truncate })) : (translatedValue) }, column.name.toString()));
                                                    })] }, o))) })] })) }), jsx("div", { className: "absolute box-content left-0 bottom-0 w-full h-16 z-1 border-t border-t-base-content/5", children: jsx("div", { className: "bg-base-100", children: jsxs("div", { className: "flex justify-center items-center", children: [jsx("div", { className: `shrink-1 w-60 text-xs pl-4 ${pagination.meta.totalPages > 1 ? "hidden md:block" : ""}`, children: t("pagination.showing", {
                                                    from: (pagination.meta.currentPage - 1) * pagination.meta.itemsPerPage + 1,
                                                    to: Math.min(pagination.meta.currentPage * pagination.meta.itemsPerPage, pagination.meta.totalItems),
                                                    total: pagination.meta.totalItems,
                                                }) }), jsx("div", { className: "grow text-center h-16", children: pagination.meta.totalPages > 1 && jsx(Pagination, { visiblePages: 5, page: pagination.meta }) }), pagination.meta.totalPages > 1 && (jsxs("div", { className: "shrink-1 w-60 hidden md:block text-xs text-right pr-4", children: [jsx("span", { className: "text-gray-400", children: t("pagination.itemsPerPage") }), " ", limits.map((l) => (jsx(LimitLink, { isActive: pagination.meta.itemsPerPage === l, text: l.toString(), href: setPartialParams({ page: "1", limit: `${l}` }, searchParams) }, l)))] }))] }) }) })] }))] })] }));
};
const LimitLink = ({ href, text, isActive }) => {
    return (jsx(Link, { prefetch: false, className: `text-gray-400 hover:text-primary-600 mr-1 ${isActive ? "font-bold text-primary-600" : ""}`, href: href, children: text }));
};
const TableLink = ({ href, children, className, isLink = true, ...rest }) => {
    if (!isLink) {
        return children;
    }
    return (jsxs(Link, { href: addLocale(href, useParams().locale), ...rest, prefetch: false, className: cx(styles$3.link, className, "text-primary"), children: [children, " "] }));
};
const FilterLink = ({ children, className, params, }) => {
    const t = useTranslations();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isFiltering, setIsFiltering] = useState(!Object.entries(params).every(([key, value]) => searchParams.get(key) === value.toString()));
    useEffect(() => {
        setIsFiltering(!Object.entries(params).every(([key, value]) => searchParams.get(key) === value.toString()));
    }, [searchParams, setIsFiltering, params]);
    const p = params;
    if (!isFiltering) {
        Object.keys(params).forEach((key) => {
            p[key] = "";
        });
    }
    const text = children?.split(" ") ?? [];
    const firstWords = text.slice(0, text.length - 1).join(" ");
    const lastWords = text[text.length - 1];
    return (jsx(TableLink, { "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": isFiltering ? t("general.filter") : t("general.clearFilter"), href: `${pathname}${setPartialParams(p, searchParams)}`, children: jsxs("div", { className: "text-wrap text-base-content", children: [firstWords, " ", jsxs("span", { className: "inline-flex items-center gap-1 whitespace-nowrap", children: [lastWords, " ", isFiltering ? (jsx(FunnelIcon, { className: cx(className, "inline size-5 text-primary") })) : (jsx(FunnelIcon$1, { className: cx(className, "inline size-5 text-primary") }))] })] }) }));
};
const TruncateText = ({ text, length }) => {
    return (jsx("div", { "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": text, className: "text-left text-ellipsis overflow-hidden", style: { width: length }, children: text }));
};

const TOOLTIP_PARALLEL_ID = "parallel-tooltip";
const ParallelDialog = ({ dialogButtons, title, children, onClosed, className, returnDefault, ...rest }) => {
    const router = useRouter$1();
    const closeModal = () => {
        onClosed?.();
        if (history.length > 2) {
            router.back();
            return;
        }
        if (returnDefault) {
            router.replace(addLocale(returnDefault));
        }
    };
    return (jsxs("dialog", { "data-testid": "modal-dialog", open: true, className: "modal modal-bottom modal-middle overflow-y-auto z-1100", ...rest, children: [jsxs("div", { className: cx("modal-box max-h-none overflow-y-visible rounded-field p-4 my-4 relative", className), onKeyDown: (e) => e.key === "Escape" && closeModal(), children: [jsx(Tooltip, { id: TOOLTIP_PARALLEL_ID, place: "top" }), title ? (jsxs("div", { className: "flex gap-2 mb-4", children: [jsx("h3", { className: "grow shrink truncate font-bold text-lg mt-0.5", tabIndex: -1, children: title }), dialogButtons, jsx("button", { type: "button", className: "btn btn-circle btn-sm", onClick: closeModal, children: jsx(XMarkIcon, { className: "size-4" }) })] })) : (jsxs("div", { className: "absolute right-4 top-4 flex gap-2 z-1101", children: [dialogButtons, jsx("a", { href: "#", className: "btn btn-circle btn-sm", onClick: closeModal, children: jsx(XMarkIcon, { className: "size-4" }) })] })), children] }), jsx("form", { method: "dialog", onSubmit: (e) => {
                    e.preventDefault();
                    closeModal();
                }, className: "modal-backdrop", children: jsx("button", { children: "close" }) })] }));
};

const Error$1 = ({ key, error, translationId }) => {
    const t = useTranslations();
    return (jsxs("span", { children: [translationId && t.has(`${translationId}.${key}`) && `${t(`${translationId}.${key}`)}: `, error] }));
};
function FormatErrors({ errors, translationId }) {
    const entries = Object.entries(errors);
    if (entries.length === 1 && entries[0][1].length === 1) {
        return jsx(Error$1, { error: entries[0][1][0], translationId: translationId }, entries[0][0]);
    }
    return (jsx("ul", { children: entries
            .map(([key, value]) => value.map((error, i) => (jsx("li", { children: jsx(Error$1, { error: error, translationId: translationId }, key) }, `${key}-${error}-${i}`))))
            .flat() }));
}
const Archive = ({ title, yes, no, message, archive, onClose, formatErrors, translateId, dialogButtons, onSuccess, children, }) => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter$1();
    const t = useTranslations();
    const [errors, setErrors] = useState(null);
    const doArchive = () => {
        setIsLoading(true);
        const promise = new Promise((resolve, reject) => {
            archive()
                .then((response) => {
                if (isServerError(response)) {
                    setErrors(response);
                    reject(response);
                    return;
                }
                resolve(true);
                onSuccess?.();
                if (onClose) {
                    onClose();
                }
                else {
                    router.back();
                }
            })
                .catch((e) => {
                captureException(e);
                reject(undefined);
                throw e;
            })
                .finally(() => setIsLoading(false));
        });
        void toast.promise(promise, {
            loading: t("general.deleting"),
            success: t("general.deleted"),
            error: (response) => {
                if (response) {
                    return jsx(GeneralErrorsInToast, { errors: response.errors, translateId: translateId, className: "text-gray-500" });
                }
                return t("general.error");
            },
        });
    };
    return (jsxs(ParallelDialog, { dialogButtons: dialogButtons, onClosed: onClose, title: title, children: [jsx(Hotkeys, { id: "archive", hotKeys: [{ key: "Enter", description: t("archive.yes"), callback: doArchive }] }), errors && (jsx("div", { className: "alert alert-error mb-4", children: formatErrors ? formatErrors(errors) : jsx(FormatErrors, { translationId: translateId, errors: errors.errors }) })), message ?? t("archive.message"), jsx("br", {}), jsx("br", {}), children, jsx("div", { className: "w-full text-center", children: jsxs("div", { className: "mx-auto", children: [jsx("button", { onClick: doArchive, className: "btn btn-error uppercase", disabled: isLoading, "data-testid": "button-archive", children: yes ?? t("archive.yes") }), " ", jsx("button", { className: "btn uppercase", onClick: () => (onClose ? onClose() : router.back()), "data-testid": "button-cancel", children: no ?? t("archive.no") })] }) })] }));
};
const ArchiveButtonWithDialog = ({ title, archive, children, formatErrors, onSuccess, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    return (jsxs(Fragment, { children: [isOpen &&
                createPortal(jsx(Archive, { onSuccess: onSuccess, title: title, archive: async () => {
                        setIsLoading(true);
                        try {
                            return await archive();
                        }
                        finally {
                            setIsLoading(false);
                        }
                    }, onClose: () => setIsOpen(false), formatErrors: formatErrors }), document.body), children(() => setIsOpen(!isOpen), isLoading)] }));
};

var styles = {"sidebar":"Tooltip-module_sidebar__4Rs5S"};

const TOOLTIP_SIDEBAR_ID = "sidebar";
const Item = ({ item, active, children, disableTooltip, forceHover, expanded, }) => (jsx("li", { children: jsxs(Link, { href: item.href || "/", prefetch: false, onClick: item.onClick
            ? (e) => {
                e.preventDefault();
                item.onClick();
            }
            : undefined, "data-tooltip-id": expanded ? undefined : TOOLTIP_SIDEBAR_ID, "data-tooltip-content": expanded ? undefined : disableTooltip ? undefined : item.name, "aria-description": disableTooltip ? undefined : item.name, className: cx("hover:bg-white/10 text-white/80 hover:text-white", {
            "bg-white/20": active,
            "justify-center items-center": !expanded,
            "bg-white/10 text-white": forceHover,
        }), children: [jsx(item.icon, { className: cx("mx-auto", { "size-5": expanded, "size-7": !expanded }) }), expanded && item.name, children] }) }));
const SidebarMenu = ({ menu, active, expanded, }) => (jsx("ul", { className: cx("menu w-full"), children: menu.map((item, i) => {
        if (item.items && !expanded) {
            return (jsx(Popover, { backgroundColor: "bg-nav-popover/95", placement: "right-start", arrowSize: { width: 10, height: 5 }, title: (ref, props, isOpen) => (jsx("div", { ref: ref, children: jsx(Item, { disableTooltip: true, item: item, active: active(item) || (Array.isArray(item.items) && item.items.some((i) => active(i))), forceHover: isOpen }) })), children: (close) => (jsx("div", { "data-theme": "dim", className: "bg-transparent", children: Array.isArray(item.items) ? (jsx("ul", { className: "menu p-1", children: item.items?.map((sub, i) => (jsx("li", { children: jsxs(Link, { href: sub.href, onClick: close, className: "text-white", children: [jsx(sub.icon, { className: "size-5" }), sub.name] }) }, i))) })) : (item.items()) })) }, `${item.name}-${i}`));
        }
        if (expanded && Array.isArray(item.items)) {
            const isActive = item.items.some((s) => active(s));
            return (jsx("li", { children: jsxs("details", { className: cx({ "rounded-box bg-gradient-to-b from-white/20 to-white/5": isActive }), open: isActive, children: [jsxs("summary", { className: "hover:bg-white/10 text-white/80 hover:text-white", children: [jsx(item.icon, { className: "mx-auto size-5" }), item.name] }), jsx("ul", { children: item.items.map((sub, i) => (jsx(Item, { expanded: expanded, item: sub, active: active(sub) }, `${i}-${sub.name}`))) })] }) }, `${item.name}-${i}`));
        }
        return jsx(Item, { expanded: expanded, item: item, active: active(item) }, `${item.name}-${i}`);
    }) }));
const SidebarLayout = ({ sidebarExpanded, onExpandChanged, sideChildren, children, menuIcon, icon, className, }) => {
    const [showSidebar, setShowSidebar] = useState(false);
    const screenSize = useScreenSize();
    const [expanded, setMenuExpanded] = React__default.useState(sidebarExpanded ?? false);
    const menuExpanded = expanded || (screenSize === ScreenSize.xs && showSidebar);
    return (jsxs("div", { className: cx("flex flex-row h-full [--sidebar-width:0rem]", className, {
            "sidebar-expanded sm:[--sidebar-width:15rem]": menuExpanded,
            "sm:[--sidebar-width:6rem]": !menuExpanded,
        }), children: [showSidebar && (jsx("div", { className: "sm:hidden absolute left-0 top-0 bg-black/50 w-full h-full", style: { zIndex: 1000 }, onClick: () => setShowSidebar(!expanded) })), jsxs("div", { className: "sm:hidden absolute h-16 flex items-center", style: { zIndex: 1000 }, children: [jsx("span", { onChange: () => setShowSidebar(!showSidebar), children: icon }), jsxs("label", { className: "px-2 sm:hidden text-black ml-2 mr-2 swap swap-rotate", children: [jsx("input", { type: "checkbox", checked: showSidebar, onChange: () => setShowSidebar(!showSidebar) }), jsx("svg", { className: "swap-off fill-current", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 512 512", children: jsx("path", { d: "M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" }) }), jsx("svg", { className: "swap-on fill-current", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 512 512", children: jsx("polygon", { points: "400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" }) })] })] }), jsxs("div", { style: { zIndex: 1001 }, className: cx("print:hidden fixed sm:static left-0 top-0 h-full sm:inline-flex transition-[translate] duration-500 ease-in-out", { "-translate-x-60 sm:translate-x-0": !showSidebar }), children: [jsx("div", { className: cx("relative z-50 shrink-0 column-1 py-2 pl-2 h-full justify-center transition-[width] duration-500 ease-in-out overflow-hidden", { "w-60": menuExpanded, "w-24": !menuExpanded }), children: jsxs("div", { className: "rounded-box flex flex-col h-full overflow-auto pt-14 bg-navigation group", children: [jsx("div", { className: "absolute w-full h-18 left-0 top-2 z-1000", children: jsx("div", { className: "rounded-box h-18 ml-2 pl-4 pt-5 bg-gradient-to-b from-[50%] from-navigation to-transparent", children: menuIcon(menuExpanded) }) }), jsx("button", { onClick: () => {
                                        setMenuExpanded(!menuExpanded);
                                        onExpandChanged(!menuExpanded);
                                    }, className: cx("hidden sm:flex absolute top-8 right-0 z-1001 justify-center btn btn-xs btn-circle border-white/40 hover:border-white text-white/70 hover:text-white bg-navigation transition-[translate,opacity] duration-200 ease-in-out group-hover:opacity-100", { "-translate-x-4": expanded, "opacity-0 right-0": !expanded }), children: menuExpanded ? (jsx(ChevronDoubleLeftIcon, { className: "size-4" })) : (jsx(ChevronDoubleRightIcon, { className: "size-4" })) }), sideChildren(menuExpanded)] }) }), jsx(Tooltip, { id: TOOLTIP_SIDEBAR_ID, place: "right", className: styles.sidebar })] }), jsx("div", { className: "grow shirk", children: children })] }));
};

export { Archive, ArchiveButtonWithDialog, BulkActions, BulkDropDownActions, CheckboxFormField, ConfirmSave, DateFormField, DateInput, DateTime, DateTimeFormField, DateTimePicker, FilterLink, GeneralErrors, GeneralErrorsInToast, HeaderResponsive, HeaderResponsivePaginated, HumanDate, IndeterminateCheckbox, InputErrors, Label, LoadingComponent, LocalStorage, MoreActions, NumberFormField, PaginatedTable, Pagination, ParallelDialog, Popover, PortalSSR, RadioBoxFormField, Required, SaveButton, ScreenSize, Select, SelectFormField, SelectFromApi, SelectFromApiField, SelectFromApiFormField, SelectOption, SelectPaginatedFromApi, SelectPaginatedFromApiField, SelectPaginatedFromApiFormField, SidebarLayout, SidebarMenu, TOOLTIP_GLOBAL_ID, TOOLTIP_PARALLEL_ID, TOOLTIP_SIDEBAR_ID, TableLink, TextFormField, TextareaFormField, TimeFormField, TimePicker, Title, Toaster, addServerErrors, getNextPageParam, getPreviousPageParam, isActionColumn, isFunctionColumn, isParamActive, isServerError, mapToDot, setPartialParams, useFormSubmit, useScreenSize };
//# sourceMappingURL=index.js.map
