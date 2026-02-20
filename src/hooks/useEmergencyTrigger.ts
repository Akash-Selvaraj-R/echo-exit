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

        // 1. Activate Visual Lock instantly
        setIsLockActivated(true);

        // 2. Perform background actions
        if (settings.autoCall) {
            window.location.href = `tel:${settings.emergencyNumber}`;
        }

        // 3. Base protocol (payload, geolocation, redirect)
        await baseTrigger();

        // Note: The baseTrigger in SafetyContext currently handles redirect with a delay.
        // We'll keep that for now but ensure it pulls from user settings if possible.
    }, [user, baseTrigger]);

    return { trigger, isLockActivated, setIsLockActivated };
};
