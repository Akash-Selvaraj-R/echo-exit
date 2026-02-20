"use client";

import React, { useState, useEffect } from "react";

export const useMounted = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return mounted;
};

interface MountedGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const MountedGuard: React.FC<MountedGuardProps> = ({ children, fallback = null }) => {
    const mounted = useMounted();

    if (!mounted) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};
