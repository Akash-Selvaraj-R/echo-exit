"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { NotesView } from "@/components/workspace/NotesView";
import { CalculatorView } from "@/components/workspace/CalculatorView";
import { TimetableView } from "@/components/workspace/TimetableView";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PrivacyDialog } from "@/components/PrivacyDialog";
import { useShortcutTrigger } from "@/hooks/useTriggers";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEmergencyTrigger } from "@/hooks/useEmergencyTrigger";
import { useShakeDetection } from "@/hooks/useShakeDetection";
import { LockScreen } from "@/components/LockScreen";
import { useSafety } from "@/context/SafetyContext";
import { Phone } from "lucide-react";
import { useMounted } from "@/components/MountedGuard";

export default function Home() {
  const [activeMode, setActiveMode] = useState("notes");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isTriggered, config } = useSafety();
  const mounted = useMounted();

  // Unified Emergency Trigger
  const { trigger, isLockActivated, setIsLockActivated } = useEmergencyTrigger();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Activate Triggers
  useShortcutTrigger(trigger, "Control+Shift+L"); // New shortcut
  useShakeDetection(trigger, user?.safetySettings.shakeDetection);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderView = () => {
    switch (activeMode) {
      case "notes":
        return <NotesView />;
      case "calc":
        return <CalculatorView />;
      case "timetable":
        return <TimetableView />;
      default:
        return <NotesView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-black font-sans selection:bg-slate-200 dark:selection:bg-slate-800">
      <Navigation
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto min-h-screen">
        <div className="glass rounded-3xl min-h-[70vh] backdrop-blur-sm overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!isTriggered ? (
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="p-8 h-full"
              >
                {renderView()}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-red-500/20"
                >
                  <Phone className="text-white w-12 h-12" />
                </motion.div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Secure Call Initiated</h2>
                <p className="text-xl text-slate-500 font-mono">{config.emergencyNumber}</p>
                <div className="mt-8 flex gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <SettingsPanel open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      <PrivacyDialog />

      <LockScreen
        isOpen={isLockActivated}
        onUnlock={() => setIsLockActivated(false)}
      />

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
        &copy; 2026 EchoExit Research Prototype. All rights reserved.
      </footer>
    </div>
  );
}
