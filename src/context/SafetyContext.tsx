"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

interface SafetyConfig {
  shortcut: string; // e.g., "Shift+Alt+S"
  multiClickThreshold: number; // e.g., 5
  safeWord: string; // e.g., "exit now"
  safeUrl: string; // e.g., "https://www.bbc.com"
  emergencyNumber: string; // e.g., "911" or a personal contact
  psychologicalLock: boolean;
  // `autoCall` is no longer a user-controlled setting; secure dialing happens
  // automatically whenever an emergency is triggered. We keep the field in the
  // persisted structure only for backward compatibility, but it is ignored.
  autoCall?: boolean;
  emergencyMessage?: string; // e.g., "I need help. My location is:"
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
  secureMode: boolean;
  isLockActivated: boolean;
  setIsLockActivated: (val: boolean) => void;
}

const DEFAULT_CONFIG: SafetyConfig = {
  shortcut: "ShiftAltS",
  multiClickThreshold: 5,
  safeWord: "safety first",
  safeUrl: "https://www.drbccchinducollege.edu.in/",
  emergencyNumber: "+917871411065",
  psychologicalLock: false,
  emergencyMessage: "Emergency triggered. Please check on me.",
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export const SafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [isTriggered, setIsTriggered] = useState(false);
  const [secureMode, setSecureMode] = useState(false);
  const [isLockActivated, setIsLockActivated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const hasTriggeredRef = useRef(false);
  const bufferRef = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const TYPED_TRIGGER = "safety first".toLowerCase();


  const config: SafetyConfig = user ? {
    shortcut: user.safetySettings.shortcutTrigger,
    multiClickThreshold: 5,
    safeWord: user.safetySettings.safeWord,
    safeUrl: user.safetySettings.safeUrl,
    emergencyNumber: user.safetySettings.emergencyNumber,
    psychologicalLock: user.safetySettings.psychologicalLock,
    emergencyMessage: user.safetySettings.emergencyMessage
  } : DEFAULT_CONFIG;

  const updateConfig = (newConfig: Partial<SafetyConfig>) => {
    if (!user) return;
    updateUser({
      safetySettings: { ...user.safetySettings, ...newConfig }
    });
  };

  // helper that triggers a hidden tel: intent with fallbacks.
  const initiateSecureCall = useCallback((phone: string) => {
    // 1. Try invisible link click (often more reliable on mobile)
    try {
      const link = document.createElement("a");
      link.href = `tel:${phone}`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
      }, 500);
    } catch (e) {
      console.warn("Link click fallback failed", e);
    }

    // 2. Try iframe fallback (discreet)
    setTimeout(() => {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = `tel:${phone}`;
      document.body.appendChild(iframe);
      setTimeout(() => {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
      }, 2000);
    }, 100);
  }, []);

  const triggerEmergency = useCallback(async () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // 1. IMMEDIATE UI FEEDBACK (Blur + Lock State)
    setIsTriggered(true);
    setSecureMode(true);

    const settings = user?.safetySettings;
    if (settings?.psychologicalLock) {
      setIsLockActivated(true);
    }

    // 2. START BACKGROUND TASKS (Call + Location)
    const dialNumber = settings?.emergencyNumber || DEFAULT_CONFIG.emergencyNumber;

    // Attempt call immediately after state flip
    initiateSecureCall(dialNumber);

    const executeBackgroundTasks = async () => {
      // Capture Context
      const timestamp = new Date().toISOString();
      const deviceContext = {
        userAgent: navigator.userAgent,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
      };

      // Geolocation
      let location = "Not Enabled";
      try {
        if (typeof navigator !== "undefined" && navigator.geolocation) {
          const pos = await Promise.race([
            new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
            }),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 3500))
          ]);
          if (pos) {
            location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
          }
        }
      } catch (e) {
        console.warn("Location capture failed", e);
      }

      // Store Log (Silent "Sharing")
      const log = { timestamp, location, deviceContext };
      const existingLogs = JSON.parse(localStorage.getItem("echo-exit-logs") || "[]");
      localStorage.setItem("echo-exit-logs", JSON.stringify([...existingLogs, log]));

      console.log("[EchoExit] Emergency activation sequence complete.");
    };

    executeBackgroundTasks();

    // 3. SECURE REDIRECT (1.5s delay exactly as requested)
    setTimeout(() => {
      window.location.href = settings?.safeUrl || DEFAULT_CONFIG.safeUrl;
    }, 1500);

  }, [user, initiateSecureCall]);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Only process single characters (letters, numbers, space)
      if (e.key.length === 1) {
        // Reset timer on every press
        if (timerRef.current) clearTimeout(timerRef.current);

        bufferRef.current += e.key.toLowerCase();

        // Keep buffer size manageable (trigger length + small margin)
        if (bufferRef.current.length > TYPED_TRIGGER.length + 5) {
          bufferRef.current = bufferRef.current.slice(-(TYPED_TRIGGER.length + 5));
        }

        // Check for match
        if (bufferRef.current.includes(TYPED_TRIGGER)) {
          triggerEmergency();
          bufferRef.current = ""; // Reset
        }

        // Reset buffer if user stops typing for > 3 seconds
        timerRef.current = setTimeout(() => {
          bufferRef.current = "";
        }, 3000);
      } else if (e.key === "Backspace") {
        bufferRef.current = bufferRef.current.slice(0, -1);
      } else if (e.key === "Escape") {
        bufferRef.current = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [triggerEmergency]);

  // We no longer return null here to allow SSR pre-rendering/static-check
  // if (!mounted) return null;

  return (
    <SafetyContext.Provider value={{ config, updateConfig, triggerEmergency, isTriggered, secureMode, isLockActivated, setIsLockActivated }}>
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
