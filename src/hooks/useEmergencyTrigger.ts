"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSafety } from "@/context/SafetyContext";
import { toast } from "sonner";

export const useEmergencyTrigger = () => {
    const { user } = useAuth();
    const { triggerEmergency: baseTrigger, secureMode } = useSafety();
    const [isLockActivated, setIsLockActivated] = useState(false);

    const trigger = useCallback(async () => {
        if (!user || secureMode) return;

        const settings = user.safetySettings;

        // 1. Conditional Psychological Lock
        if (settings.psychologicalLock) {
            setIsLockActivated(true);
        }

        // 2. Execute Core Logic & Background Tasks (Non-blocking)
        baseTrigger();

        // 3. Background Call Initiation (Discreet, slightly delayed to allow UI switch)
        if (settings.autoCall) {
            setTimeout(() => {
                // Invisible iframe to trigger tel: without navigating away
                const iframe = document.createElement("iframe");
                iframe.style.display = "none";
                iframe.src = `tel:${settings.emergencyNumber}`;
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 2000);
            }, 300);
        }
    }, [user, baseTrigger, secureMode]);

    return { trigger, isLockActivated, setIsLockActivated };
};
