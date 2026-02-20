"use client";

import React, { useRef } from "react";
import { Shield, Notebook, Calculator, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMultiClickTrigger } from "@/hooks/useTriggers";
import { useEmergencyTrigger } from "@/hooks/useEmergencyTrigger";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface NavigationProps {
    activeMode: string;
    setActiveMode: (mode: string) => void;
    onOpenSettings: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeMode, setActiveMode, onOpenSettings }) => {
    const logoRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    const { trigger } = useEmergencyTrigger();

    // Logo multi-click trigger
    useMultiClickTrigger(logoRef, trigger);

    const items = [
        { id: "notes", icon: Notebook, label: "Notes" },
        { id: "calc", icon: Calculator, label: "Calculator" },
        { id: "timetable", icon: Calendar, label: "Timetable" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-white dark:bg-slate-950 flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-8">
                <div
                    ref={logoRef}
                    className="flex items-center gap-2 cursor-pointer select-none group"
                    title="EchoExit - Productive Workspace"
                >
                    <div className="w-10 h-10 bg-slate-900 dark:bg-slate-100 rounded-lg flex items-center justify-center group-active:scale-95 transition-transform">
                        <Shield className="text-white dark:text-slate-900 w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                        EchoExit
                    </span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-md">
                    {items.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            size="sm"
                            onClick={() => setActiveMode(item.id)}
                            className={cn(
                                "gap-2 px-4 h-8 transition-colors",
                                activeMode === item.id
                                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white"
                                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <Button variant="ghost" size="icon" onClick={onOpenSettings} className="text-slate-500">
                <Settings className="w-5 h-5" />
            </Button>
        </nav>
    );
};
