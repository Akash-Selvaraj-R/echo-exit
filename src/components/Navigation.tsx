"use client";

import React, { useRef, useState } from "react";
import { Shield, Notebook, Calculator, Calendar, Settings, LayoutDashboard } from "lucide-react";
import { useMultiClickTrigger } from "@/hooks/useTriggers";
import { useEmergencyTrigger } from "@/hooks/useEmergencyTrigger";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { useMounted } from "@/components/MountedGuard";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

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
        
        // Limited pull effect
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;
        
        x.set(distanceX * 0.35);
        y.set(distanceY * 0.35);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            title={title}
            style={{ x: springX, y: springY }}
            className={cn(
                "relative w-12 h-12 flex items-center justify-center rounded-2xl transition-colors duration-300",
                active 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20 active-nav" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
            )}
        >
            {children}
            {active && (
                <motion.div 
                    layoutId="magnetic-glow"
                    className="absolute inset-0 bg-primary/10 rounded-2xl -z-10 blur-xl"
                />
            )}
        </motion.button>
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
            className="fixed top-1/2 -translate-y-1/2 left-6 h-fit max-h-[80vh] w-20 flex flex-col items-center py-6 gap-6 glass rounded-[2.5rem] z-50 overflow-visible"
        >
            {/* Logo Section */}
            <div
                ref={logoRef}
                className="relative group cursor-pointer"
                title="EchoExit - Magnetic Safety"
            >
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-linear-to-br from-slate-900 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/20"
                >
                    <Shield className="text-white w-6 h-6" />
                </motion.div>
                <div className="absolute -inset-2 bg-slate-900/5 rounded-3xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Main Navigation Items */}
            <div className="flex flex-col gap-3">
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
            <div className="w-8 h-px bg-slate-200/50" />

            {/* Footer Items */}
            <div className="flex flex-col gap-3 mt-auto">
                <MagneticButton
                    onClick={onOpenSettings}
                    title="Settings"
                >
                    <Settings className="w-5 h-5" />
                </MagneticButton>

                {user && (
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-blue-50 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-white/50 shadow-sm"
                    >
                        {user.name?.[0]?.toUpperCase() || "U"}
                    </motion.div>
                )}
            </div>
        </motion.nav>
    );
};

