"use client";

import { useCallback } from "react";
import { useSafety } from "@/context/SafetyContext";

export const useEmergencyTrigger = () => {
    const { triggerEmergency, isLockActivated, setIsLockActivated, secureMode } = useSafety();

    const trigger = useCallback(async () => {
        await triggerEmergency();
    }, [triggerEmergency]);

    return { trigger, isLockActivated, setIsLockActivated, secureMode };
};
