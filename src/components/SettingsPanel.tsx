"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { useMounted } from "@/components/MountedGuard";
import { Settings, LogOut, Shield, MapPin, Phone } from "lucide-react";

export const SettingsPanel: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
    open,
    onOpenChange,
}) => {
    const { user, updateUser, logout } = useAuth();
    const mounted = useMounted();

    const settings = user?.safetySettings || {
        emergencyNumber: "",
        safeWord: "",
        safeUrl: "",
        autoCall: false,
        locationSharing: false,
        shakeDetection: false,
        ghostMode: false,
        psychologicalLock: false,
        emergencyMessage: "Emergency triggered. Please check on me.",
    };

    if (!mounted) return null;

    const handleUpdate = (updates: Partial<typeof settings>) => {
        if (!user) return;
        updateUser({
            safetySettings: { ...settings, ...updates },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-none shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-3xl overflow-hidden p-0">
                <div className="p-6 pb-2">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
                            <Settings className="w-5 h-5 text-slate-400" /> Preferences
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500">
                            Configure your workspace and safety fallbacks.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-6">
                    {/* User profile tiny bar */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 font-bold text-sm">
                            {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-3">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">Contacts & Messages</Label>
                            <div className="space-y-4 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Primary Contact</Label>
                                    <Input
                                        className="bg-slate-50 border-slate-100 focus:bg-white rounded-xl"
                                        value={settings.emergencyNumber}
                                        onChange={(e) => handleUpdate({ emergencyNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-slate-700">Auto-Message Format</Label>
                                    <Textarea
                                        className="bg-slate-50 border-slate-100 focus:bg-white rounded-xl min-h-[60px] text-sm resize-none"
                                        value={settings.emergencyMessage || ""}
                                        onChange={(e) => handleUpdate({ emergencyMessage: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">Action Triggers</Label>
                            <div className="space-y-3 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-black shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-slate-700">Auto-Dial Protocol</Label>
                                        <p className="text-[11px] text-slate-400">Call immediately</p>
                                    </div>
                                    <Switch checked={settings.autoCall} onCheckedChange={(v: boolean) => handleUpdate({ autoCall: v })} />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-slate-700">Device Motion</Label>
                                        <p className="text-[11px] text-slate-400">Shake to trigger</p>
                                    </div>
                                    <Switch checked={settings.shakeDetection} onCheckedChange={(v: boolean) => handleUpdate({ shakeDetection: v })} />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-medium text-slate-700">Attach Location</Label>
                                        <p className="text-[11px] text-slate-400">Include GPS coordinate</p>
                                    </div>
                                    <Switch checked={settings.locationSharing} onCheckedChange={(v: boolean) => handleUpdate({ locationSharing: v })} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
