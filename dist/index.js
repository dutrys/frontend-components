'use client';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import React__default, { useState, useRef, useEffect, useMemo, createContext, useContext, Fragment as Fragment$1, useCallback } from 'react';
import { useFloating, offset, flip, arrow, autoUpdate, useFocus, useHover, safePolygon, useClick, useDismiss, useInteractions, FloatingPortal, FloatingArrow } from '@floating-ui/react';
import cx from 'classnames';
import LinkNext from 'next/link';
import { useParams, useSearchParams, useRouter as useRouter$1, usePathname } from 'next/navigation';
import { ExclamationTriangleIcon, CheckCircleIcon, ExclamationCircleIcon, PencilIcon, EyeIcon, TrashIcon, ChevronDownIcon, EllipsisHorizontalIcon, CheckIcon, Cog6ToothIcon, AdjustmentsHorizontalIcon, XMarkIcon, ClockIcon, CalendarIcon, PlusIcon, ChevronUpIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { EllipsisVerticalIcon, ArrowsUpDownIcon } from '@heroicons/react/16/solid';
import { useRouter } from 'next-nprogress-bar';
import toast, { useToasterStore, Toaster as Toaster$1, resolveValue } from 'react-hot-toast';
import { Tooltip } from 'react-tooltip';
import { FunnelIcon as FunnelIcon$1 } from '@heroicons/react/24/solid';
import { Reorder, useMotionValue, useDragControls, animate, motion } from 'framer-motion';
import { captureException } from '@sentry/nextjs';
import { useForm, Controller } from 'react-hook-form';
import { createPortal } from 'react-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { format, isSameDay, isSameHour, parse, isValid, parseJSON, differenceInSeconds, formatDistance, differenceInMinutes, differenceInDays } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { lt, enGB } from 'react-day-picker/locale';
import { Combobox, ComboboxInput, ComboboxButton, Transition, ComboboxOptions, ComboboxOption } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon as CheckIcon$1 } from '@heroicons/react/20/solid';
import { useInView } from 'react-intersection-observer';
import 'date-fns-tz';
import { NumericFormat } from 'react-number-format';
import { lt as lt$1 } from 'date-fns/locale';
import FocusLock from 'react-focus-lock';

const LoadingComponent = ({ style, className, loadingClassName, size, }) => (jsx("div", { className: `flex justify-center ${className}`, style: style, children: jsx("span", { className: `${loadingClassName || "text-primary"} loading loading-spinner ${size}` }) }));

const Popover = ({ title, children, popoverClassName = "py-1", onShow, open: openProp, hoverClassName, showOnHover = true, showOnClick = false, showOnFocus = false, popoverWidth, backgroundColor = "bg-slate-800", borderColor = "border-slate-600", disabled, }) => {
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
    const dismiss = useDismiss(context, { escapeKey: false, bubbles: true, outsidePress: true });
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, click, focus]);
    if (disabled) {
        return title(null, {});
    }
    const p = getReferenceProps();
    if (isOpen && hoverClassName) {
        p.className = typeof p.className === "string" ? `${p.className} ${hoverClassName}` : hoverClassName;
    }
    return (jsxs(Fragment, { children: [title(refs.setReference, p), isOpen && (jsx(FloatingPortal, { children: jsxs("div", { ref: refs.setFloating, style: { ...floatingStyles, zIndex: 1100 }, ...getFloatingProps(), className: cx("border rounded-sm shadow-lg shadow-base-100 border-1", popoverClassName, backgroundColor, borderColor), children: [jsx(FloatingArrow, { strokeWidth: 1, fill: `var(--color-${backgroundColor.replace("bg-", "")})`, stroke: `var(--color-${borderColor.replace("border-", "")})`, context: context, ref: arrowRef }), jsx("div", { className: popoverWidth, children: children(() => context.onOpenChange(false)) })] }) }))] }));
};

