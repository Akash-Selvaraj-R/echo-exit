"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const success = await login(email, password);
            if (success) {
                toast.success("Authenticated");
                router.push("/");
            } else {
                toast.error("Invalid credentials. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#050714" }}>
            {/* Animated mesh */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
                    className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
                    style={{ background: "rgba(196, 181, 253, 0.2)", filter: "blur(120px)" }}
                />
                <motion.div
                    animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
                    className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full"
                    style={{ background: "rgba(129, 140, 248, 0.15)", filter: "blur(120px)" }}
                />
                <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
                    className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full"
                    style={{ background: "rgba(125, 211, 252, 0.12)", filter: "blur(120px)" }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, #818cf8, #6366f1)",
                            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                        }}
                    >
                        <Shield className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="font-bold text-white text-xl tracking-tight">EchoExit</span>
                </div>

                {/* Card */}
                <div
                    className="relative p-8 rounded-[2.5rem] overflow-hidden"
                    style={{
                        background: "rgba(255, 255, 255, 0.04)",
                        backdropFilter: "blur(32px)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255,255,255,0.04)",
                    }}
                >
                    {/* Subtle gradient border glow */}
                    <div
                        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                        style={{
                            background: "linear-gradient(135deg, rgba(196,181,253,0.05), transparent, rgba(125,211,252,0.05))",
                        }}
                    />

                    <div className="relative z-10">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                            <p className="text-slate-500 text-sm mt-1.5">Sign in to access your secure workspace.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em]">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-11 h-13 bg-white/4 border-white/8 text-white rounded-xl focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-500 text-[9px] uppercase font-bold tracking-[0.2em]">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-11 h-13 bg-white/4 border-white/8 text-white rounded-xl focus:border-indigo-500/40 transition-all placeholder:text-slate-600 text-sm"
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full h-13 rounded-xl font-bold tracking-wider flex items-center justify-center gap-2 text-sm mt-2 transition-all disabled:opacity-60"
                                style={{
                                    background: "linear-gradient(135deg, #818cf8, #6366f1)",
                                    color: "#fff",
                                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                                }}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center text-sm text-slate-500">
                            No account?{" "}
                            <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                Create one
                            </Link>
                        </div>
                    </div>
                </div>

                <p className="text-center text-[9px] text-slate-700 mt-8 uppercase tracking-[0.25em] font-bold">EchoExit · Research Prototype</p>
            </motion.div>
        </div>
    );
}
