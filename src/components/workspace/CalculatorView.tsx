"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CalculatorView = () => {
    const [display, setDisplay] = useState("0");

    const append = (char: string) => {
        setDisplay((prev) => (prev === "0" ? char : prev + char));
    };

    const clear = () => setDisplay("0");
    const compute = () => {
        try {
            // Simple math eval (safe for a prototype)
            // eslint-disable-next-line no-eval
            setDisplay(eval(display).toString());
        } catch (e) {
            setDisplay("Error");
        }
    };

    const buttons = [
        "7", "8", "9", "/",
        "4", "5", "6", "*",
        "1", "2", "3", "-",
        "0", ".", "=", "+"
    ];

    return (
        <Card className="max-w-md mx-auto mt-10 border-none shadow-none bg-transparent">
            <div className="rounded-[3rem] p-8 glass-panel">
                <CardHeader className="px-0 pt-0 pb-6">
                    <CardTitle className="text-center font-mono text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                        Standard Calculator
                    </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                    <div className="bg-white/40 dark:bg-slate-900/40 p-4 rounded-3xl mb-6 text-right text-4xl font-mono overflow-auto h-20 flex flex-col justify-end shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border border-white/50">
                        {display}
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {buttons.map((btn) => (
                            <Button
                                key={btn}
                                variant={btn === "=" ? "default" : "outline"}
                                onClick={() => (btn === "=" ? compute() : append(btn))}
                                className={`h-16 text-xl rounded-2xl transition-all duration-300 ${btn === "="
                                        ? "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white"
                                        : "bg-white/20 hover:bg-white/40 border-none shadow-sm hover:shadow-md text-slate-700 dark:text-slate-200"
                                    }`}
                            >
                                {btn}
                            </Button>
                        ))}
                        <Button
                            variant="destructive"
                            onClick={clear}
                            className="col-span-4 h-14 mt-2 rounded-2xl bg-rose-500/90 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
                        >
                            Clear
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};
