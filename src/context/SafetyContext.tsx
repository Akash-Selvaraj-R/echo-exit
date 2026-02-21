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
  psychologicalLock: boolean;
}

interface EmergencyLog {
  timestamp: string;
  location: string;
  deviceContext: {
    userAgent: string;
    screenWidth: number;
    screenHeight: number;
  };
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
  psychologicalLock: false,
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SafetyConfig>(DEFAULT_CONFIG);
  const [isTriggered, setIsTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Load config from LocalStorage on mount
  useEffect(() => {
    setMounted(true);
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
    // 1. Capture Context Instantly
    const timestamp = new Date().toISOString();
    const deviceContext = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };

    // 2. Geolocation (Local Capture)
    let location = "Not Enabled";
    try {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        // Use a timeout for geolocation to avoid blocking the redirect
        const pos = await Promise.race([
          new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 100 });
          }),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 100))
        ]);
        if (pos) {
          location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        }
      }
    } catch (e) {
      console.warn("Fast location capture failed", e);
    }

    // 3. Store Local Log
    const log: EmergencyLog = { timestamp, location, deviceContext };
    const existingLogs = JSON.parse(localStorage.getItem("echo-exit-logs") || "[]");
    localStorage.setItem("echo-exit-logs", JSON.stringify([...existingLogs, log]));

    // 4. Instant Redirect
    window.location.replace(config.safeUrl);
  }, [config.safeUrl]);

  if (!mounted) return null;

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
