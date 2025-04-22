import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

const HotKeysViewer = () => {
    const hotkeysContext = useContext(HotkeysContext);
    const hotkeys = hotkeysContext.getHotKeys();
    const [keys, setKeys] = useState({});
    const t = useTranslations();
    useEffect(() => {
        const handleKeyDown = (e) => setKeys({ metaKey: e.metaKey, altKey: e.altKey, ctrlKey: e.ctrlKey, key: e.key });
        const handleKeyUp = (e) => setKeys({ metaKey: e.metaKey, altKey: e.altKey, ctrlKey: e.ctrlKey, key: "" });
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, [hotkeys]);
    const isMac = navigator.userAgent.indexOf("Mac OS X") !== -1;
    return (jsxs("div", { className: "absolute bottom-4 left-28 bg-base-200 rounded-xl p-4 shadow-xl", style: { zIndex: 1200 }, children: [jsxs("div", { className: "text-center text-lg", children: ["Schedules (", process.env.NEXT_PUBLIC_VERSION, ")"] }), navigator.maxTouchPoints === 0 && (jsxs(Fragment, { children: [jsx("div", { className: "divider my-1" }), jsxs("div", { className: "text-center mb-2 text-gray-500", children: [t("help.keyboardShortcuts"), ":"] }), Object.values(hotkeys).map((hotkeys) => hotkeys.map((hotKey) => (jsxs("div", { className: "pb-2 text-sm", children: [hotKey.metaKey && (jsxs(Fragment, { children: [jsx("kbd", { className: `kbd bg-white kbd-sm ${keys.metaKey ? "text-primary" : ""}`, children: isMac ? ("⌘") : (jsxs("svg", { version: "1.1", viewBox: "0 0 15.5 16.433", className: "w-3 h-3", xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "m6.2696 1.7012-6.1 0.9384c-0.0976 0.015-0.1696 0.099-0.1696 0.1977v4.9218c0 0.1105 0.0895 0.2 0.2 0.2h6.1c0.1105 0 0.2-0.0895 0.2-0.2v-5.8602c0-0.1226-0.1093-0.2164-0.2304-0.1977z", fill: "#222" }), jsx("path", { d: "m7.5 7.7591v-6.134c0-0.0963 0.0685-0.1789 0.1631-0.1966l7.6-1.425c0.1231-0.0231 0.2369 0.0714 0.2369 0.1966v7.559c0 0.1105-0.0895 0.2-0.2 0.2h-7.6c-0.1105 0-0.2-0.0895-0.2-0.2z", fill: "#222" }), jsx("path", { d: "m0 13.945v-4.7863c0-0.1105 0.0895-0.2 0.2-0.2h6.1c0.1105 0 0.2 0.0895 0.2 0.2v5.7248c0 0.1226-0.1093 0.2163-0.2304 0.1977l-6.1-0.9385c-0.0976-0.015-0.1696-0.099-0.1696-0.1977z", fill: "#222" }), jsx("path", { d: "m7.5 15.282v-6.1234c0-0.1105 0.0895-0.2 0.2-0.2h7.6c0.1105 0 0.2 0.0895 0.2 0.2v7.0734c0 0.1203-0.1054 0.2134-0.2248 0.1985l-7.6-0.95c-0.1001-0.0125-0.1752-0.0976-0.1752-0.1985z", fill: "#222" })] })) }), " ", "+", " "] })), hotKey.ctrlKey && (jsxs(Fragment, { children: [jsx("kbd", { className: `kbd bg-white kbd-sm ${keys.ctrlKey ? "text-primary" : ""}`, children: "ctrl" }), " +", " "] })), hotKey.altKey && (jsxs(Fragment, { children: [jsx("kbd", { className: `kbd bg-white kbd-sm ${keys.altKey ? "text-primary" : ""}`, children: "alt" }), " +", " "] })), jsx("kbd", { className: `kbd bg-white kbd-sm ${keys.key === hotKey.key ? "text-primary" : ""}`, children: hotKey.key }), " ", "- ", jsx("span", { className: "text-gray-500", children: hotKey.description })] }, hotKey.key))))] }))] }));
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

export { HotKeysViewer, Hotkeys, HotkeysContext };
//# sourceMappingURL=hot-keys.js.map
