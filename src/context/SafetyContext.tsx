"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SafetyConfig {
  shortcut: string; // e.g., "Shift+Alt+S"
  multiClickThreshold: number; // e.g., 5
  safeWord: string; // e.g., "exit now"
  safeUrl: string; // e.g., "https://www.bbc.com"
  emergencyNumber: string; // e.g., "911" or a personal contact
}

interface SafetyContextType {
  config: SafetyConfig;
  updateConfig: (newConfig: Partial<SafetyConfig>) => void;
  triggerEmergency: () => Promise<void>;
  isTriggered: boolean;
}

const DEFAULT_CONFIG: SafetyConfig = {
  shortcut: "ShiftAltS",
  multiClickThreshold: 5,
  safeWord: "safety first",
  safeUrl: "https://www.google.com/search?q=weather+update",
  emergencyNumber: "+917871411065",
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SafetyConfig>(DEFAULT_CONFIG);
  const [isTriggered, setIsTriggered] = useState(false);
  const router = useRouter();

  // Load config from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("echo-exit-config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse safety config", e);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<SafetyConfig>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    localStorage.setItem("echo-exit-config", JSON.stringify(updated));
  };

  const triggerEmergency = useCallback(async () => {
    if (isTriggered) return;
    setIsTriggered(true);

    // 1. Collect Context
    const timestamp = new Date().toISOString();
    const deviceContext = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };

    // 2. Request Geolocation
    let location = "Denied";
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
    } catch (e) {
      console.warn("Geolocation access denied or failed", e);
    }

    // 3. Generate Payload
    const payload = {
      timestamp,
      deviceContext,
      location,
      emergencyNumber: config.emergencyNumber,
      type: "EMERGENCY_TRIGGERED",
    };

    // 4. Simulate sending to backend
    console.log("Simulating alert payload dispatch:", payload);
    toast.success("Safety Protocol Activated", {
      description: `Secure call initiated to ${config.emergencyNumber}. Redirecting...`,
    });

    // 5. Short delay then redirect
    setTimeout(() => {
      window.location.href = config.safeUrl;
    }, 1500);
  }, [config.safeUrl, isTriggered]);

  return (
    <SafetyContext.Provider value={{ config, updateConfig, triggerEmergency, isTriggered }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error("useSafety must be used within a SafetyProvider");
  }
  return context;
};
