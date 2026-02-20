"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSafety } from "@/context/SafetyContext";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import { useMounted } from "@/components/MountedGuard";

export const SettingsPanel: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
    open,
    onOpenChange,
}) => {
    const { user, updateUser, logout } = useAuth();
    const mounted = useMounted();

    // Safety check for user
    const settings = user?.safetySettings || {
        emergencyNumber: "",
        safeWord: "",
        safeUrl: "",
        autoCall: false,
        locationSharing: false,
        shakeDetection: false,
        ghostMode: false,
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
            <DialogContent className="sm:max-w-[500px] glass border-none">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Workspace Settings
                    </DialogTitle>
                    <DialogDescription>
                        Manage your local research profile and security triggers.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto px-1">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                            Log Out
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Response</Label>
                            <div className="grid gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-semibold">Emergency Number</Label>
                                    <Input
                                        value={settings.emergencyNumber}
                                        onChange={(e) => handleUpdate({ emergencyNumber: e.target.value })}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-sm font-semibold">Safe Redirect URL</Label>
                                    <Input
                                        value={settings.safeUrl}
                                        onChange={(e) => handleUpdate({ safeUrl: e.target.value })}
                                        placeholder="https://google.com"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold">Auto-Dial Call</Label>
                                    <Switch checked={settings.autoCall} onCheckedChange={(v: boolean) => handleUpdate({ autoCall: v })} />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Hidden Triggers</Label>
                            <div className="grid gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="grid gap-2">
                                    <Label className="text-sm font-semibold">Safe Word</Label>
                                    <Input
                                        value={settings.safeWord}
                                        onChange={(e) => handleUpdate({ safeWord: e.target.value })}
                                        placeholder="exit now"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold">Mobile Shake Detection</Label>
                                        <p className="text-[10px] text-slate-500">Trigger on rapid movement</p>
                                    </div>
                                    <Switch checked={settings.shakeDetection} onCheckedChange={(v: boolean) => handleUpdate({ shakeDetection: v })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-semibold">Ghost Mode</Label>
                                        <p className="text-[10px] text-slate-500">Silence all visual indicators</p>
                                    </div>
                                    <Switch checked={settings.ghostMode} onCheckedChange={(v: boolean) => handleUpdate({ ghostMode: v })} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-4">
                    <Button variant="secondary" className="w-full" onClick={() => onOpenChange(false)}>Close Workspace Settings</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
