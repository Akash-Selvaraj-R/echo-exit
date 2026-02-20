"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSafety } from "@/context/SafetyContext";

/**
 * Hook for keyboard shortcut trigger.
 */
export const useShortcutTrigger = () => {
    const { config, triggerEmergency } = useSafety();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Configuration based check (default: Shift + Alt + S)
            const isShift = e.shiftKey;
            const isAlt = e.altKey;
            const isS = e.key.toLowerCase() === "s";

            if (isShift && isAlt && isS) {
                e.preventDefault();
                triggerEmergency();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [triggerEmergency, config.shortcut]);
};

/**
 * Hook for multi-click trigger on a specific element.
 */
export const useMultiClickTrigger = (targetRef: React.RefObject<HTMLElement | null>) => {
    const { config, triggerEmergency } = useSafety();
    const clickCount = useRef(0);
    const lastClickTime = useRef(0);

    useEffect(() => {
        const node = targetRef.current;
        if (!node) return;

        const handleClick = () => {
            const now = Date.now();
            if (now - lastClickTime.current > 2000) {
                clickCount.current = 1;
            } else {
                clickCount.current += 1;
            }
            lastClickTime.current = now;

            if (clickCount.current >= config.multiClickThreshold) {
                triggerEmergency();
                clickCount.current = 0; // Reset
            }
        };

        node.addEventListener("click", handleClick);
        return () => node.removeEventListener("click", handleClick);
    }, [targetRef, triggerEmergency, config.multiClickThreshold]);
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
