"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw } from "lucide-react";

type TimetableData = Record<string, string>;

export const TimetableView = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const hours = ["09:00", "11:00", "13:00", "15:00", "17:00"];

    const [timetable, setTimetable] = useState<TimetableData>({});
    const [editingSlot, setEditingSlot] = useState<{ day: string; hour: string } | null>(null);
    const [tempValue, setTempValue] = useState("");

    // Load from LocalStorage
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

    return (
        <Card className="w-full border-none shadow-none bg-transparent">
            <div className="rounded-[3rem] p-8 glass-panel">
                <CardHeader className="flex flex-row items-center justify-between px-0 pt-0 pb-6">
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                        Weekly Schedule
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-xs rounded-xl bg-white/20 hover:bg-white/40 border-white/50 shadow-sm">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </Button>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <div className="overflow-x-auto rounded-[2rem] border border-white/30 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] bg-white/10 backdrop-blur-md">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-r border-white/20 bg-white/20 text-xs font-bold uppercase tracking-wider text-slate-500">Time</th>
                                    {days.map((d) => (
                                        <th key={d} className="p-4 border-b border-r last:border-r-0 border-white/20 bg-white/20 text-xs font-bold uppercase tracking-wider text-slate-500">{d}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {hours.map((h, i) => (
                                    <tr key={h} className={i === hours.length - 1 ? "" : "border-b border-white/20"}>
                                        <td className="p-4 border-r border-white/20 font-medium bg-white/5 text-xs text-slate-500 text-center">{h}</td>
                                        {days.map((d, index) => {
                                            const key = `${d}-${h}`;
                                            const value = timetable[key];
                                            return (
                                                <td
                                                    key={key}
                                                    className={`p-4 border-r border-white/20 last:border-r-0 text-xs cursor-pointer hover:bg-white/30 transition-colors group relative ${value ? 'bg-indigo-50/30' : ''}`}
                                                    onClick={() => handleEdit(d, h)}
                                                >
                                                    {value ? (
                                                        <span className="text-slate-800 dark:text-slate-100 font-bold">{value}</span>
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <span className="text-indigo-500 bg-indigo-100/50 px-3 py-1.5 rounded-full flex items-center gap-1 font-bold shadow-sm">
                                                                <Plus className="w-3 h-3" /> Add
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
                </CardContent>
        </Card>
    );
};
