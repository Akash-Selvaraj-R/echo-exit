"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        if (password === "1234" || password === "password") {
            onUnlock();
            setPassword("");
            setIsError(false);
        } else {
            setIsError(true);
            setTimeout(() => setIsError(false), 600);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center px-6"
                    style={{
                        background: "rgba(5, 5, 20, 0.6)",
                        backdropFilter: "blur(32px)",
                    }}
                >
                    {/* Animated background orbs */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <motion.div
                            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                            className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
                            style={{ background: "rgba(196, 181, 253, 0.08)", filter: "blur(80px)" }}
                        />
                        <motion.div
                            animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full"
                            style={{ background: "rgba(125, 211, 252, 0.06)", filter: "blur(80px)" }}
                        />
                    </div>

                    <motion.div
                        initial={{ scale: 0.9, y: 24 }}
                        animate={isError ? { x: [-8, 8, -6, 6, -3, 3, 0], scale: 1, y: 0 } : { scale: 1, y: 0 }}
                        transition={isError ? { duration: 0.4 } : { type: "spring", damping: 20 }}
                        className="w-full max-w-sm relative z-10"
                    >
                        <div
                            className="p-8 rounded-[2.5rem] relative overflow-hidden"
                            style={{
                                background: "rgba(255, 255, 255, 0.08)",
                                backdropFilter: "blur(24px) saturate(180%)",
                                border: `1px solid ${isError ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
                                boxShadow: isError
                                    ? "0 24px 80px rgba(239, 68, 68, 0.15), inset 0 1px 1px rgba(255,255,255,0.05)"
                                    : "0 24px 80px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.05)",
                                transition: "border-color 0.3s, box-shadow 0.3s",
                            }}
                        >
                            {/* Lock icon */}
                            <div className="text-center mb-6">
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                    }}
                                >
                                    <Lock className="w-7 h-7 text-slate-400" />
                                </motion.div>
                                {/* Glow behind icon */}
                                <div
                                    className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full -z-10"
                                    style={{ background: "rgba(129, 140, 248, 0.1)", filter: "blur(30px)" }}
                                />
                                <h2 className="text-xl font-bold text-white tracking-tight">Session Locked</h2>
                                <p className="text-slate-500 text-xs mt-1">Your workspace is currently inactive.</p>
                            </div>

                            {/* User info */}
                            <div
                                className="flex items-center gap-3 p-3 rounded-xl mb-5"
                                style={{
                                    background: "rgba(255, 255, 255, 0.04)",
                                    border: "1px solid rgba(255, 255, 255, 0.06)",
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(129,140,248,0.2), rgba(99,102,241,0.15))",
                                    }}
                                >
                                    <User className="w-4 h-4 text-indigo-400" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                                </div>
                            </div>

                            {/* Password input */}
                            <div className="space-y-3">
                                <Input
                                    type="password"
                                    placeholder="Enter PIN or Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                                    className="bg-white/5 border-white/8 text-white rounded-xl h-12 focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                />
                                {isError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[10px] text-rose-400 text-center font-medium"
                                    >
                                        Invalid credentials. Access denied.
                                    </motion.p>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleUnlock}
                                className="w-full mt-5 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                                style={{
                                    background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                    color: "#fff",
                                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                                }}
                            >
                                Unlock Workspace
                            </motion.button>
                        </div>

                        <p className="mt-8 text-center text-[9px] text-slate-600 uppercase tracking-[0.2em] font-bold">
                            Security Protocol 7.2 | EchoExit Research
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
