"use client";

import React from "react";
import { useSafety } from "@/context/SafetyContext";

export const AnimatedBackground: React.FC = () => {
    const { isTriggered } = useSafety();

    return (
        <div className={`mesh-bg ${isTriggered ? "triggered" : ""}`}>
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
            <div className="orb orb-4" />
        </div>
    );
};
