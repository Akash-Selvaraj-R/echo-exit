"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/components/MountedGuard";

interface LockScreenProps {
    isOpen: boolean;
    onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ isOpen, onUnlock }) => {
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState(false);
    const { user } = useAuth();
    const mounted = useMounted();

    if (!mounted) return null;

    const handleUnlock = () => {
        // Simulated check - in production would be real hash check
        if (password === "1234" || password === "password") { // Mock PIN/Password
            onUnlock();
            setPassword("");
            setIsError(false);
        } else {
            setIsError(true);
            setTimeout(() => setIsError(false), 500);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-2xl px-6"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="w-full max-w-sm"
                    >
                        <Card className="border-none shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="w-6 h-6 text-slate-400" />
                                </div>
                                <CardTitle className="text-xl font-bold">Session Locked</CardTitle>
                                <CardDescription>
                                    Your research workspace is currently inactive.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                        <User className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{user?.name || "Academic User"}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Enter PIN or Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={isError ? "border-red-500 animate-shake" : ""}
                                        autoFocus
                                        onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                                    />
                                    {isError && (
                                        <p className="text-[10px] text-red-500 text-center font-medium">
                                            Invalid credentials. Access denied.
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={handleUnlock}>Unlock Workspace</Button>
                            </CardFooter>
                        </Card>
                        <p className="mt-8 text-center text-[10px] text-slate-400 uppercase tracking-widest">
                            Security Protocol 7.2 | EchoExit Research
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
