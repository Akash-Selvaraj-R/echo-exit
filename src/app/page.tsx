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
import { ShieldCheck } from "lucide-react";
import { useMounted } from "@/components/MountedGuard";

export default function Home() {
  const [activeMode, setActiveMode] = useState("notes");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isTriggered, secureMode } = useSafety();
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
    <div className={`min-h-screen bg-slate-50/50 dark:bg-black font-sans selection:bg-slate-200 dark:selection:bg-slate-800 transition-all duration-1000 flex flex-col items-center ${secureMode ? 'blur-[2px]' : ''}`}>
      <motion.div
        className="w-full relative"
        animate={secureMode ? { x: [-10, 10, -10, 10, 0], scale: 0.98 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <main className="pt-24 pb-12 px-6 w-full max-w-6xl mx-auto min-h-screen relative">
          <AnimatePresence mode="wait">
            {!secureMode ? (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.4 }}
                className="glass rounded-3xl min-h-[70vh] backdrop-blur-sm overflow-hidden relative p-8 shadow-sm border-white/50"
              >
                {renderView()}
              </motion.div>
            ) : (
              <motion.div
                key="secure"
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 top-24 mx-6 z-50 flex flex-col items-center justify-center min-h-[70vh]"
              >
                <div className="flex flex-col items-center gap-6 p-12 rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl border border-white/60 dark:border-slate-800 shadow-2xl">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-blue-100/50 flex items-center justify-center mb-2"
                  >
                    <ShieldCheck className="w-10 h-10 text-blue-600/80" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                    Secure communication initiated
                  </h2>
                  <div className="flex gap-2 items-center">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <SettingsPanel open={isSettingsOpen && !secureMode} onOpenChange={setIsSettingsOpen} />
        {!secureMode && <PrivacyDialog />}

        <LockScreen
          isOpen={isLockActivated && !secureMode}
          onUnlock={() => setIsLockActivated(false)}
        />

        <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
          &copy; 2026 EchoExit Research Prototype. All rights reserved.
        </footer>
      </motion.div>
    </div>
  );
}
