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
import { motion } from "framer-motion";

export const PrivacyDialog = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasConsented = localStorage.getItem("echo-exit-consent");
        if (!hasConsented) {
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("echo-exit-consent", "true");
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-white/15 bg-white/90 backdrop-blur-2xl shadow-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="p-2.5 rounded-xl"
                            style={{
                                background: "linear-gradient(135deg, rgba(129, 140, 248, 0.15), rgba(99, 102, 241, 0.1))",
                                border: "1px solid rgba(129, 140, 248, 0.15)",
                            }}
                        >
                            <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        </motion.div>
                        <DialogTitle className="text-lg font-bold">Research Consent & Privacy</DialogTitle>
                    </div>
                    <DialogDescription className="text-sm text-slate-500">
                        You are using the EchoExit academic research prototype. Please review our privacy transparency guidelines.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-4 items-start">
                        <div
                            className="p-2 rounded-xl shrink-0"
                            style={{
                                background: "rgba(196, 181, 253, 0.1)",
                                border: "1px solid rgba(196, 181, 253, 0.15)",
                            }}
                        >
                            <EyeOff className="w-5 h-5 text-violet-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700">Discreet Triggers</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Safety features are hidden behind production interactions (shortcuts, clicks, safe-words) to ensure privacy from observers.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div
                            className="p-2 rounded-xl shrink-0"
                            style={{
                                background: "rgba(125, 211, 252, 0.1)",
                                border: "1px solid rgba(125, 211, 252, 0.15)",
                            }}
                        >
                            <Database className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-slate-700">Local-Only Persistence</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Your notes and settings are stored exclusively in your browser&apos;s LocalStorage. No data is sent to a server unless a safety trigger is activated.
                            </p>
                        </div>
                    </div>

                    <div
                        className="p-4 rounded-xl text-xs text-slate-600 leading-relaxed"
                        style={{
                            background: "rgba(129, 140, 248, 0.04)",
                            border: "1px solid rgba(129, 140, 248, 0.08)",
                        }}
                    >
                        <strong>Emergency Data Collection:</strong> When triggered, only essential context (timestamp, device type, and optional location) is collected to simulate assistance dispatch.
                    </div>
                </div>

                <DialogFooter>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                        <Button
                            onClick={handleAccept}
                            className="w-full rounded-xl h-12 font-bold text-sm tracking-wider"
                            style={{
                                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
                            }}
                        >
                            I Understand and Consent
                        </Button>
                    </motion.div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
