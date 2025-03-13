import React from "react";
export type Hotkey = {
    callback: () => void;
    key: string;
    metaKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
    description: string;
};
export declare const HotKeysViewer: () => import("react/jsx-runtime").JSX.Element;
type HotkeysContextType = {
    getHotKeys: () => Record<string, Hotkey[]>;
    addHotKey: (id: string, hotkeys: Hotkey[]) => void;
    removeHotKey: (id: string) => void;
};
export declare const HotkeysContext: React.Context<HotkeysContextType>;
export {};
//# sourceMappingURL=HotKeysProvider.d.ts.map