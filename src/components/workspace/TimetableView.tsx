"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Calendar } from "lucide-react";
import { motion } from "framer-motion";

type TimetableData = Record<string, string>;

export const TimetableView = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = ["09:00", "11:00", "13:00", "15:00", "17:00"];

    const [timetable, setTimetable] = useState<TimetableData>({});
    const [editingSlot, setEditingSlot] = useState<{ day: string; hour: string } | null>(null);
    const [tempValue, setTempValue] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("echo-exit-timetable");
        if (saved) {
            try {
                setTimetable(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse timetable", e);
            }
        }
    }, []);

    const saveTimetable = (data: TimetableData) => {
        setTimetable(data);
        localStorage.setItem("echo-exit-timetable", JSON.stringify(data));
    };

    const handleEdit = (day: string, hour: string) => {
        setEditingSlot({ day, hour });
        setTempValue(timetable[`${day}-${hour}`] || "");
    };

    const handleSaveSlot = () => {
        if (!editingSlot) return;
        const newTimetable = {
            ...timetable,
            [`${editingSlot.day}-${editingSlot.hour}`]: tempValue,
        };
        saveTimetable(newTimetable);
        setEditingSlot(null);
    };

    const handleReset = () => {
        if (confirm("Are you sure you want to reset your timetable?")) {
            saveTimetable({});
        }
    };

    const currentDay = new Date().toLocaleDateString("en-US", { weekday: "short" });

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
        >
            <div
                className="rounded-[3rem] p-8 relative overflow-hidden"
                style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(28px) saturate(200%)",
                    WebkitBackdropFilter: "blur(28px) saturate(200%)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5), 0 12px 40px rgba(99,102,241,0.06)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-2.5 rounded-xl"
                            style={{
                                background: "linear-gradient(135deg, rgba(125,211,252,0.2), rgba(56,189,248,0.15))",
                                border: "1px solid rgba(125,211,252,0.2)",
                            }}
                        >
                            <Calendar className="w-4 h-4 text-sky-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gradient-hero">
                            Weekly Schedule
                        </h2>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
                        style={{
                            background: "rgba(249, 168, 212, 0.1)",
                            border: "1px solid rgba(249, 168, 212, 0.2)",
                            color: "#db2777",
                        }}
                    >
                        <RotateCcw className="w-3 h-3" /> Reset
                    </motion.button>
                </div>

                {/* Table */}
                <div
                    className="overflow-x-auto rounded-[2rem]"
                    style={{
                        background: "rgba(255, 255, 255, 0.08)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                    }}
                >
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th
                                    className="p-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400"
                                    style={{
                                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                                        borderRight: "1px solid rgba(255,255,255,0.1)",
                                        background: "rgba(255,255,255,0.06)",
                                    }}
                                >
                                    Time
                                </th>
                                {days.map((d) => (
                                    <th
                                        key={d}
                                        className={`p-4 text-[9px] font-bold uppercase tracking-[0.2em] ${d === currentDay ? "text-indigo-500" : "text-slate-400"
                                            }`}
                                        style={{
                                            borderBottom: "1px solid rgba(255,255,255,0.15)",
                                            borderRight: "1px solid rgba(255,255,255,0.1)",
                                            background: d === currentDay
                                                ? "rgba(129, 140, 248, 0.06)"
                                                : "rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        {d}
                                        {d === currentDay && (
                                            <div
                                                className="h-0.5 w-4 mx-auto mt-1 rounded-full"
                                                style={{ background: "linear-gradient(90deg, var(--echo-lavender), var(--echo-sky))" }}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((h, i) => (
                                <tr key={h}>
                                    <td
                                        className="p-4 text-[10px] font-bold text-slate-400 text-center"
                                        style={{
                                            borderBottom: i < hours.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                            borderRight: "1px solid rgba(255,255,255,0.1)",
                                            background: "rgba(255,255,255,0.03)",
                                        }}
                                    >
                                        {h}
                                    </td>
                                    {days.map((d) => {
                                        const key = `${d}-${h}`;
                                        const value = timetable[key];
                                        const isCurrentDay = d === currentDay;
                                        return (
                                            <td
                                                key={key}
                                                onClick={() => handleEdit(d, h)}
                                                className="p-4 text-xs cursor-pointer group/cell relative transition-all duration-200"
                                                style={{
                                                    borderBottom: i < hours.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                                                    borderRight: "1px solid rgba(255,255,255,0.1)",
                                                    background: value
                                                        ? "rgba(129, 140, 248, 0.06)"
                                                        : isCurrentDay
                                                            ? "rgba(129, 140, 248, 0.02)"
                                                            : "transparent",
                                                }}
                                                onMouseEnter={(e) => {
                                                    (e.currentTarget as HTMLElement).style.background = "rgba(196, 181, 253, 0.1)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.currentTarget as HTMLElement).style.background = value
                                                        ? "rgba(129, 140, 248, 0.06)"
                                                        : isCurrentDay
                                                            ? "rgba(129, 140, 248, 0.02)"
                                                            : "transparent";
                                                }}
                                            >
                                                {value ? (
                                                    <span
                                                        className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold"
                                                        style={{
                                                            background: "rgba(129, 140, 248, 0.1)",
                                                            color: "#6366f1",
                                                            border: "1px solid rgba(129, 140, 248, 0.15)",
                                                        }}
                                                    >
                                                        {value}
                                                    </span>
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                                        <span
                                                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold"
                                                            style={{
                                                                background: "rgba(129, 140, 248, 0.08)",
                                                                color: "#818cf8",
                                                                border: "1px solid rgba(129, 140, 248, 0.15)",
                                                            }}
                                                        >
                                                            <Plus className="w-2.5 h-2.5" /> Add
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Dialog open={!!editingSlot} onOpenChange={(open) => !open && setEditingSlot(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Update Schedule</DialogTitle>
                            <p className="text-sm text-slate-500">
                                {editingSlot?.day} at {editingSlot?.hour}
                            </p>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                placeholder="e.g. HCI Seminar, Gym, Lunch..."
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && handleSaveSlot()}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="ghost" onClick={() => setEditingSlot(null)}>Cancel</Button>
                            <Button onClick={handleSaveSlot}>Save Entry</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );
};
