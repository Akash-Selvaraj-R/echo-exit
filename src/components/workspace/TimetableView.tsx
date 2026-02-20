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
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Weekly Schedule</CardTitle>
                <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 text-xs">
                    <RotateCcw className="w-3 h-3" /> Reset
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-2 border bg-slate-50 dark:bg-slate-800 text-xs font-semibold">Time</th>
                                {days.map((d) => (
                                    <th key={d} className="p-2 border bg-slate-50 dark:bg-slate-800 text-xs font-semibold">{d}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {hours.map((h) => (
                                <tr key={h}>
                                    <td className="p-4 border font-medium bg-slate-50/50 dark:bg-slate-800/50 text-xs">{h}</td>
                                    {days.map((d) => {
                                        const key = `${d}-${h}`;
                                        const value = timetable[key];
                                        return (
                                            <td
                                                key={key}
                                                className="p-4 border text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                                                onClick={() => handleEdit(d, h)}
                                            >
                                                {value ? (
                                                    <span className="text-slate-900 dark:text-slate-100 font-medium">{value}</span>
                                                ) : (
                                                    <span className="text-slate-300 dark:text-slate-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Plus className="w-3 h-3" /> Add
                                                    </span>
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
