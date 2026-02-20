"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, EyeOff, Database } from "lucide-react";

export const PrivacyDialog = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem("echo-exit-consent");
        if (!hasConsented) {
            setOpen(true);
        }
    }, []);

    const handleConsent = () => {
        localStorage.setItem("echo-exit-consent", "true");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <DialogTitle>Research Consent & Privacy</DialogTitle>
                    </div>
                    <DialogDescription>
                        You are using the EchoExit academic research prototype. Please review our privacy transparency guidelines.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-4 items-start">
                        <EyeOff className="w-8 h-8 text-slate-400 shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold">Discreet Triggers</h4>
                            <p className="text-sm text-slate-500">
                                Safety features are hidden behind production interactions (shortcuts, clicks, safe-words) to ensure privacy from observers.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <Database className="w-8 h-8 text-slate-400 shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold">Local-Only Persistence</h4>
                            <p className="text-sm text-slate-500">
                                Your notes and settings are stored exclusively in your browser&apos;s LocalStorage. No data is sent to a server unless a safety trigger is activated.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border text-xs text-slate-600 dark:text-slate-400">
                        <strong>Emergency Data Collection:</strong> When triggered, only essential context (timestamp, device type, and optional location) is collected to simulate assistance dispatch.
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleConsent} className="w-full">
                        I Understand and Consent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
