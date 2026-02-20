"use client";

import { useEffect, useRef } from "react";

export const useShakeDetection = (onShake: () => void, enabled: boolean = true) => {
    const threshold = 15; // G-force threshold
    const lastUpdate = useRef(0);
    const lastX = useRef(0);
    const lastY = useRef(0);
    const lastZ = useRef(0);

    useEffect(() => {
        if (!enabled) return;

        const handleMotion = (event: DeviceMotionEvent) => {
            const acc = event.accelerationIncludingGravity;
            if (!acc) return;

            const curTime = Date.now();
            if ((curTime - lastUpdate.current) > 100) {
                const diffTime = curTime - lastUpdate.current;
                lastUpdate.current = curTime;

                const x = acc.x || 0;
                const y = acc.y || 0;
                const z = acc.z || 0;

                const speed = Math.abs(x + y + z - lastX.current - lastY.current - lastZ.current) / diffTime * 10000;

                if (speed > threshold) {
                    onShake();
                }

                lastX.current = x;
                lastY.current = y;
                lastZ.current = z;
            }
        };

        // Request permission for iOS
        if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            (DeviceMotionEvent as any).requestPermission()
                .then((state: string) => {
                    if (state === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                    }
                })
                .catch(console.error);
        } else {
            window.addEventListener('devicemotion', handleMotion);
        }

        return () => window.removeEventListener('devicemotion', handleMotion);
    }, [onShake, enabled]);
};
