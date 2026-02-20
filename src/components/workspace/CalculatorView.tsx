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
        <Card className="max-w-md mx-auto mt-10 shadow-lg border-slate-200">
            <CardHeader>
                <CardTitle className="text-center font-mono">Standard Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-100 p-4 rounded mb-4 text-right text-3xl font-mono overflow-auto h-16">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {buttons.map((btn) => (
                        <Button
                            key={btn}
                            variant={btn === "=" ? "default" : "outline"}
                            onClick={() => (btn === "=" ? compute() : append(btn))}
                            className="h-14 text-lg"
                        >
                            {btn}
                        </Button>
                    ))}
                    <Button variant="destructive" onClick={clear} className="col-span-4 h-12">
                        Clear
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
