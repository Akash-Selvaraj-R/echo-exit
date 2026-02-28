"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Notebook, Calendar, Activity, Clock, Plus, Zap, Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSafety } from "@/context/SafetyContext";

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    }),
};

const TiltCard = ({ children, className, index }: { children: React.ReactNode; className?: string; index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX / rect.width - 0.5 - rect.left / rect.width);
        y.set(e.clientY / rect.height - 0.5 - rect.top / rect.height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                x.set(mouseX / rect.width - 0.5);
                y.set(mouseY / rect.height - 0.5);
            }}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`group relative overflow-hidden transition-all duration-300 ease-out hover:brightness-[1.02] ${className}`}
            whileHover={{ scale: 1.01 }}
        >
            {/* Dynamic Glare */}
            <motion.div
                style={{ left: glareX, top: glareY }}
                className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-white/10 via-white/5 to-transparent pointer-events-none rounded-full translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50 mix-blend-overlay"
            />

            <div style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                {children}
            </div>
        </motion.div>
    );
};

const ProgressRing = ({ progress, color = "#818cf8" }: { progress: number; color?: string }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-200/30" />
                <motion.circle
                    cx="40" cy="40" r={radius} stroke={color} strokeWidth="3.5" fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                />
            </svg>
            <span className="absolute text-xs font-bold text-slate-600">{progress}%</span>
            {/* Glow behind ring */}
            <div className="absolute inset-0 rounded-full -z-10" style={{ background: `${color}15`, filter: "blur(12px)" }} />
        </div>
    );
};

