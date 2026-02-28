"use client";

import React, { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { NotesView } from "@/components/workspace/NotesView";
import { CalculatorView } from "@/components/workspace/CalculatorView";
import { TimetableView } from "@/components/workspace/TimetableView";
import { DashboardView } from "@/components/workspace/DashboardView";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PrivacyDialog } from "@/components/PrivacyDialog";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ParticleField } from "@/components/ParticleField";
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

const modeLabels: Record<string, string> = {
  dashboard: "Overview",
  notes: "Journal",
  calc: "Calculator",
  timetable: "Schedule",
};

export default function Home() {
  const [activeMode, setActiveMode] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { isTriggered, secureMode } = useSafety();
  const mounted = useMounted();
  const cursorRef = useRef<HTMLDivElement>(null);

  const { trigger, isLockActivated, setIsLockActivated } = useEmergencyTrigger();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Cursor following with smooth spring
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
      <div className="min-h-screen flex items-center justify-center bg-transparent relative">
        <div className="mesh-bg">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-16 h-16 rounded-full relative z-10"
          style={{
            background: "linear-gradient(135deg, var(--echo-lavender), var(--echo-sky))",
            filter: "blur(8px)",
          }}
        />
      </div>
    );
  }

  const renderView = () => {
    switch (activeMode) {
      case "dashboard": return <DashboardView />;
      case "notes": return <NotesView />;
      case "calc": return <CalculatorView />;
      case "timetable": return <TimetableView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex font-sans selection:bg-indigo-200/30 transition-all duration-1000 ${secureMode ? "triggered-edge-glow" : ""
        } ${isTriggered ? "time-dilated" : ""}`}
    >
      {/* Animated Mesh Background */}
      <AnimatedBackground />
      <ParticleField />

      {/* Cursor Glow */}
      <div ref={cursorRef} className="cursor-glow" />

      {/* Trigger Ripple */}
      <AnimatePresence>
        {isTriggered && (
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 12, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "circOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full z-[100] pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(239, 68, 68, 0.2), rgba(168, 85, 247, 0.1), transparent)",
              filter: "blur(40px)",
            }}
          />
        )}
      </AnimatePresence>

      <Navigation
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <div className="flex-1 flex flex-col min-h-screen pl-32 pr-8 py-8 relative z-10">
        {/* Header */}
        <motion.header
          className="flex items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="p-2.5 rounded-xl"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </motion.div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {modeLabels[activeMode] || activeMode}
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <div
              className="px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: secureMode ? "#f87171" : "#818cf8",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-1.5 h-1.5 rounded-full ${secureMode ? "bg-rose-400" : "bg-emerald-400"}`}
              />
              {secureMode ? "SECURE_MODE" : "ACTIVE_SESSION"}
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content Area */}
        <motion.main
          className={`flex-1 relative transition-all duration-1000 ${secureMode ? "blur-sm pointer-events-none scale-[0.98]" : ""
            }`}
        >
          <AnimatePresence mode="wait">
            {!secureMode ? (
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, scale: 0.97, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.02, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                <div
                  className="relative p-16 rounded-[4rem] overflow-hidden group"
                  style={{
                    background: "rgba(10, 10, 30, 0.4)",
                    backdropFilter: "blur(32px)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    boxShadow: "0 24px 80px rgba(0, 0, 0, 0.3), 0 0 120px rgba(99, 102, 241, 0.05)",
                  }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full -z-10"
                    style={{
                      background: "radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent)",
                      filter: "blur(60px)",
                    }}
                  />

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto"
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <ShieldCheck className="w-10 h-10 text-blue-400/80" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
                    Environment Secured
                  </h2>
                  <p className="text-slate-400/80 text-sm max-w-xs mx-auto mb-10">
                    Active monitoring initiated. Your trusted contacts have been alerted with location context.
                  </p>

                  <div className="flex gap-2 items-center justify-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                        className="h-2 w-2 rounded-full"
                        style={{
                          background: "linear-gradient(135deg, var(--echo-lavender), var(--echo-sky))",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        {/* Footer */}
        <footer className="mt-8 flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/40 relative z-10">
          <p>© 2026 EchoExit Research</p>
          <div className="flex gap-4">
            <span className="cursor-help hover:text-indigo-400/60 transition-colors duration-300">Privacy</span>
            <span className="cursor-help hover:text-indigo-400/60 transition-colors duration-300">Safety Guide</span>
          </div>
        </footer>
      </div>

      <SettingsPanel open={isSettingsOpen && !secureMode} onOpenChange={setIsSettingsOpen} />
      {!secureMode && <PrivacyDialog />}
      <LockScreen isOpen={isLockActivated && !secureMode} onUnlock={() => setIsLockActivated(false)} />
    </div>
  );
}
