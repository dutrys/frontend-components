import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition, } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
const PAGINATE_LIMIT = 50;
export const SelectPaginatedFromApi = ({ onChange, disabled, required, value, className, queryKey, allowEmpty, queryFunction, placeholder, valueFormat = (model) => model.name, inputClassName = "w-full mx-0 input input-bordered", ...rest }) => {
    const [query, setQuery] = useState("");
    const { isLoading, data, refetch } = useQuery({
        enabled: !disabled,
        queryKey: [...queryKey, query],
        queryFn: ({ queryKey }) => {
            if (!queryFunction) {
                return null;
            }
            const search = queryKey[queryKey.length - 1] || "";
            if (search === "") {
                return queryFunction({ limit: 100 });
            }
            return search.length >= PAGINATE_LIMIT ? queryFunction({ search, limit: 100 }) : null;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const t = useTranslations("SelectFromApi");
    useEffect(() => {
        void refetch();
    }, [refetch, query]);
    return (_jsx(Combobox, { immediate: true, "data-testid": "select", disabled: disabled, value: (data?.data || []).find((b) => b.id === value) || null, onChange: onChange, ...rest, children: _jsxs("div", { className: `relative ${className}`, children: [_jsxs("div", { className: "w-full relative input p-0", children: [_jsx(ComboboxInput, { required: required, "data-testid": "select-input", placeholder: placeholder, onFocus: (e) => e?.target?.select(), className: inputClassName, displayValue: (model) => (model ? valueFormat(model) : ""), onChange: (event) => setQuery(event.target.value) }), _jsx(ComboboxButton, { "data-testid": "select-input-btn", className: "absolute inset-y-0 right-0 flex items-center pr-2", children: _jsx(ChevronUpDownIcon, { className: "h-5 w-5 text-gray-400", "aria-hidden": "true" }) })] }), _jsx(Transition, { as: Fragment, leave: "transition ease-in duration-100", leaveFrom: "opacity-100", leaveTo: "opacity-0", children: _jsxs(ComboboxOptions, { className: "absolute z-10 mt-2 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/50 focus:outline-hidden sm:text-sm", children: [allowEmpty && (_jsx(ComboboxOption, { "data-testid": "select-option-empty", className: ({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-primary-600 text-white" : "text-gray-900"}`, value: undefined, children: _jsx("span", { className: "block truncate", children: typeof allowEmpty === "string" ? allowEmpty : t("empty") }) }, "empty")), isLoading || !data?.data || data?.data?.length === 0 ? (_jsx("div", { className: "relative cursor-default select-none py-2 px-4 text-gray-700", children: query.length > 0 && query.length < PAGINATE_LIMIT
                                    ? t("enter more symbols", { value: PAGINATE_LIMIT })
                                    : isLoading || data?.data === null
                                        ? t("searching")
                                        : t("nothing found") })) : (data?.data.map((model, i) => (_jsx(ComboboxOption, { "data-testid": `select-option-${i}`, className: ({ active }) => `relative cursor-default select-none py-2 pl-4 pr-4 ${active ? "bg-primary-600 text-white" : "text-gray-900"}`, value: model, children: ({ selected, active }) => (_jsxs(_Fragment, { children: [_jsx("span", { className: `block truncate ${active ? "text-white" : ""} ${selected ? "pr-3 font-bold" : "font-normal"}`, children: valueFormat(model) }), selected ? (_jsx("span", { className: `absolute inset-y-0 right-1 flex items-center pl-3 ${active ? "text-white" : "text-teal-600"}`, children: _jsx(CheckIcon, { className: "h-5 w-5", "aria-hidden": "true" }) })) : null] })) }, model.id))))] }) })] }) }));
};
//# sourceMappingURL=SelectPaginatedFromApi.js.map