export const DashboardView: React.FC = () => {
    const { user } = useAuth();
    const { isTriggered } = useSafety();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = time.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

    const safetySettings = user?.safetySettings;
    const configuredItems = [
        safetySettings?.emergencyNumber,
        safetySettings?.autoCall,
        safetySettings?.locationSharing,
        safetySettings?.shakeDetection,
    ].filter(Boolean);

    const healthScore = Math.min(100, configuredItems.length * 25);

    const getGreeting = () => {
        const h = time.getHours();
        if (h < 6) return "Late night";
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        if (h < 21) return "Good evening";
        return "Good night";
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
            >
                <h1 className="text-5xl font-bold tracking-tight text-slate-800 mb-4 leading-[1.1]">
                    {getGreeting()},{" "}
                    <span className="text-gradient-hero">{user?.name?.split(" ")[0]}.</span>
                    <br />
                    <span className="text-gradient">Your space is ready.</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed">
                    A calm corner of the internet, designed just for you. Focus, create, and feel safe.
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <TiltCard
                    index={0}
                    className="p-8 rounded-[2.5rem]"
                >
                    <div
                        className="absolute inset-0 rounded-[2.5rem]"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div
                                className="p-3.5 rounded-2xl"
                                style={{
                                    background: "linear-gradient(135deg, rgba(196, 181, 253, 0.2), rgba(129, 140, 248, 0.15))",
                                    border: "1px solid rgba(196, 181, 253, 0.2)",
                                }}
                            >
                                <Shield className="w-5 h-5 text-indigo-400" />
                            </div>
                            <ProgressRing progress={healthScore} color="#818cf8" />
                        </div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Safety Score</h3>
                        <p className="text-xl font-bold text-slate-700">
                            {healthScore === 100 ? "Fully Protected" : "Needs Attention"}
                        </p>
                    </div>
                    {/* Ambient glow */}
                    <div className="absolute bottom-[-15%] right-[-15%] w-40 h-40 rounded-full -z-10" style={{ background: "rgba(129, 140, 248, 0.06)", filter: "blur(40px)" }} />
                </TiltCard>

                <TiltCard
                    index={1}
                    className="p-8 rounded-[2.5rem]"
                >
                    <div
                        className="absolute inset-0 rounded-[2.5rem]"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div
                                className="p-3.5 rounded-2xl"
                                style={{
                                    background: "linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(16, 185, 129, 0.1))",
                                    border: "1px solid rgba(52, 211, 153, 0.15)",
                                }}
                            >
                                <Activity className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div
                                className="flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-bold tracking-widest"
                                style={{
                                    background: "rgba(52, 211, 153, 0.1)",
                                    border: "1px solid rgba(52, 211, 153, 0.15)",
                                    color: "#059669",
                                }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.4, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                />
                                LIVE
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">System Status</h3>
                        <p className="text-xl font-bold text-slate-700">All Systems Go</p>
                    </div>
                </TiltCard>

                <TiltCard
                    index={2}
                    className="p-8 rounded-[2.5rem]"
                >
                    <div
                        className="absolute inset-0 rounded-[2.5rem]"
                        style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                        }}
                    />
                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div
                                className="p-3.5 rounded-2xl"
                                style={{
                                    background: "linear-gradient(135deg, rgba(125, 211, 252, 0.15), rgba(56, 189, 248, 0.1))",
                                    border: "1px solid rgba(125, 211, 252, 0.15)",
                                }}
                            >
                                <Clock className="w-5 h-5 text-sky-400" />
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Current Time</h3>
                        <p className="text-xl font-bold text-slate-700">{timeStr}</p>
                        <p className="text-xs text-slate-400 mt-1">{dateStr}</p>
                    </div>
                </TiltCard>
            </div>

            {/* Safety Config + New Note */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="lg:col-span-3 p-10 rounded-[3rem] relative overflow-hidden group"
                    style={{
                        background: "rgba(255, 255, 255, 0.14)",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-2 h-2 rounded-full"
                                    style={{ background: "linear-gradient(135deg, var(--echo-lavender), var(--echo-indigo))" }}
                                />
                                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-400">Quick Configuration</span>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-700 mb-6">
                                Setup your safety <br />
                                <span className="text-gradient">bubble in seconds.</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Contact", icon: "📞", active: !!safetySettings?.emergencyNumber },
                                { label: "Location", icon: "📍", active: !!safetySettings?.locationSharing },
                                { label: "Shake", icon: "📳", active: !!safetySettings?.shakeDetection },
                                { label: "Safe Word", icon: "🔑", active: !!safetySettings?.safeWord },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="px-4 py-3 rounded-2xl flex items-center gap-3 cursor-default transition-colors"
                                    style={{
                                        background: item.active
                                            ? "rgba(129, 140, 248, 0.1)"
                                            : "rgba(255, 255, 255, 0.08)",
                                        border: `1px solid ${item.active ? "rgba(129, 140, 248, 0.2)" : "rgba(255, 255, 255, 0.15)"}`,
                                        color: item.active ? "#6366f1" : "#94a3b8",
                                    }}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Background blob */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full group-hover:scale-125 transition-transform duration-1000 -z-10"
                        style={{ background: "rgba(196, 181, 253, 0.08)", filter: "blur(60px)" }}
                    />
                </motion.div>

                <motion.div
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="lg:col-span-2 p-10 rounded-[3rem] relative overflow-hidden group"
                    style={{
                        background: "linear-gradient(135deg, rgba(30, 27, 75, 0.9), rgba(49, 46, 129, 0.85))",
                        backdropFilter: "blur(24px)",
                        border: "1px solid rgba(129, 140, 248, 0.15)",
                        boxShadow: "0 20px 60px rgba(30, 27, 75, 0.3)",
                    }}
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            <Plus className="w-5 h-5 text-white/80" />
                        </motion.div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Create New Note</h3>
                            <p className="text-indigo-200/60 text-sm mb-8">Capture ideas instantly in your secure vault.</p>
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all"
                                style={{
                                    background: "linear-gradient(135deg, #fff, #e0e7ff)",
                                    color: "#1e1b4b",
                                    boxShadow: "0 8px 24px rgba(255, 255, 255, 0.15)",
                                }}
                            >
                                Start Writing
                            </motion.button>
                        </div>
                    </div>

                    {/* Gradient accent */}
                    <div
                        className="absolute top-0 right-0 w-40 h-40 rounded-full -z-10"
                        style={{ background: "rgba(129, 140, 248, 0.15)", filter: "blur(50px)" }}
                    />
                </motion.div>
            </div>
        </div>
    );
};
