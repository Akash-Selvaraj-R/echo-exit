"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Shield, Lock, Phone, Globe, MapPin } from "lucide-react";
import { toast } from "sonner";

import { useMounted } from "@/components/MountedGuard";

export default function SetupPage() {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const mounted = useMounted();

    const [settings, setSettings] = useState({
        emergencyNumber: "+917871411065",
        safeWord: "safety first",
        safeUrl: "https://www.google.com/search?q=weather+update",
        autoCall: true,
        locationSharing: true,
        shakeDetection: true,
        ghostMode: false,
    });

    // Sync settings once user is loaded
    React.useEffect(() => {
        if (user?.safetySettings) {
            setSettings(user.safetySettings);
        }
    }, [user]);

    if (!mounted) return null;

    const handleSave = () => {
        updateUser({ safetySettings: settings });
        toast.success("Security profile configured!");
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
            <Card className="w-full max-w-2xl border-none shadow-xl glass">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-6 h-6 text-slate-900 dark:text-white" />
                        <CardTitle className="text-2xl font-bold">Workspace Configuration</CardTitle>
                    </div>
                    <CardDescription>
                        Configure your privacy and security layer. All data is stored locally on this device.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" /> Trusted Contact
                                </Label>
                                <Input
                                    value={settings.emergencyNumber}
                                    onChange={(e) => setSettings({ ...settings, emergencyNumber: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" /> Security Phrase
                                </Label>
                                <Input
                                    value={settings.safeWord}
                                    onChange={(e) => setSettings({ ...settings, safeWord: e.target.value })}
                                    placeholder="safety first"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" /> Recovery URL
                                </Label>
                                <Input
                                    value={settings.safeUrl}
                                    onChange={(e) => setSettings({ ...settings, safeUrl: e.target.value })}
                                    placeholder="https://google.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Auto-Dial Protocol</Label>
                                    <p className="text-xs text-slate-500 italic">Initiate call on trigger</p>
                                </div>
                                <Switch
                                    checked={settings.autoCall}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, autoCall: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Location Sharing
                                    </Label>
                                    <p className="text-xs text-slate-500 italic">Capture GPS context</p>
                                </div>
                                <Switch
                                    checked={settings.locationSharing}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, locationSharing: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-medium">Motion Detection</Label>
                                    <p className="text-xs text-slate-500 italic">Shake-to-trigger</p>
                                </div>
                                <Switch
                                    checked={settings.shakeDetection}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, shakeDetection: val })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500">
                        <strong>Privacy Notice:</strong> This research prototype uses standard browser APIs for safety simulation. Your data never leaves your terminal.
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full" onClick={handleSave}>Initialize Workspace</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
