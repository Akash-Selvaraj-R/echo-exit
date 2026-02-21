"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafety } from "@/context/SafetyContext";
import { toast } from "sonner";

export const useEmergencyTrigger = () => {
    const { user } = useAuth();
    const { triggerEmergency: baseTrigger } = useSafety();
    const [isLockActivated, setIsLockActivated] = useState(false);

    const trigger = useCallback(async () => {
        if (!user) return;

        const settings = user.safetySettings;

        // 1. Conditional Psychological Lock
        if (settings.psychologicalLock) {
            setIsLockActivated(true);
        }

        // 2. Background Call Initiation (Discreet)
        if (settings.autoCall) {
            // Standard tel: protocol - browser handles confirmation if needed
            window.location.href = `tel:${settings.emergencyNumber}`;
        }

        // 3. Execute Core Logic & Instant Redirect
        // The SafetyContext triggerEmergency now handles window.location.replace
        await baseTrigger();
    }, [user, baseTrigger]);

    return { trigger, isLockActivated, setIsLockActivated };
};
