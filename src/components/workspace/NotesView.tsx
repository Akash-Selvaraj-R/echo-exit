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
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    Personal Journal
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea
                    value={note}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Start typing your notes here..."
                    className="min-h-[500px] text-lg resize-none border-slate-200 focus-visible:ring-slate-400 dark:bg-slate-900/50"
                />
                <p className="text-xs text-slate-400 mt-4">
                    All notes are saved locally only.
                </p>
            </CardContent>
        </Card>
    );
};
