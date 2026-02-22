"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Shield, Lock, Phone, Globe, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea"

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
        psychologicalLock: false,
        emergencyMessage: "Emergency triggered. Please check on me.",
    });

    // Sync settings once user is loaded
    React.useEffect(() => {
        if (user?.safetySettings) {
            setSettings({ ...settings, ...user.safetySettings });
        }
    }, [user]);

    if (!mounted) return null;

    const handleSave = () => {
        // Request geolocation permission explicitly during setup
        if (settings.locationSharing && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(() => { }, () => { });
        }
        updateUser({ safetySettings: settings });
        toast.success("Profile configured successfully.");
        router.push("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50/80 dark:bg-slate-950 p-6 selection:bg-blue-100">
            <Card className="w-full max-w-2xl border border-slate-100 dark:border-slate-800 shadow-xl bg-white/90 backdrop-blur-xl rounded-[2rem]">
                <CardHeader className="text-center pt-10 pb-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                            <Shield className="w-7 h-7 text-blue-500" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-semibold text-slate-800 dark:text-slate-100 tracking-tight">Welcome to Echo</CardTitle>
                    <CardDescription className="text-base text-slate-500 max-w-sm mx-auto">
                        A peaceful workspace. Let's configure your default settings.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Contacts</h3>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Phone className="w-4 h-4 text-slate-400" /> Trusted Contact
                                </Label>
                                <Input
                                    className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl transition-colors"
                                    value={settings.emergencyNumber}
                                    onChange={(e) => setSettings({ ...settings, emergencyNumber: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                                    <MessageSquare className="w-4 h-4 text-slate-400" /> Auto-Message Format
                                </Label>
                                <Textarea
                                    className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl transition-colors min-h-[80px] text-sm"
                                    value={settings.emergencyMessage}
                                    onChange={(e) => setSettings({ ...settings, emergencyMessage: e.target.value })}
                                    placeholder="Message to send..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Lock className="w-4 h-4 text-slate-400" /> Passphrase
                                </Label>
                                <Input
                                    className="bg-slate-50 border-slate-200 focus:bg-white rounded-xl transition-colors"
                                    value={settings.safeWord}
                                    onChange={(e) => setSettings({ ...settings, safeWord: e.target.value })}
                                    placeholder="safety first"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Preferences</h3>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 transition-colors hover:bg-slate-100/50">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-slate-700">Auto-Dial Protocol</Label>
                                    <p className="text-[11px] text-slate-400">Initiate call intent</p>
                                </div>
                                <Switch
                                    checked={settings.autoCall}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, autoCall: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 transition-colors hover:bg-slate-100/50">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> Attach Location
                                    </Label>
                                    <p className="text-[11px] text-slate-400">Include GPS context</p>
                                </div>
                                <Switch
                                    checked={settings.locationSharing}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, locationSharing: val })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 transition-colors hover:bg-slate-100/50">
                                <div className="space-y-1">
                                    <Label className="text-sm font-medium text-slate-700">Motion Trigger</Label>
                                    <p className="text-[11px] text-slate-400">Rapid shake detection</p>
                                </div>
                                <Switch
                                    checked={settings.shakeDetection}
                                    onCheckedChange={(val: boolean) => setSettings({ ...settings, shakeDetection: val })}
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="px-8 pb-10 pt-4">
                    <Button
                        size="lg"
                        className="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-base shadow-sm transition-transform active:scale-[0.98]"
                        onClick={handleSave}
                    >
                        Complete Setup
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
