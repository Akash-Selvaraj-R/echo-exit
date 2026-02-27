"use client";

import React from "react";
import { X, Shield, Phone, MessageCircle, ArrowRight, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/components/MountedGuard";

interface SettingsPanelProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const FloatingSection = ({ children, title, icon: Icon }: { children: React.ReactNode, title: string, icon: any }) => (
    <div className="p-6 rounded-[2.5rem] bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Icon className="w-4 h-4" />
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xl z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-3 right-3 bottom-3 w-full max-w-md glass-dark rounded-[3.5rem] z-[70] p-8 overflow-y-auto"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight">Vault Controls</h2>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Status: Active Security</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onOpenChange(false)}
                                className="rounded-2xl bg-white/5 text-white hover:bg-white/10 w-12 h-12"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* User Profile Summary */}
                        <div className="flex items-center gap-4 p-6 rounded-[2.5rem] bg-indigo-500/10 border border-white/5 mb-8">
                            <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                                {user.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-bold">{user.name}</p>
                                <p className="text-slate-400 text-xs">{user.email}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={logout} className="text-slate-500 hover:text-white transition-colors">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <FloatingSection title="Safety Trigger" icon={Shield}>
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-300 text-sm">Shake Detection</Label>
                                            <p className="text-[10px] text-slate-500 font-medium">Auto-trigger on movement</p>
                                        </div>
                                        <Switch
                                            checked={settings.shakeDetection}
                                            onCheckedChange={(val) => handleUpdate({ shakeDetection: val })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-300 text-sm">Location Beacon</Label>
                                            <p className="text-[10px] text-slate-500 font-medium">Attach GPS to alerts</p>
                                        </div>
                                        <Switch
                                            checked={settings.locationSharing}
                                            onCheckedChange={(val) => handleUpdate({ locationSharing: val })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-slate-300 text-sm">Auto-Dial Assistance</Label>
                                            <p className="text-[10px] text-slate-500 font-medium">Critical assistance protocol</p>
                                        </div>
                                        <Switch
                                            checked={settings.autoCall}
                                            onCheckedChange={(val) => handleUpdate({ autoCall: val })}
                                        />
                                    </div>
                                </div>
                            </FloatingSection>

                            <FloatingSection title="Trigger Configuration" icon={Zap}>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest pl-1 mb-2 block">Shortcut Trigger (Typing)</Label>
                                        <Input
                                            value={settings.shortcutTrigger || ""}
                                            onChange={(e) => handleUpdate({ shortcutTrigger: e.target.value })}
                                            placeholder="e.g. ShiftAltS"
                                            className="bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        />
                                        <p className="text-[9px] text-slate-600 px-1 mt-1">Combine keys like Shift, Alt, Control + a letter.</p>
                                    </div>
                                    <div>
                                        <Label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest pl-1 mb-2 block">Safety Keyword (Safe Word)</Label>
                                        <Input
                                            value={settings.safeWord || ""}
                                            onChange={(e) => handleUpdate({ safeWord: e.target.value })}
                                            placeholder="Enter safe word..."
                                            className="bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                </div>
                            </FloatingSection>

                            <FloatingSection title="Emergency Contact" icon={Phone}>
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest pl-1 mb-2 block">Recipient Number</Label>
                                        <Input
                                            value={settings.emergencyNumber || ""}
                                            onChange={(e) => handleUpdate({ emergencyNumber: e.target.value })}
                                            placeholder="+1 (555) 000-0000"
                                            className="bg-white/5 border-white/10 text-white rounded-2xl h-12 focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest pl-1 mb-2 block">Custom Emergency Message</Label>
                                        <Textarea
                                            value={settings.emergencyMessage || ""}
                                            onChange={(e) => handleUpdate({ emergencyMessage: e.target.value })}
                                            placeholder="Message to send..."
                                            className="bg-white/5 border-white/10 text-white rounded-2xl min-h-[80px] focus:border-indigo-500/50 transition-all placeholder:text-slate-600 p-4 text-sm"
                                        />
                                    </div>
                                </div>
                            </FloatingSection>
                        </div>

                        <div className="mt-12">
                            <p className="text-[10px] text-slate-600 text-center uppercase font-bold tracking-[0.2em]">EchoExit · Research Prototype v2.1</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
