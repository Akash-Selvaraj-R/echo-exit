"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { NotesView } from "@/components/workspace/NotesView";
import { CalculatorView } from "@/components/workspace/CalculatorView";
import { TimetableView } from "@/components/workspace/TimetableView";
import { DashboardView } from "@/components/workspace/DashboardView";
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
import { ShieldCheck, Sparkles } from "lucide-react";
import { useMounted } from "@/components/MountedGuard";

export default function Home() {
  const [activeMode, setActiveMode] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isTriggered, secureMode } = useSafety();
  const mounted = useMounted();
  const cursorRef = useRef<HTMLDivElement>(null);

  // Unified Emergency Trigger
  const { trigger, isLockActivated, setIsLockActivated } = useEmergencyTrigger();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Cursor following logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Activate Triggers
  useShortcutTrigger(trigger, "Control+Shift+L");
  useShakeDetection(trigger, user?.safetySettings.shakeDetection);

  if (!mounted || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-10 h-10 rounded-full bg-primary/20 blur-xl"
        />
      </div>
    );
  }

  const renderView = () => {
    switch (activeMode) {
      case "dashboard":
        return <DashboardView />;
      case "notes":
        return <NotesView />;
      case "calc":
        return <CalculatorView />;
      case "timetable":
        return <TimetableView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary/20 transition-all duration-1000">
      {/* Cursor Glow Effect */}
      <div ref={cursorRef} className="cursor-glow" />

      {/* Ripple Animation on Trigger */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 10, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-rose-400/30 rounded-full z-[100] blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      <Navigation
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex flex-col min-h-screen pl-32 pr-8 py-8">
        <motion.header
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/40 glass">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500/80">
              {activeMode}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full glass text-[11px] font-bold text-slate-500 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${secureMode ? 'bg-rose-400' : 'bg-emerald-400'} animate-pulse`} />
              {secureMode ? 'SECURE_MODE' : 'ACTIVE_SESSION'}
            </div>
          </div>
        </motion.header>

        <motion.main
          className={`flex-1 relative transition-all duration-1000 ${secureMode ? "blur-sm pointer-events-none scale-[0.98]" : ""
            }`}
        >
          <AnimatePresence mode="wait">
            {!secureMode ? (
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {renderView()}
              </motion.div>
            ) : (
              <motion.div
                key="secure"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
              >
                <div className="relative p-12 rounded-[3.5rem] glass-dark border-white/5 shadow-2xl overflow-hidden group">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full"
                  />

                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 mx-auto border border-white/10"
                  >
                    <ShieldCheck className="w-10 h-10 text-blue-400/80" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                    Environment Secured
                  </h2>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8">
                    Active monitoring initiated. Your trusted contacts have been alerted with location context.
                  </p>

                  <div className="flex gap-2 items-center justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                        className="h-2 w-2 bg-blue-400/60 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        <footer className="mt-8 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400/60">
          <p>© 2026 EchoExit Research</p>
          <div className="flex gap-4">
            <span className="cursor-help hover:text-slate-900 transition-colors">Privacy</span>
            <span className="cursor-help hover:text-slate-900 transition-colors">Safety Guide</span>
          </div>
        </footer>
      </div>

      <SettingsPanel open={isSettingsOpen && !secureMode} onOpenChange={setIsSettingsOpen} />
      {!secureMode && <PrivacyDialog />}
      <LockScreen isOpen={isLockActivated && !secureMode} onUnlock={() => setIsLockActivated(false)} />
    </div>
  );
}
