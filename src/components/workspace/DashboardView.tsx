"use client";

import React, { useState } from "react";
import { motion, Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Shield, Notebook, Calendar, BarChart2, Activity, Clock, AlertCircle, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSafety } from "@/context/SafetyContext";

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    }),
};

const TiltCard = ({ children, className, index }: { children: React.ReactNode, className?: string, index: number }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["100%", "0%"]);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["100%", "0%"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
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
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={`glass group relative ${className} overflow-hidden transition-all duration-300 ease-out hover:brightness-[1.02]`}
        >
            {/* Dynamic Glare Effect */}
            <motion.div
                style={{
                    left: glareX,
                    top: glareY,
                }}
                className="absolute w-[200%] h-[200%] bg-gradient-to-tr from-white/10 via-white/5 to-transparent pointer-events-none rounded-full translate-x-[-50%] translate-y-[-50%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-50 mix-blend-overlay"
            />

            <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
                {children}
            </div>
        </motion.div>
    );
};

const ProgressRing = ({ progress }: { progress: number }) => {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-slate-200/50"
                />
                <motion.circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-indigo-500"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <span className="absolute text-xs font-bold text-slate-700">{progress}%</span>
            <div className={`absolute inset-0 bg-indigo-500/10 blur-xl rounded-full -z-10`} />
        </div>
    );
};

export const DashboardView: React.FC = () => {
    const { user } = useAuth();
    const { isTriggered } = useSafety();

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });

    const safetySettings = user?.safetySettings;
    const configuredItems = [
        safetySettings?.emergencyNumber,
        safetySettings?.autoCall,
        safetySettings?.locationSharing,
        safetySettings?.shakeDetection,
    ].filter(Boolean);

    const healthScore = Math.min(100, configuredItems.length * 25);

    return (
        <div className="space-y-10 pb-20">
            {/* Hero Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
            >
                <h1 className="text-5xl font-bold tracking-tight text-slate-800 mb-4 leading-[1.1]">
                    Focus on what <br />
                    <span className="text-gradient">actually matters.</span>
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                    Good {now.getHours() < 12 ? "morning" : "day"}, {user?.name?.split(" ")[0]}. Your safe workspace is active and ready for your next big idea.
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TiltCard index={0} className="p-8 rounded-[3rem] overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-4 rounded-3xl bg-indigo-50 border border-indigo-100/50">
                            <Shield className="w-6 h-6 text-indigo-500" />
                        </div>
                        <ProgressRing progress={healthScore} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Safety Score</h3>
                        <p className="text-2xl font-bold text-slate-800">
                            {healthScore === 100 ? "Highly Protected" : "Partial Guard"}
                        </p>
                    </div>
                    <motion.div
                        className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"
                    />
                </TiltCard>

                <TiltCard index={1} className="p-8 rounded-[3rem] overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100/50">
                            <Activity className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                            LIVE_LINK
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">System Status</h3>
                        <p className="text-2xl font-bold text-slate-800">Normal Operation</p>
                    </div>
                </TiltCard>

                <TiltCard index={2} className="p-8 rounded-[3rem] overflow-hidden">
                    <div className="flex items-start justify-between mb-8">
                        <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100/50">
                            <Clock className="w-6 h-6 text-slate-500" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-1">Current Time</h3>
                        <p className="text-2xl font-bold text-slate-800">{timeStr}</p>
                        <p className="text-xs text-slate-400 mt-1">{dateStr}</p>
                    </div>
                </TiltCard>
            </div>

            {/* Middle Section: Widgets & Interaction */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <motion.div
                    custom={3}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="lg:col-span-3 glass p-10 rounded-[4rem] relative overflow-hidden group"
                >
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Quick Configuration</span>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">Setup your safety <br />bubble in seconds.</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Contact", icon: "📞", active: !!safetySettings?.emergencyNumber },
                                { label: "Location", icon: "📍", active: !!safetySettings?.locationSharing },
                                { label: "Shake", icon: "📳", active: !!safetySettings?.shakeDetection },
                                { label: "Safe Word", icon: "🔑", active: !!safetySettings?.safeWord },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`px-4 py-3 rounded-3xl border flex items-center gap-3 transition-colors ${item.active ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 'bg-white/50 border-white/50 text-slate-400'
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100/30 blur-[80px] rounded-full group-hover:scale-125 transition-transform duration-1000" />
                </motion.div>

                <motion.div
                    custom={4}
                    initial="hidden"
                    animate="visible"
                    variants={cardVariants}
                    className="lg:col-span-2 glass p-10 rounded-[4rem] relative overflow-hidden bg-slate-900 group"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 border border-white/10">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2">Create New Note</h3>
                            <p className="text-slate-400 text-sm mb-6">Capture ideas instantly in your secure vault.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-4 rounded-3xl bg-white text-slate-900 font-bold text-sm tracking-widest uppercase"
                            >
                                Start Writing
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

