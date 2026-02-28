"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useKeywordTrigger } from "@/hooks/useTriggers";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";

const prompts = [
    "What made you smile today?",
    "Write about something you're grateful for...",
    "Describe your ideal safe space...",
    "What would you tell your past self?",
    "Your thoughts are safe here...",
];

export const NotesView = () => {
    const [note, setNote] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const prompt = useMemo(() => prompts[Math.floor(Math.random() * prompts.length)], []);

    useEffect(() => {
        const saved = localStorage.getItem("echo-exit-note");
        if (saved) setNote(saved);
    }, []);

    const handleChange = (val: string) => {
        setNote(val);
        localStorage.setItem("echo-exit-note", val);
    };

    useKeywordTrigger(note);

    const wordCount = note.trim() ? note.trim().split(/\s+/).length : 0;
    const charCount = note.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
        >
            <div
                className="h-full rounded-[3rem] p-8 flex flex-col relative overflow-hidden transition-all duration-500"
                style={{
                    background: isFocused
                        ? "rgba(255, 255, 255, 0.4)"
                        : "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(28px) saturate(200%)",
                    WebkitBackdropFilter: "blur(28px) saturate(200%)",
                    border: isFocused
                        ? "1px solid rgba(196, 181, 253, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: isFocused
                        ? "inset 0 2px 4px rgba(255,255,255,0.5), 0 12px 40px rgba(99,102,241,0.1), 0 0 60px rgba(196,181,253,0.06)"
                        : "inset 0 2px 4px rgba(255,255,255,0.5), 0 12px 40px rgba(99,102,241,0.06)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2.5 rounded-xl"
                            style={{
                                background: "linear-gradient(135deg, rgba(196,181,253,0.2), rgba(129,140,248,0.15))",
                                border: "1px solid rgba(196,181,253,0.2)",
                            }}
                        >
                            <BookOpen className="w-4 h-4 text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gradient-hero">
                            Personal Journal
                        </h2>
                    </div>

                    {/* Writing prompt chip */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest"
                        style={{
                            background: "rgba(196, 181, 253, 0.1)",
                            border: "1px solid rgba(196, 181, 253, 0.15)",
                            color: "#8b5cf6",
                        }}
                    >
                        <Sparkles className="w-3 h-3" />
                        Prompt
                    </motion.div>
                </div>

                {/* Prompt suggestion */}
                {!note && (
                    <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-indigo-300/60 italic mb-4 pl-1"
                    >
                        💡 {prompt}
                    </motion.p>
                )}

                {/* Textarea */}
                <Textarea
                    value={note}
                    onChange={(e) => handleChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Start writing your thoughts..."
                    className="flex-1 text-lg resize-none border-none bg-white/8 focus-visible:ring-1 focus-visible:ring-indigo-300/40 rounded-2xl placeholder:text-slate-400/60 p-4 leading-relaxed transition-all"
                    style={{
                        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.03)",
                    }}
                />

                {/* Footer Stats */}
                <div className="flex items-center justify-between mt-4">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400/60">
                        All notes saved locally only
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400/50">
                            {wordCount} words
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400/50">
                            {charCount} chars
                        </span>
                    </div>
                </div>
            </div>

            {/* Ambient glow behind the card */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full -z-10 pointer-events-none"
                style={{ background: "rgba(196, 181, 253, 0.06)", filter: "blur(80px)" }}
            />
        </motion.div>
    );
};
