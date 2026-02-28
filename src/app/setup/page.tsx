"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Lock, Phone, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMounted } from "@/components/MountedGuard";

export default function SetupPage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const mounted = useMounted();

    const [settings, setSettings] = useState({
        emergencyNumber: "+917871411065",
        safeWord: "safety first",
        shortcutTrigger: "Control+Shift+L",
        safeUrl: "https://www.google.com/search?q=weather+update",
        autoCall: true,
        locationSharing: true,
        shakeDetection: true,
        ghostMode: false,
        psychologicalLock: false,
        emergencyMessage: "Emergency triggered. Please check on me.",
    });

    React.useEffect(() => {
        if (user?.safetySettings) {
            setSettings((prev) => ({ ...prev, ...user.safetySettings }));
        }
    }, [user]);

    if (!mounted) return null;

    const handleSave = () => {
        if (settings.locationSharing && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => { }, () => { });
        }
        updateUser({ safetySettings: settings });
        toast.success("Profile configured successfully.");
        router.push("/");
    };

    const ToggleCard = ({ label, description, checked, onChange }: {
        label: string;
        description: string;
        checked: boolean;
        onChange: (val: boolean) => void;
    }) => (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            className="flex items-center justify-between p-4 rounded-2xl transition-all cursor-default"
            style={{
                background: checked ? "rgba(129, 140, 248, 0.06)" : "rgba(255, 255, 255, 0.04)",
                border: `1px solid ${checked ? "rgba(129, 140, 248, 0.12)" : "rgba(255, 255, 255, 0.08)"}`,
            }}
        >
            <div className="space-y-1">
                <Label className="text-sm font-medium text-slate-700">{label}</Label>
                <p className="text-[10px] text-slate-400">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </motion.div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#fafbff" }}>
            {/* Background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
                    style={{ background: "rgba(196, 181, 253, 0.15)", filter: "blur(120px)" }}
                />
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                    className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
                    style={{ background: "rgba(125, 211, 252, 0.12)", filter: "blur(120px)" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl relative z-10"
            >
                <div
                    className="rounded-[2.5rem] p-8 md:p-10 overflow-hidden relative"
                    style={{
                        background: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(32px) saturate(200%)",
                        border: "1px solid rgba(255, 255, 255, 0.5)",
                        boxShadow: "0 24px 80px rgba(99, 102, 241, 0.06), inset 0 2px 4px rgba(255,255,255,0.5)",
                    }}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ y: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                            style={{
                                background: "linear-gradient(135deg, rgba(129,140,248,0.15), rgba(196,181,253,0.1))",
                                border: "1px solid rgba(129,140,248,0.15)",
                            }}
                        >
                            <Shield className="w-7 h-7 text-indigo-500" />
                        </motion.div>
                        <h1 className="text-3xl font-bold tracking-tight text-gradient-hero">Welcome to Echo</h1>
                        <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
                            A peaceful workspace. Let&apos;s configure your safety settings.
                        </p>
                    </div>

                    {/* Settings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <motion.div
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-5"
                        >
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-3">Primary Contacts</h3>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Trusted Contact
                                </Label>
                                <Input
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-xl transition-all h-11 text-sm"
                                    value={settings.emergencyNumber}
                                    onChange={(e) => setSettings({ ...settings, emergencyNumber: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Auto-Message
                                </Label>
                                <Textarea
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-xl transition-all min-h-[80px] text-sm"
                                    value={settings.emergencyMessage}
                                    onChange={(e) => setSettings({ ...settings, emergencyMessage: e.target.value })}
                                    placeholder="Message to send..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                    <Lock className="w-3.5 h-3.5 text-slate-400" /> Passphrase
                                </Label>
                                <Input
                                    className="bg-white/50 border-white/60 focus:bg-white rounded-xl transition-all h-11 text-sm"
                                    value={settings.safeWord}
                                    onChange={(e) => setSettings({ ...settings, safeWord: e.target.value })}
                                    placeholder="safety first"
                                />
                            </div>
                        </motion.div>

                        {/* Right Column */}
                        <motion.div
                            initial={{ opacity: 0, x: 12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-5"
                        >
                            <h3 className="text-[9px] font-bold uppercase tracking-[0.25em] text-indigo-400 mb-3">Preferences</h3>

                            <ToggleCard
                                label="Auto-Dial Protocol"
                                description="Initiate call intent"
                                checked={settings.autoCall}
                                onChange={(val) => setSettings({ ...settings, autoCall: val })}
                            />
                            <ToggleCard
                                label="Attach Location"
                                description="Include GPS context"
                                checked={settings.locationSharing}
                                onChange={(val) => setSettings({ ...settings, locationSharing: val })}
                            />
                            <ToggleCard
                                label="Motion Trigger"
                                description="Rapid shake detection"
                                checked={settings.shakeDetection}
                                onChange={(val) => setSettings({ ...settings, shakeDetection: val })}
                            />
                        </motion.div>
                    </div>

                    {/* Submit */}
                    <div className="mt-10">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all"
                            style={{
                                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                color: "#fff",
                                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
                            }}
                        >
                            Complete Setup
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
