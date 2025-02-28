"use client";

import { useContext, useEffect } from "react";
import { Hotkey, HotkeysContext } from "./HotKeysProvider";
import toast from "react-hot-toast";

export const Hotkeys = ({ hotKeys, id }: { id: string; hotKeys: Hotkey[] }) => {
  const mapping = useContext(HotkeysContext);
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      for (let i = 0; i < hotKeys.length; i++) {
        const metaKey = hotKeys[i].metaKey ?? false;
        const ctrlKey = hotKeys[i].ctrlKey ?? false;
        const altKey = hotKeys[i].altKey ?? false;
        if (hotKeys[i].key === e.key && metaKey === e.metaKey && ctrlKey === e.ctrlKey && altKey === e.altKey) {
          toast.custom(
            <div className="bg-black/50 text-white rounded-md py-2 px-4 text-sm">
              {metaKey && (
                <>
                  <kbd className="kbd text-gray-700 kbd-sm">⌘</kbd> +
                </>
              )}
              {ctrlKey && (
                <>
                  <kbd className="kbd text-gray-700 kbd-sm">ctrl</kbd> +
                </>
              )}
              {altKey && (
                <>
                  <kbd className="kbd text-gray-700 kbd-sm">alt</kbd> +
                </>
              )}
              <kbd key="key" className="kbd text-gray-700 kbd-sm mr-2">
                {hotKeys[i].key}
              </kbd>
              {hotKeys[i].description}
            </div>,
            {
              duration: 50,
              position: "bottom-center",
            },
          );
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
