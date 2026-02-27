"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
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
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#050714]">
            {/* Animated mesh background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
                <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-sky-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-white text-xl tracking-tight">EchoExit</span>
                </div>

                {/* Card */}
                <div className="relative p-8 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                        <p className="text-slate-400 text-sm mt-1.5">Sign in to access your secure workspace.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold tracking-wide transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 text-sm mt-2"
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
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        No account?{" "}
                        <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Create one
                        </Link>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-700 mt-8 uppercase tracking-[0.2em] font-bold">EchoExit · Research Prototype</p>
            </motion.div>
        </div>
    );
}
