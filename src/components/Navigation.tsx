"use client";

import React, { useRef, useState } from "react";
import { Shield, Notebook, Calculator, Calendar, Settings, LayoutDashboard } from "lucide-react";
import { useMultiClickTrigger } from "@/hooks/useTriggers";
import { useEmergencyTrigger } from "@/hooks/useEmergencyTrigger";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useMounted } from "@/components/MountedGuard";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface NavigationProps {
    activeMode: string;
    setActiveMode: (mode: string) => void;
    onOpenSettings: () => void;
}

const MagneticButton = ({ children, onClick, active, title }: {
    children: React.ReactNode,
    onClick: () => void,
    active?: boolean,
    title: string
}) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        x.set((clientX - centerX) * 0.35);
        y.set((clientY - centerY) * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <div className="relative group">
            <motion.button
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                onClick={onClick}
                title={title}
                style={{ x: springX, y: springY }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ease-out overflow-hidden group/btn",
                    active
                        ? "bg-gradient-to-br from-indigo-400/20 to-violet-400/20 text-indigo-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),0_8px_24px_rgba(99,102,241,0.15)] ring-1 ring-indigo-300/40"
                        : "text-slate-400 hover:text-indigo-500 hover:bg-white/20 hover:shadow-[0_4px_16px_rgba(99,102,241,0.08)]"
                )}
            >
                {/* Animated hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-400/0 via-white/20 to-violet-400/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 transition-transform duration-300 group-hover/btn:scale-110">
                    {children}
                </div>

                {/* Active indicator — animated gradient bar */}
                {active && (
                    <motion.div
                        layoutId="nav-active-glow"
                        className="absolute inset-x-1 bottom-0.5 h-0.5 rounded-full z-0"
                        style={{
                            background: "linear-gradient(90deg, var(--echo-lavender), var(--echo-sky), var(--echo-cyan))",
                        }}
                        transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    />
                )}
            </motion.button>

            {/* Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, x: -8, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -8, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap backdrop-blur-xl shadow-xl z-[100]"
                    >
                        {title}
                        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900/90 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Navigation: React.FC<NavigationProps> = ({ activeMode, setActiveMode, onOpenSettings }) => {
    const logoRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const mounted = useMounted();
    const { trigger } = useEmergencyTrigger();

    useMultiClickTrigger(logoRef, trigger);

    if (!mounted) return null;

    const items = [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { id: "notes", icon: Notebook, label: "Notes" },
        { id: "calc", icon: Calculator, label: "Calculator" },
        { id: "timetable", icon: Calendar, label: "Schedule" },
    ];

    return (
        <motion.nav
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-1/2 -translate-y-1/2 left-5 h-fit max-h-[80vh] w-20 flex flex-col items-center py-6 gap-5 rounded-[2.5rem] z-50 overflow-visible"
            style={{
                background: "rgba(255, 255, 255, 0.12)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.3), 0 12px 40px rgba(99, 102, 241, 0.06), 0 0 80px rgba(196, 181, 253, 0.04)",
            }}
        >
            {/* Logo */}
            <div
                ref={logoRef}
                className="relative group cursor-pointer"
                title="EchoExit — Your Safe Space"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #818cf8, #6366f1, #4f46e5)",
                        boxShadow: "0 8px 24px rgba(99, 102, 241, 0.35)",
                    }}
                >
                    <Shield className="text-white w-5 h-5 relative z-10" />
                    {/* Inner shimmer */}
                    <div className="absolute inset-0 animate-shimmer opacity-30" />
                </motion.div>
                {/* Logo glow */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute -inset-3 bg-indigo-500/15 rounded-3xl blur-xl -z-10"
                />
            </div>

            {/* Main Navigation Items */}
            <div className="flex flex-col gap-2">
                {items.map((item) => (
                    <MagneticButton
                        key={item.id}
                        onClick={() => setActiveMode(item.id)}
                        active={activeMode === item.id}
                        title={item.label}
                    >
                        <item.icon className="w-5 h-5" />
                    </MagneticButton>
                ))}
            </div>

            {/* Separator */}
            <div
                className="w-8 h-px rounded-full"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(196, 181, 253, 0.3), transparent)",
                }}
            />

            {/* Footer Items */}
            <div className="flex flex-col gap-2 mt-auto">
                <MagneticButton
                    onClick={onOpenSettings}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </MagneticButton>

                {user && (
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/30 shadow-md cursor-pointer"
                        style={{
                            background: "linear-gradient(135deg, var(--echo-lavender), var(--echo-indigo))",
                        }}
                    >
                        {user.name?.[0]?.toUpperCase() || "U"}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};
