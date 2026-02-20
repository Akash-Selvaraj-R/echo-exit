"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSafety } from "@/context/SafetyContext";

/**
 * Hook for keyboard shortcut trigger.
 */
export const useShortcutTrigger = (callback?: () => void, targetKey: string = "ShiftAltS") => {
    const { config, triggerEmergency } = useSafety();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keys: string[] = [];
            if (e.shiftKey) keys.push("Shift");
            if (e.altKey) keys.push("Alt");
            if (e.ctrlKey) keys.push("Control");
            if (e.metaKey) keys.push("Meta");

            // Simple logic for matching
            const currentShortcut = keys.join("") + e.key.toUpperCase();
            const normalize = (s: string) => s.replace(/\+/g, "").toUpperCase();

            if (normalize(currentShortcut) === normalize(targetKey)) {
                e.preventDefault();
                if (callback) callback();
                else triggerEmergency();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [triggerEmergency, config.shortcut, callback, targetKey]);
};

/**
 * Hook for multi-click trigger on a specific element.
 */
export const useMultiClickTrigger = (ref: React.RefObject<HTMLElement | null>, callback?: () => void) => {
    const { config, triggerEmergency } = useSafety();
    const clicks = useRef(0);
    const lastClick = useRef(0);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleClick = () => {
            const now = Date.now();
            if (now - lastClick.current > 1000) {
                clicks.current = 1;
            } else {
                clicks.current++;
            }
            lastClick.current = now;

            if (clicks.current >= config.multiClickThreshold) {
                if (callback) callback();
                else triggerEmergency();
                clicks.current = 0; // Reset
            }
        };

        element.addEventListener("click", handleClick);
        return () => element.removeEventListener("click", handleClick);
    }, [ref, triggerEmergency, config.multiClickThreshold, callback]);
};

/**
 * Hook for keyword trigger.
 * Usually monitors a specific input or global keystrokes.
 */
export const useKeywordTrigger = (inputValue: string) => {
    const { config, triggerEmergency } = useSafety();

    useEffect(() => {
        if (inputValue.toLowerCase().includes(config.safeWord.toLowerCase())) {
            triggerEmergency();
        }
    }, [inputValue, config.safeWord, triggerEmergency]);
};
