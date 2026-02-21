"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useMounted } from "@/components/MountedGuard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings, Shield, Bell, User } from "lucide-react";

export default function SettingsPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const mounted = useMounted();
    const [isPanelOpen, setIsPanelOpen] = useState(true);

    if (!mounted || isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="w-8 h-8 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-black font-sans">
            <Navigation
                activeMode="settings"
                setActiveMode={() => { }}
                onOpenSettings={() => setIsPanelOpen(true)}
            />

            <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
                <div className="space-y-6">
                    <header>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                        <p className="text-slate-500">Manage your account and safety configurations.</p>
                    </header>

                    <div className="grid gap-6">
                        <Card className="glass border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" /> Account Profile
                                </CardTitle>
                                <CardDescription>Your personal information and research ID.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-medium">Name</span>
                                        <span className="text-sm text-slate-500">{user.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                                        <span className="text-sm font-medium">Email</span>
                                        <span className="text-sm text-slate-500">{user.email}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="glass border-none">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-red-500" /> Safety Protocols
                                </CardTitle>
                                <CardDescription>Configure emergency triggers and hidden safety features.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={() => setIsPanelOpen(true)}
                                    className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left flex items-center justify-between"
                                >
                                    <span className="text-sm font-medium">Open Safety Dashboard</span>
                                    <Settings className="w-4 h-4 text-slate-400" />
                                </button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <SettingsPanel open={isPanelOpen} onOpenChange={setIsPanelOpen} />
        </div>
    );
}
