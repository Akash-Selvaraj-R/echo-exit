"use client";

import React from "react";
import { X, Shield, Phone, MessageCircle, Zap, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/components/MountedGuard";

interface SettingsPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FloatingSection = ({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: React.ElementType }) => (
    <div
        className="p-6 rounded-[2rem] mb-4"
        style={{
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
        }}
    >
        <div className="flex items-center gap-3 mb-5">
            <div
                className="p-2 rounded-xl"
                style={{
                    background: "linear-gradient(135deg, rgba(129, 140, 248, 0.2), rgba(99, 102, 241, 0.15))",
                }}
            >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-400">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SettingRow = ({ label, description, children }: { label: string; description: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between">
        <div className="space-y-0.5">
            <Label className="text-slate-300 text-sm">{label}</Label>
            <p className="text-[9px] text-slate-500 font-medium">{description}</p>
        </div>
        {children}
    </div>
);

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ open, onOpenChange }) => {
    const { user, updateUser, logout } = useAuth();
    const mounted = useMounted();

    if (!mounted || !user) return null;

    const settings = user.safetySettings;

    const handleUpdate = (updates: Partial<typeof settings>) => {
        updateUser({
            safetySettings: { ...settings, ...updates },
        });
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 z-[60]"
                        style={{
                            background: "rgba(10, 10, 30, 0.5)",
                            backdropFilter: "blur(20px)",
                        }}
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-3 right-3 bottom-3 w-full max-w-md rounded-[3rem] z-[70] p-8 overflow-y-auto"
                        style={{
                            background: "rgba(10, 10, 30, 0.7)",
                            backdropFilter: "blur(32px) saturate(180%)",
                            border: "1px solid rgba(255, 255, 255, 0.06)",
                            boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.04), 0 0 100px rgba(99,102,241,0.03)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Vault Controls</h2>
                                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-400/60 mt-1">Status: Active Security</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onOpenChange(false)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                }}
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </motion.button>
                        </div>

                        {/* User Profile */}
                        <div
                            className="flex items-center gap-4 p-5 rounded-[2rem] mb-8"
                            style={{
                                background: "rgba(129, 140, 248, 0.06)",
                                border: "1px solid rgba(129, 140, 248, 0.1)",
                            }}
                        >
                            <div
                                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
                                }}
                            >
                                {user.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold truncate">{user.name}</p>
                                <p className="text-slate-500 text-xs truncate">{user.email}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={logout}
                                className="text-slate-500 hover:text-rose-400 transition-colors p-2"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>

                        <div className="space-y-3">
                            <FloatingSection title="Safety Triggers" icon={Shield}>
                                <SettingRow label="Shake Detection" description="Auto-trigger on movement">
                                    <Switch checked={settings.shakeDetection} onCheckedChange={(val) => handleUpdate({ shakeDetection: val })} />
                                </SettingRow>
                                <SettingRow label="Location Beacon" description="Attach GPS to alerts">
                                    <Switch checked={settings.locationSharing} onCheckedChange={(val) => handleUpdate({ locationSharing: val })} />
                                </SettingRow>
                                <SettingRow label="Auto-Dial Assistance" description="Critical assistance protocol">
                                    <Switch checked={settings.autoCall} onCheckedChange={(val) => handleUpdate({ autoCall: val })} />
                                </SettingRow>
                            </FloatingSection>

                            <FloatingSection title="Trigger Configuration" icon={Zap}>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] pl-1 mb-2 block">Shortcut Trigger</Label>
                                        <Input
                                            value={settings.shortcutTrigger || ""}
                                            onChange={(e) => handleUpdate({ shortcutTrigger: e.target.value })}
                                            placeholder="e.g. ShiftAltS"
                                            className="bg-white/5 border-white/8 text-white rounded-xl h-11 focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] pl-1 mb-2 block">Safety Keyword</Label>
                                        <Input
                                            value={settings.safeWord || ""}
                                            onChange={(e) => handleUpdate({ safeWord: e.target.value })}
                                            placeholder="Enter safe word..."
                                            className="bg-white/5 border-white/8 text-white rounded-xl h-11 focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                        />
                                    </div>
                                </div>
                            </FloatingSection>

                            <FloatingSection title="Emergency Contact" icon={Phone}>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] pl-1 mb-2 block">Recipient Number</Label>
                                        <Input
                                            value={settings.emergencyNumber || ""}
                                            onChange={(e) => handleUpdate({ emergencyNumber: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-white/5 border-white/8 text-white rounded-xl h-11 focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em] pl-1 mb-2 block">Emergency Message</Label>
                                        <Textarea
                                            value={settings.emergencyMessage || ""}
                                            onChange={(e) => handleUpdate({ emergencyMessage: e.target.value })}
                                            placeholder="Message to send..."
                                            className="bg-white/5 border-white/8 text-white rounded-xl min-h-[80px] focus:border-indigo-500/40 transition-all placeholder:text-slate-600 p-3 text-sm"
                                        />
                                    </div>
                                </div>
                            </FloatingSection>
                        </div>

                        <div className="mt-12">
                            <p className="text-[9px] text-slate-600 text-center uppercase font-bold tracking-[0.25em]">EchoExit · Research Prototype v2.1</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