const Link = (props) => {
    const params = useParams();
    return (jsx(LinkNext, { ...props, href: props.href === "string" ? addLocale(props.href, params.locale) : props.href }));
};
const addLocale = (link, locale) => {
    if (typeof link === "string" && !/^\/(lt|en)\//.test(link) && link.startsWith("/")) {
        return `/${locale || "lt"}${link}`;
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
            else if (window.innerWidth >= 1280 && window.innerWidth < 1536) {
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

const EditButton = ({ href, size }) => {
    const t = useTranslations("actionButtons");
    return jsx(ActionButton, { href: href, icon: PencilIcon, tooltip: t("edit"), "data-testid": "button-edit", size: size });
};
const ViewButton = ({ href, size }) => {
    const t = useTranslations("actionButtons");
    return jsx(ActionButton, { href: href, icon: EyeIcon, tooltip: t("view"), "data-testid": "button-view", size: size });
};
const MoreActions = ({ actions }) => {
    const screenSize = useScreenSize();
    if (actions.filter((a) => !a.hidden).length === 0) {
        return null;
    }
    const enable = screenSize > ScreenSize.xs;
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
    return (jsxs(Fragment, { children: [buttonActions.map((a) => (jsx(Action, { enable: true, action: a, close: () => { } }, a.label))), menuActions.length > 0 && (jsx(Popover, { showOnClick: true, title: (ref, props) => (jsx("button", { className: "btn btn-xs md:btn-xs btn-ghost", ref: ref, ...props, children: jsx(EllipsisVerticalIcon, { className: "size-4" }) })), children: (close) => (jsx("div", { "data-theme": "dim", style: { background: "transparent" }, children: jsx("ul", { className: "menu menu-sm px-1 p-0", children: menuActions.map((a, i) => (jsx("li", { className: a.disabled ? "menu-disabled" : undefined, children: jsx(Action, { action: a, close: close }) }, i))) }) })) }))] }));
};
const Action = ({ action: a, close, enable }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const Icon = isLoading ? LoadingComponent : a.icon;
    if (!a.onClick) {
        if (!a.href) {
            throw new Error("href or onClick is required");
        }
        if (enable) {
            return (jsx(Link, { className: `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}`, href: addLocale(a.href), onClick: () => !a.disabled && close(), "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": a.label, children: Icon ? jsx(Icon, { className: "size-4" }) : a.label }));
        }
        return (jsxs(Link, { className: "", href: addLocale(a.href), onClick: () => close(), children: [Icon && jsx(Icon, { className: "size-4" }), a.label] }));
    }
    return (jsxs("a", { className: enable ? `btn btn-xs md:btn-xs btn-ghost ${a.disabled ? "btn-disabled" : ""}` : undefined, onClick: (e) => {
            e.preventDefault();
            if (a.disabled) {
                return;
            }
            setIsLoading(true);
            a.onClick()
                .then((result) => {
                if (typeof result === "string") {
                    router.push(addLocale(result));
                }
                close();
            })
                .finally(() => setIsLoading(false));
        }, children: [Icon && jsx(Icon, { className: "size-4" }), !enable && a.label] }));
};
const ArchiveButton = (props) => {
    const t = useTranslations("actionButtons");
    return (jsx(ActionButton, { ...props, icon: TrashIcon, "data-testid": "button-archive", tooltip: t("archive"), size: props.size }));
};
const ActionButton = ({ tooltipId = TOOLTIP_GLOBAL_ID, icon, tooltip, className, size, ...props }) => {
    const params = useParams();
    const Icon = icon;
    const L = props.href ? Link : "button";
    if (props.href) {
        props.href = addLocale(props.href, params.locale);
        props.prefetch = props.prefetch ?? false;
    }
    return (
    // @ts-expect-error TS2322
    jsx(L, { ...props, "data-tooltip-id": tooltipId, "data-tooltip-place": "top", "data-tooltip-content": tooltip, className: cx("btn uppercase btn-ghost", className, {
            "btn-xs": size === "xs",
            "btn-sm": size === "sm",
            "btn-lg": size === "lg",
            "btn-xl": size === "xl",
            "btn-xs md:btn-sm": !size,
        }), children: jsx(Icon, { className: "inline", width: 16 }) }));
};

var styles$3 = {"menu":"BulkActions-module_menu__m9kWg"};

const BulkActions = ({ bulkActions, disabled, }) => {
    const t = useTranslations();
    if (disabled) {
        return (jsxs("button", { disabled: true, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] }));
    }
    return (jsx(Popover, { disabled: disabled, showOnClick: true, backgroundColor: "bg-primary", borderColor: "border-primary", title: (ref, props) => (jsxs("button", { disabled: disabled, ref: ref, ...props, className: "btn btn-xs btn-primary uppercase", children: [t("pagination.bulkActions"), " ", jsx(ChevronDownIcon, { className: "size-4" })] })), children: (close) => {
            return (jsx("ul", { className: `menu px-1 py-0 ${styles$3.menu}`, children: jsx(BulkDropDownActions, { bulkActions: bulkActions.map((b) => ({
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
    return (jsxs(Fragment, { children: [jsx("div", { className: "overflow-hidden grow", style: { overflow: "hidden" }, ref: cont, children: jsx("div", { ref: bar, className: "flex overflow-hidden", children: jsx("div", { className: `${heightClassName || ""} w-full`, children: jsx("ul", { className: `flex flex-nowrap shrink justify-end flex-row ${heightClassName || ""} items-center`, children: elements.map((elementCollection, i) => (jsx("li", { className: `item pr-2 shrink-0 flex-nowrap flex flex-row ${i >= showItems ? "hidden" : ""}`, children: renderVisible(elementCollection, i) }, i))) }) }) }) }), showItems < elements.length && (jsx("div", { style: { width: MORE_WIDTH }, className: "pr-2", children: jsx(Popover, { showOnClick: true, borderColor: "border-base-300", backgroundColor: "bg-base-200", title: (ref, props) => (jsx("a", { tabIndex: 0, ref: ref, ...props, role: "button", className: "btn btn-xs w-full", children: jsx(EllipsisHorizontalIcon, { className: "h-3 w-3" }) })), children: (closeFn) => (jsx("div", { className: "max-h-96 overflow-y-auto", children: jsx("ul", { tabIndex: 0, className: "menu px-1 py-0", children: [...elements].splice(showItems).map((e, i) => renderDropdown(e, i, closeFn)) }) })) }) }))] }));
};

const getPreviousPageParam = (page) => !page?.meta || page?.meta?.currentPage === 1 ? undefined : page.meta.currentPage - 1;
const getNextPageParam = (page) => !page?.meta || page?.meta?.currentPage >= page.meta?.totalPages ? undefined : page.meta.currentPage + 1;
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

var styles$2 = {"table":"PaginatedTable-module_table__efs0Y","selectedRow":"PaginatedTable-module_selectedRow__Xi-QH","thead":"PaginatedTable-module_thead__Jb-pD"};

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
            return (jsxs(React__default.Fragment, { children: [i !== 0 && jsx("li", { className: "disabled" }), shortcuts.map(({ link, text }) => {
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
                        return (jsx("li", { children: jsx(Link, { prefetch: false, className: active ? "bg-base-300/50 font-bold hover:bg-base-300" : "", href: params === "" ? "?" : params, children: text }) }, text));
                    })] }, i));
        }, renderVisible: (element, i) => {
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
                        return (jsxs(Fragment, { children: [t("general.validateError"), ":", " ", jsx(GeneralErrors, { className: "text-gray-500", translateId: options.translateErrors, errors: formProps.formState.errors })] }));
                    }
                    return t("general.error");
                },
            }, { id: "form-submit" });
        }
        return promise;
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
const PaginationConfiguration = ({ name, configName, columns, setConfigName, store, configs: configsFromRemote, refresh, }) => {
    const [show, setShow] = useState();
    const t = useTranslations();
    const [isLoading, setLoading] = useState(false);
    const cc = useMemo(() => {
        if (!configsFromRemote) {
            return undefined;
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
    return (jsxs(Fragment, { children: [jsx(Popover, { showOnClick: true, hoverClassName: "bg-slate-600", title: (ref, p) => (jsx("button", { ref: ref, ...p, className: `btn btn-neutral btn-xs ${p.className ? p.className : undefined}`, children: jsx(AdjustmentsHorizontalIcon, { className: "size-4" }) })), children: (close) => configs ? (jsxs("ul", { className: "p-1 menu menu-sm", "data-theme": "dim", children: [Object.keys(configs).map((configName) => (jsx("li", { children: jsxs("button", { onClick: (e) => {
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
                                                        return (jsxs("div", { tabIndex: 0, className: `collapse bg-base-200 border-base-300 border ${open === configName ? "collapse-open" : "collapse-close"}`, children: [jsx("div", { className: "collapse-title font-semibold cursor-pointer", onClick: () => setOpen(configName === open ? null : configName), children: t("pagination.configuration.defaultTitle") }), jsx("div", { className: "collapse-content text-sm space-y-2", children: value.map((item, index) => (jsx("div", { className: "flex justify-between items-center p-2 bg-base-100 rounded-xl border border-border shadow-sm grow-0", children: jsxs("label", { children: [jsx("input", { disabled: true, type: "checkbox", checked: true, className: "checkbox checkbox-xs mr-2" }), isActionColumn(item.column)
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
                                                                enabled: true,
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
    async getConfig(title, columns) {
        const configName = title ? await this.getConfigName(title) : undefined;
        if (!configName) {
            return columns.map((c) => ({ name: isActionColumn(c) ? "action" : c.name, enabled: true }));
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
            default: columns.map((c) => ({ name: isActionColumn(c) ? "action" : c.name, enabled: true })),
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

var styles$1 = {"dayPicker":"DatePicker-module_dayPicker__VRSSY"};

function DateTimePicker({ value, onChange, allowEmpty, disabled, required, from, to, placeholder, inputClassName = "input input-bordered", toggleClassName = "", ...rest }) {
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
    return (jsxs("label", { className: `w-full ${inputClassName}`, children: [jsx(Popover, { title: (ref, popoverProps) => (jsx("input", { required: required, ...rest, value: dateString, className: "grow", disabled: disabled, ref: ref, placeholder: placeholder, onChange: (e) => {
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
                }, showOnClick: true, showOnFocus: true, showOnHover: false, popoverWidth: "", children: (close) => (jsxs(Fragment, { children: [jsxs("div", { className: "flex", children: [jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$1.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, weekStartsOn: 1, disabled: matcher, selected: valueTemp || undefined, defaultMonth: valueTemp || undefined, onSelect: (day) => {
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
                                }, children: t("datePicker.ok") }) })] })) }), allowEmpty ? (jsx("button", { disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? jsx(XMarkIcon, { className: "size-4" }) : jsx(ClockIcon, { className: "size-4" }) })) : (jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: jsx(ClockIcon, { className: "size-4" }) }))] }));
}

const formatDate = (date) => {
    if (!date) {
        return "";
    }
    return format(date, "yyyy-MM-dd");
};
const DatePicker = ({ onChange, value, inputClassName = "input input-bordered", toggleClassName = "", required, allowEmpty, disabled, placeholder, from, to, ...props }) => {
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
    return (jsxs("div", { className: `w-full ${inputClassName}`, children: [jsx(Popover, { showOnClick: false, showOnFocus: true, showOnHover: false, popoverWidth: "", title: (ref, popoverProps) => (jsx("input", { ref: ref, ...props, ...popoverProps, value: dateString, className: "grow", required: required, disabled: disabled, placeholder: placeholder, onChange: (e) => {
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
                    }, onBlur: () => {
                        const date = parse(dateString, "yyyy-MM-dd", new Date());
                        if (isValid(date)) {
                            onChange(date);
                        }
                    } })), children: (close) => (jsx(DayPicker, { className: `react-day-picker bg-transparent border-none text-white ${styles$1.dayPicker}`, captionLayout: "dropdown", mode: "single", locale: params.locale === "lt" ? lt : enGB, showOutsideDays: true, disabled: matcher, weekStartsOn: 1, selected: value || undefined, defaultMonth: value || undefined, onSelect: (day) => {
                        onChange(day || null);
                        close();
                    } })) }), allowEmpty ? (jsx("button", { type: "button", disabled: allowEmpty && !value, className: toggleClassName, onClick: () => onChange(null), children: value ? jsx(XMarkIcon, { className: "size-4" }) : jsx(ClockIcon, { className: "size-4" }) })) : (jsx("div", { className: `cursor-pointer ${toggleClassName}`, children: jsx(CalendarIcon, { className: "size-4" }) }))] }));
};

const SEARCH_FROM_QUERY_LENGTH = 3;
const SelectPaginatedFromApi = ({ onChange, disabled, required, inputRef, name, value, size, className, queryKey, queryFn, placeholder, optionsClassName, empty, valueFormat = (model) => model.name, inputClassName = "w-full mx-0 input input-bordered", ...rest }) => {
    const [query, setQuery] = useState("");
    const { isLoading, data, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        getPreviousPageParam,
        getNextPageParam,
        enabled: !disabled,
        queryKey: [...queryKey, disabled, query.length < SEARCH_FROM_QUERY_LENGTH ? "" : query],
        initialPageParam: 1,
        queryFn: ({ queryKey, pageParam }) => {
            if (disabled) {
                return Promise.reject();
            }
            const page = typeof pageParam === "number" ? pageParam : undefined;
            const search = queryKey[queryKey.length - 1] || "";
            if (typeof search !== "string" || search === "" || search.length < SEARCH_FROM_QUERY_LENGTH) {
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
    return (jsx(Combobox, { immediate: true, "data-testid": "select", disabled: disabled, value: (data?.pages || [])
            .map((d) => d?.data || [])
            .flat()
            .find((b) => b.id === value) || null, onChange: onChange, ...rest, children: jsxs("div", { className: `relative ${className}`, children: [jsxs("div", { className: "w-full relative p-0", children: [jsx(ComboboxInput, { required: required, ref: inputRef, "data-testid": "select-input", placeholder: placeholder, onFocus: (e) => e?.target?.select(), autoComplete: "off", name: name, className: cx(inputClassName, {
                                "input-sm": size === "sm",
                                "input-xs": size === "xs",
                            }), displayValue: (model) => (model ? valueFormat(model) : ""), onChange: (event) => setQuery(event.target.value) }), jsx(ComboboxButton, { "data-testid": "select-input-btn", className: "absolute z-1 cursor-pointer inset-y-0 right-0 flex items-center pr-2", onClick: (e) => {
                                e.target?.parentNode?.parentNode?.querySelector("input")?.select();
                            }, children: jsx(ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) })] }), jsx(Transition, { as: Fragment$1, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: jsxs(ComboboxOptions, { className: `absolute z-10 mt-2 max-h-96 w-full border-gray-300 border overflow-auto rounded-md bg-white py-1 text-base shadow-lg sm:text-sm ${optionsClassName || ""}`, children: [!required && data && data?.pages?.[0]?.meta?.totalItems !== 0 && (jsx(ComboboxOption, { "data-testid": "select-option-empty", className: ({ focus }) => `relative select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`, value: null, children: jsx("span", { className: cx("block truncate", { "text-xs": "xs" === size || "sm" === size }), children: empty || t("selectFromApi.select") }) }, "empty")), data?.pages?.[0]?.meta?.totalItems === 0 ? (jsx("div", { className: "relative cursor-default select-none py-2 px-4 text-gray-700", children: jsx("span", { className: cx({ "text-xs": "xs" === size || "sm" === size }), children: t("selectFromApi.nothingFound") }) })) : (data?.pages
                                ?.map((d) => d?.data || [])
                                .flat()
                                .map((model, i) => (jsx(ComboboxOption, { "data-testid": `select-option-${i}`, className: ({ focus }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${focus ? "bg-primary text-white" : "text-gray-900"}`, value: model, children: ({ selected, focus }) => (jsxs(Fragment, { children: [jsx("span", { className: cx("block truncate", {
                                                "text-white": focus,
                                                "pr-3 font-bold": selected,
                                                "font-normal": !selected,
                                                "text-xs": "xs" === size || "sm" === size,
                                            }), children: valueFormat(model) }), selected ? (jsx("span", { className: `absolute inset-y-0 right-1 flex items-center pl-3 ${focus ? "text-white" : "text-teal-600"}`, children: jsx(CheckIcon$1, { className: "h-5 w-5", "aria-hidden": "true" }) })) : null] })) }, model.id)))), isFetchingNextPage || isLoading ? (jsx(LoadingComponent, { className: "my-2" })) : (hasNextPage && (jsx("div", { className: "text-center", children: jsx("button", { ref: ref, className: "btn btn-ghost btn-xs my-1 btn-wide", onClick: () => fetchNextPage(), children: t("infiniteScroll.loadMore") }) })))] }) })] }) }));
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

const TimePicker = ({ className, value, onChange, placeholder, required, disabled, }) => {
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
                console.log("onChange", e.target.value);
                onChange({
                    target: { value: dateToTimeString(timeToDate(e.target.value, "HH:mm") || new Date(), "HH:mm:ss") },
                });
            }
            else {
                console.log("NOT onChange", e.target.value);
            }
        } }));
};

var styles = {"desc":"Input-module_desc__3D3hV"};

const TextInput = ({ required, disabled, error, className, id, type, register, label, size, options, desc, name, fieldSetClassName, ref, ...rest }) => {
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
                        }, required: required, disabled: disabled, placeholder: required ? `${label}*` : label, className: cx("input input-bordered w-full", className, {
                            "input-xs": size === "xs",
                            "input-sm": size === "sm",
                            "input-error": error,
                        }), ...rest }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const SelectInput = ({ id, disabled, fieldSetClassName, label, register, required, name, error, desc, options, size, className, children, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("select", { id: id, disabled: disabled, ...register(name, {
                            required: required,
                            disabled: disabled,
                            ...(options || {}),
                        }), className: cx("select select-bordered w-full", className, {
                            "select-xs": size === "xs",
                            "select-sm": size === "sm",
                            "select-error": error,
                        }), ...rest, children: children }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const TextareaInput = (props) => {
    const r = props.register(props.name, {
        required: props.required,
        disabled: props.disabled,
        ...(props.options || {}),
    });
    const [length, setLength] = useState(0);
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx("textarea", { id: props.id, disabled: props.disabled, ...r, className: cx("textarea textarea-bordered w-full", props.className, {
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
                        } }), props.maxLength && (jsx("div", { className: "badge badge-xs badge-ghost absolute right-1 bottom-1", children: `${length}/${props.maxLength}` })), jsxs("span", { children: [props.label, props.required ? jsx(Required, {}) : null] })] }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const RadioBox = ({ name, options, label = "", value, onChange, }) => (jsxs("div", { children: [label || "", jsx("div", { className: "flex flex-col pt-2 gap-2", children: Object.entries(options).map(([key, label]) => (jsxs("label", { children: [jsx("input", { type: "radio", checked: value === key, name: name, value: key, onChange: () => onChange(key), className: "radio radio-primary" }, key), " ", typeof label === "string" ? label : null] }, key))) })] }));
const CheckboxInput = (props) => {
    return (jsxs(Fragment, { children: [jsx("div", { className: props.fieldSetClassName, children: jsxs("label", { children: [jsx("input", { id: props.id, type: "checkbox", disabled: props.disabled, ...props.register(props.name, {
                                required: props.required,
                                disabled: props.disabled,
                                ...(props.options || {}),
                            }), className: cx("toggle", {
                                "toggle-sm": props.size === "sm",
                                "toggle-xs": props.size === "xs",
                            }) }), jsx("span", { className: "text-sm text-gray-500 label-text grow pl-2", children: props.label })] }) }), props.desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const DateInput = ({ control, useDate, allowEmpty, label, error, disabled, desc, required, size, className, fieldSetClassName, name, from, to, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { control: control, name: name, render: ({ field }) => {
                            return (jsx(DatePicker, { inputClassName: cx("input input-bordered", className, {
                                    "input-xs": size === "xs",
                                    "input-sm": size === "sm",
                                    "input-error": error,
                                }), from: from, to: to, required: required, disabled: disabled, allowEmpty: allowEmpty, placeholder: required ? `${label}*` : label, value: field.value, onChange: (value) => {
                                    if (useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd") : null);
                                    }
                                }, ...rest }));
                        } }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: `text-xs mt-0.5 text-gray-500 ${styles.desc}`, children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const SelectPaginatedFromApiInput = ({ label, queryFn, queryKey, desc, control, name, valueFormat, required, disabled, error, className, size, onChange, fieldSetClassName, ...rest }) => (jsxs("div", { className: fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [jsxs("span", { children: [label, required ? jsx(Required, {}) : null] }), jsx(Controller, { control: control, name: name, rules: { required: required === true }, render: ({ field }) => (jsx(SelectPaginatedFromApi, { inputClassName: cx("w-full mx-0 input input-bordered", className, {
                            "input-error": error,
                        }), name: name, ...rest, size: size, required: required, disabled: disabled, placeholder: required ? `${label}*` : label, queryKey: queryKey, queryFn: queryFn, value: field.value, valueFormat: valueFormat, onChange: (model) => {
                            field.onChange(model?.id || null);
                            onChange?.(model || null);
                        } })) })] }), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
const DateTimeInput = ({ label, desc, control, name, required, disabled, error, useDate, className, size, allowEmpty, from, to, fieldSetClassName, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [jsx(Controller, { control: control, name: name, render: ({ field }) => {
                            return (jsx(DateTimePicker, { inputClassName: cx("input input-bordered", className, {
                                    "input-xs": size === "xs",
                                    "input-sm": size === "sm",
                                    "input-error": error,
                                }), required: required, allowEmpty: allowEmpty, placeholder: required ? `${label}*` : label, from: from, disabled: disabled, to: to, value: field.value ? (useDate ? field.value : stringToDate(field.value)) || null : null, onChange: (value) => {
                                    if (useDate) {
                                        field.onChange(value);
                                    }
                                    else {
                                        field.onChange(value ? format(value, "yyyy-MM-dd HH:mm:ss") : null);
                                    }
                                }, ...rest }));
                        } }), jsxs("span", { children: [label, required ? jsx(Required, {}) : null] })] }), desc && (jsx("div", { className: "text-xs my-0.5 text-gray-500", children: jsx("span", { children: desc }) })), error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const TimeInput = (props) => {
    return (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("label", { className: "floating-label", children: [!props.disabled && (jsxs("span", { children: [props.label, props.required && jsx(Required, {})] })), jsx(Controller, { render: ({ field }) => (jsx(TimePicker, { value: field.value, onChange: (v) => field.onChange(v), placeholder: props.required ? `${props.label}*` : props.label, required: props.required, disabled: props.disabled, className: cx("input w-full", props.className, {
                                "input-xs": props.size === "xs",
                                "input-sm": props.size === "sm",
                                "input-error": props.error,
                            }) })), name: props.name, control: props.control })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
};
const NumberInput = ({ options, ...props }) => (jsxs("div", { className: props.fieldSetClassName, children: [jsxs("div", { className: "floating-label", children: [!props?.disabled && (jsxs("span", { children: [props.label, props?.required && jsx(Required, {})] })), jsx(Controller, { name: props.name, control: props.control, render: ({ field }) => (jsx(NumericFormat, { placeholder: props.required ? `${props.label}*` : props.label, ...options, disabled: props?.disabled, required: props?.required, value: field.value, className: cx("w-full input input-bordered focus:outline-blue-400", {
                            "input-xs": props.size === "xs",
                            "input-sm": props.size === "sm",
                            "input-error": props.error,
                        }), onValueChange: (values) => field.onChange(values.floatValue ?? null) })) })] }), props.desc && (jsx("div", { className: "text-xs text-gray-500", children: jsx("span", { children: props.desc }) })), props.error && jsx(InputErrors, { className: "text-xs text-error mt-1", errors: props.error })] }));
const Label = ({ text, required }) => (jsx("label", { className: "label", children: jsxs("span", { className: "text-sm", children: [text, required && jsx(Required, {})] }) }));
const SelectPaginatedFromApiWithLabel = ({ label, queryFn, queryKey, desc, name, valueFormat, required, disabled, error, className, size, value, onChange, fieldSetClassName, ...rest }) => {
    return (jsxs("div", { className: fieldSetClassName, children: [jsxs("div", { ...rest, className: "floating-label", children: [jsxs("span", { children: [label, required ? jsx(Required, {}) : null] }), jsx(SelectPaginatedFromApi, { inputClassName: cx("w-full mx-0 input input-bordered", className, {
                            "input-xs": size === "xs",
                            "input-sm": size === "sm",
                            "input-error": error,
                        }), size: size, required: required, disabled: disabled, placeholder: required ? `${label}*` : label, queryKey: queryKey, queryFn: queryFn, value: value, valueFormat: valueFormat, onChange: (model) => onChange?.(model || null) })] }), desc, jsx(InputErrors, { className: "text-xs text-error mt-1", errors: error })] }));
};
const Required = () => {
    return jsx("span", { className: "text-error align-bottom", children: "*" });
};
const SaveButton = ({ isLoading, text, icon, disabled, className = "btn-block", onClick, size, type = "submit", ...props }) => {
    const t = useTranslations();
    const Icon = icon || CheckIcon$1;
    return (jsxs("button", { type: type, className: `btn btn-primary ${size === "sm" ? "btn-sm" : ""} ${className}`, color: "primary", disabled: isLoading || disabled, "data-testid": type === "submit" ? "submit" : undefined, onClick: (e) => {
            if (onClick) {
                e.preventDefault();
                onClick();
            }
        }, ...props, children: [text || t("general.saveButton"), isLoading ? jsx(LoadingComponent, { className: "size-4" }) : jsx(Icon, { className: "size-4" })] }));
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

const limits = [10, 20, 50, 100];
function isActionColumn(column) {
    return typeof column === "object" && column.type === "actions";
}
function isFunctionColumn(column) {
    return typeof column === "object" && typeof column.body === "function";
}
const PaginatedTable = ({ pagination, title, sortEnum, extraHeading, columns, caption, isSearchable = false, searchableShortcuts = [], addNew, bulkActions, addNewText, displayFilters, displayConfig, }) => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const t = useTranslations();
    const [selected, setSelected] = React__default.useState([]);
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
        enabled: true,
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
    const SearchField = () => {
        const router = useRouter();
        const path = usePathname();
        const [search, setSearch] = useState(searchParams.get("search") || "");
        return (jsx("div", { className: "w-32 sm:w-52 shrink-0 grow-0", children: jsxs("form", { onSubmit: (e) => {
                    e.preventDefault();
                    router.push(addLocale((path + setPartialParams({ search, page: 1 }, searchParams)).replace(/^\/(en|lt)\//, "/"), params.locale));
                }, children: [" ", jsxs("div", { className: "join w-full pr-2", children: [jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), name: "search", className: "join-item input input-bordered input-xs outline-0 focus:ring-0 w-full focus:outline-0 focus:border-gray-500", placeholder: t("pagination.searchPlaceholder") }), jsx("button", { className: "join-item btn btn-neutral btn-xs uppercase", type: "submit", children: jsx(MagnifyingGlassIcon, { className: "w-4 h-4" }) })] })] }) }));
    };
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
    const heading = (jsx(Fragment, { children: jsxs("div", { className: "flex items-center flex-end w-full border-b border-b-base-content/5 h-12 max-w-[calc(100vw)] sm:max-w-[calc(100vw-6rem)]", children: [jsx("h1", { className: `pl-4 py-3 pr-2 font-bold mr-auto ${searchableShortcuts.length > 0 ? "" : "grow"}`, children: title }), jsx(Hotkeys, { id: "paginatedTable", hotKeys: hotKeys }), (elements.length > 0 || (bulkActions && bulkActions?.length > 0)) && (jsx(HeaderResponsivePaginated, { bulkActions: bulkActions ? { actions: bulkActions, setSelected, selected } : undefined, elements: elements })), extraHeading, addNew && (jsxs(Link, { className: "btn uppercase btn-accent gap-2 justify-end  btn-xs mr-2", href: addLocale(addNew, params.locale), "data-testid": "add-new", children: [jsx(PlusIcon, { className: "w-4 h-4" }), " ", jsx("span", { className: "hidden sm:inline", children: addNewText || t("pagination.addNew") })] })), isSearchable && jsx(SearchField, {}), displayConfig && (jsx("div", { className: "pr-2", children: jsx(PaginationConfiguration, { store: store, name: displayConfig.name, configName: configName, columns: columns, configs: paginationConfigs, setConfigName: (name) => setConfigName(name), refresh: () => void refetchPaginationConfigs() }) }))] }) }));
    if (pagination.meta.totalItems === 0) {
        return (jsxs(Fragment, { children: [heading, caption, jsxs("div", { className: "text-center mt-20", children: [jsxs("span", { className: "text-gray-400", children: [t("pagination.noItems"), " ", jsx("span", { className: "align-middle text-3xl ", children: "\uD83D\uDE3F" })] }), addNew && (searchParams.get("search") || "") === "" && (jsx("p", { className: "mt-4", children: jsxs(Link, { className: "btn uppercase btn-outline", href: addLocale(addNew, params.locale), children: [jsx(PlusIcon, { width: 20 }), " ", addNewText || t("pagination.tryCreatingOne")] }) }))] })] }));
    }
    return (jsxs("div", { "data-testid": "paginate-table", className: "relative h-full", "data-test-sort": (pagination.meta.sortBy || []).flat().join("-"), children: [heading, jsx("div", { className: "overflow-x-auto max-h-[calc(100%-7rem)] w-[calc(100vw)] sm:w-[calc(100vw-6rem)]", children: jsxs("table", { className: `${styles$2.table} table table-xs sm:table-sm md:table-md table-pin-rows table-pin-cols`, children: [caption && jsx("caption", { children: caption }), jsx("thead", { children: jsxs("tr", { children: [bulkActions && (jsx("th", { children: jsx(IndeterminateCheckbox, { className: "checkbox checkbox-xs", onChange: (e) => {
                                                setSelected(e.target.checked ? pagination.data.map((model) => model.id) : []);
                                            }, indeterminate: selected.length > 0 && selected.length < pagination.data.length, checked: pagination.data.every((model) => selected.includes(model.id)) }) })), paginationConfigs[configName].map((item, i) => {
                                        const column = columns.find((c) => isActionColumn(c) ? "action" === item.name : c.name === item.name);
                                        if (!column || !item.enabled) {
                                            return null;
                                        }
                                        if (isActionColumn(column)) {
                                            return (jsx("th", { className: `${styles$2.thead} w-12 max-w-24 text-xs`, children: "\u00A0" }, `actions-${i}`));
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
                                            return (jsx(Component, { className: `${styles$2.thead} text-xs`, children: jsxs(Link, { prefetch: false, "data-testid": `sort-table-${column.name.toString()}-${sortOrder === "DESC" ? "asc" : "desc"}`, ...(sortBy === column.name ? { className: "text-primary-500" } : {}), href: setPartialParams({ page: 1, sortBy: `${column.name.toString()}:${sortOrder === "DESC" ? "ASC" : "DESC"}` }, searchParams), children: [column.title, sortOrder === "DESC" ? jsx(ChevronDownIcon, { ...args }) : jsx(ChevronUpIcon, { ...args })] }) }, column.name.toString()));
                                        }
                                        return (jsx(Component, { className: `${styles$2.thead} text-xs`, children: column.title }, column.title.toString()));
                                    })] }) }), jsx("tbody", { children: pagination.data.map((model, o) => (jsxs("tr", { "data-testid": `table-row-${o}`, className: cx({
                                    [styles$2.selectedRow]: selected.includes(model.id),
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
                                            return (jsx(Component, { className: column.className, children: column.format ? (jsx(DateTime, { date: model[column.name], format: column.format })) : (jsx(HumanDate, { date: model[column.name] })) }, `${model.id}-${column.name.toString()}`));
                                        }
                                        if (column.type === "code") {
                                            return (jsx(Component, { className: column.className, children: model[column.name] && (jsx("div", { className: "badge badge-sm", children: jsx("code", { children: model[column.name] }) })) }, column.name.toString()));
                                        }
                                        return (jsx(Component, { className: column.className, children: column.truncate ? (jsx(TruncateText, { text: model[column.name], length: column.truncate })) : model[column.name] }, column.name.toString()));
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
    return (jsxs(Link, { href: addLocale(href, useParams().locale), ...rest, prefetch: false, className: `${styles$2.link} ${className || ""} text-primary-700 hover:text-primary-500`, children: [children, " "] }));
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
    return (jsxs("div", { className: "flex items-center", children: [children, jsx(TableLink, { "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": isFiltering ? t("general.filter") : t("general.clearFilter"), className: `${className || ""} px-2 invisible`, href: `${pathname}${setPartialParams(p, searchParams)}`, children: isFiltering ? jsx(FunnelIcon, { className: "size-5" }) : jsx(FunnelIcon$1, { className: "size-5" }) })] }));
};
const TruncateText = ({ text, length }) => {
    return (jsx("div", { "data-tooltip-id": TOOLTIP_GLOBAL_ID, "data-tooltip-content": text, className: "text-left text-ellipsis overflow-hidden", style: { width: length }, children: text }));
};

const TOOLTIP_PARALLEL_ID = "paralel-tooltip";
const ParallelDialog = ({ title, children, onClose, className, ...rest }) => {
    const [isOpen, setIsOpen] = useState(true);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter$1();
    const closeModal = () => {
        setIsOpen(false);
        if (onClose) {
            onClose();
            return;
        }
        if (history.length > 2) {
            router.back();
            return;
        }
        // Match /[lang]/bucket/[id]/[module]
        const matchBucket = pathname.match(/^(\/(en|lt)\/buckets\/\d+\/[\w-]+)\/.*/);
        if (matchBucket && matchBucket[1]) {
            router.push(`${matchBucket[1]}?${searchParams.toString()}`);
            return;
        }
        // Match /[lang]/admin/[module]
        const matchAdmin = pathname.match(/^(\/(en|lt)\/admin\/[\w-]+)\/.*/);
        if (matchAdmin && matchAdmin[1]) {
            router.push(`${matchAdmin[1]}?${searchParams.toString()}`);
            return;
        }
        if (/\/(en|lt)\/buckets\/\d+\/[\w-]+/.test(pathname) || /\/(en|lt)\/admin\/[\w-]+/.test(pathname)) {
            router.push(pathname);
            return;
        }
    };
    return (jsx(FocusLock, { children: jsxs("dialog", { onKeyDown: (e) => e.key === "Escape" && closeModal(), className: `modal overflow-y-auto ${isOpen ? "modal-open" : ""}`, style: { zIndex: 1100 }, "data-testid": "modal-dialog", ...rest, children: [jsxs("div", { className: `modal-box my-4 overflow-y-visible max-h-none ${className}`, tabIndex: 0, children: [title && (jsx("h3", { className: "font-bold text-lg", "data-testid": "modal-dialog-title", children: title })), children] }), jsx("form", { method: "dialog", className: "modal-backdrop", children: jsx("button", { onClick: closeModal, children: "close" }) }), jsx(Tooltip, { id: TOOLTIP_PARALLEL_ID, place: "top" })] }) }));
};

const Archive = ({ title, archive, onClose, formatErrors, translateId, onSuccess, children, }) => {
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
                    if (formatErrors) {
                        setErrors(response);
                    }
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
    return (jsxs(ParallelDialog, { onClose: onClose, title: title, children: [jsx(Hotkeys, { id: "archive", hotKeys: [{ key: "Enter", description: t("archive.yes"), callback: doArchive }] }), errors && formatErrors && jsx("div", { className: "alert alert-error my-4", children: formatErrors(errors) }), t("archive.message"), jsx("br", {}), jsx("br", {}), children, jsx("div", { className: "w-full text-center", children: jsxs("div", { className: "mx-auto", children: [jsx("button", { onClick: doArchive, className: "btn btn-error uppercase", disabled: isLoading, "data-testid": "button-archive", children: t("archive.yes") }), " ", jsx("button", { className: "btn uppercase", onClick: () => (onClose ? onClose() : router.back()), "data-testid": "button-cancel", children: t("archive.no") })] }) })] }));
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

export { ActionButton, Archive, ArchiveButton, ArchiveButtonWithDialog, BulkActions, BulkDropDownActions, CheckboxInput, ConfirmSave, DateInput, DatePicker, DateTime, DateTimeInput, DateTimePicker, EditButton, FilterLink, GeneralErrors, GeneralErrorsInToast, HeaderResponsive, HeaderResponsivePaginated, HumanDate, IndeterminateCheckbox, InputErrors, Label, LoadingComponent, LocalStorage, MoreActions, NumberInput, PaginatedTable, Pagination, ParallelDialog, Popover, RadioBox, Required, SaveButton, ScreenSize, SelectInput, SelectPaginatedFromApi, SelectPaginatedFromApiInput, SelectPaginatedFromApiWithLabel, TOOLTIP_GLOBAL_ID, TOOLTIP_PARALLEL_ID, TableLink, TextInput, TextareaInput, TimeInput, TimePicker, Toaster, ViewButton, addServerErrors, getNextPageParam, getPreviousPageParam, isActionColumn, isFunctionColumn, isParamActive, isServerError, mapToDot, setPartialParams, useFormSubmit, useScreenSize };
//# sourceMappingURL=index.js.map
