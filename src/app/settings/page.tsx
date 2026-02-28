"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useMounted } from "@/components/MountedGuard";
import { Shield, Bell, User, Layout, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const mounted = useMounted();
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    if (!mounted || isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050714]">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
        );
    }

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg shadow-indigo-500/5">
                <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
                <p className="text-slate-500 text-xs">{description}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050714] relative overflow-hidden">
            {/* Animated Mesh Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(129,140,248,0.08),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(196,181,253,0.08),transparent_50%)]" />
            </div>

            <Navigation
                activeMode="settings"
                setActiveMode={() => { }}
                onOpenSettings={() => setIsPanelOpen(true)}
            />

            <main className="pt-28 pb-12 px-6 max-w-5xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <button
                        onClick={() => router.push('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest mb-6 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-gradient-hero mb-2">Vault Settings</h1>
                    <p className="text-slate-500 text-sm">Manage your account identity and safety protocols.</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Account Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="glass-panel p-8 rounded-[2.5rem]">
                            <SectionHeader
                                icon={User}
                                title="Account Profile"
                                description="Your identity within the EchoExit collective."
                            />

                            <div className="space-y-6 pt-2">
                                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Full Name</span>
                                    <span className="text-white font-medium">{user.name}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Safe Email</span>
                                    <span className="text-white font-medium">{user.email}</span>
                                </div>
                                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Session ID</span>
                                    <span className="text-white/50 font-mono text-xs">{user.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem]">
                            <SectionHeader
                                icon={Layout}
                                title="Interface Preferences"
                                description="Adjust the visual emotional response."
                            />
                            <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-white mb-1">Gen-Z Aesthetic Mode</p>
                                    <p className="text-xs text-slate-500">Enable soft glowing gradients and glassmorphism.</p>
                                </div>
                                <div className="w-12 h-6 rounded-full bg-indigo-500 relative shadow-[0_0_12px_rgba(99,102,241,0.5)]">
                                    <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Access Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        <div className="glass-panel p-8 rounded-[2.5rem] bg-indigo-500/[0.03]">
                            <SectionHeader
                                icon={Shield}
                                title="Safety Vault"
                                description="Emergency triggers."
                            />
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                                Access the side panel to configure shake detection, safe words, and emergency auto-messages.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsPanelOpen(true)}
                                className="w-full py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg"
                                style={{
                                    background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                    color: "#fff",
                                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
                                }}
                            >
                                Open Vault Controls
                            </motion.button>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem]">
                            <SectionHeader
                                icon={Bell}
                                title="Notifications"
                                description="System alert status."
                            />
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-500/5 border border-green-500/10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Active Security</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <SettingsPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} />
        </div>
    );
}
