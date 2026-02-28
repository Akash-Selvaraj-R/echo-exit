"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useKeywordTrigger } from "@/hooks/useTriggers";

export const NotesView = () => {
    const [note, setNote] = useState("");

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("echo-exit-note");
        if (saved) setNote(saved);
    }, []);

    const handleChange = (val: string) => {
        setNote(val);
        localStorage.setItem("echo-exit-note", val);
    };

    // Keyword trigger integrated into the note editor
    useKeywordTrigger(note);

    return (
        <Card className="w-full h-full border-none shadow-none bg-transparent">
            {/* Using glass-panel wrapping */}
            <div className="h-full rounded-[3rem] p-8 glass-panel flex flex-col">
                <CardHeader className="px-0 pt-0 pb-6">
                    <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                        Personal Journal
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 flex-1 flex flex-col">
                    <Textarea
                        value={note}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Start typing your notes here..."
                        className="flex-1 text-lg resize-none border-none bg-white/10 dark:bg-slate-900/10 focus-visible:ring-1 focus-visible:ring-indigo-400/50 rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] placeholder:text-slate-400"
                    />
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-6 text-center">
                        All notes are saved locally only.
                    </p>
                </CardContent>
            </div>
        </Card>
    );
};
