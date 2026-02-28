"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export const CalculatorView = () => {
    const [display, setDisplay] = useState("0");
    const [pressedBtn, setPressedBtn] = useState<string | null>(null);

    const append = (char: string) => {
        setDisplay((prev) => (prev === "0" || prev === "Error" ? char : prev + char));
    };

    const clear = () => setDisplay("0");
    const backspace = () => setDisplay((prev) => prev.length > 1 ? prev.slice(0, -1) : "0");

    const compute = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(display);
            setDisplay(result.toString());
        } catch {
            setDisplay("Error");
        }
    };

    const buttons = [
        { label: "C", type: "clear" },
        { label: "⌫", type: "backspace" },
        { label: "%", type: "op" },
        { label: "/", type: "op" },
        { label: "7", type: "num" },
        { label: "8", type: "num" },
        { label: "9", type: "num" },
        { label: "*", type: "op" },
        { label: "4", type: "num" },
        { label: "5", type: "num" },
        { label: "6", type: "num" },
        { label: "-", type: "op" },
        { label: "1", type: "num" },
        { label: "2", type: "num" },
        { label: "3", type: "num" },
        { label: "+", type: "op" },
        { label: "0", type: "num", span: 2 },
        { label: ".", type: "num" },
        { label: "=", type: "equals" },
    ];

    const handleClick = (btn: typeof buttons[0]) => {
        setPressedBtn(btn.label);
        setTimeout(() => setPressedBtn(null), 150);

        switch (btn.label) {
            case "C": clear(); break;
            case "⌫": backspace(); break;
            case "=": compute(); break;
            case "%": append("/100"); break;
            default: append(btn.label);
        }
    };

    const getButtonStyle = (btn: typeof buttons[0]) => {
        if (btn.type === "equals") {
            return {
                background: "linear-gradient(135deg, #818cf8, #6366f1)",
                color: "#fff",
                boxShadow: "0 8px 24px rgba(99, 102, 241, 0.3)",
                border: "1px solid rgba(129, 140, 248, 0.5)",
            };
        }
        if (btn.type === "op") {
            return {
                background: "rgba(196, 181, 253, 0.12)",
                color: "#7c3aed",
                border: "1px solid rgba(196, 181, 253, 0.2)",
            };
        }
        if (btn.type === "clear" || btn.type === "backspace") {
            return {
                background: "rgba(249, 168, 212, 0.1)",
                color: "#db2777",
                border: "1px solid rgba(249, 168, 212, 0.2)",
            };
        }
        return {
            background: "rgba(255, 255, 255, 0.12)",
            color: "#334155",
            border: "1px solid rgba(255, 255, 255, 0.2)",
        };
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md mx-auto mt-6"
        >
            <div
                className="rounded-[3rem] p-8 relative overflow-hidden"
                style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(28px) saturate(200%)",
                    WebkitBackdropFilter: "blur(28px) saturate(200%)",
                    border: "1px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.5), 0 12px 40px rgba(99,102,241,0.08)",
                }}
            >
                {/* Title */}
                <h2 className="text-center text-lg font-bold text-gradient-hero mb-6 tracking-tight">
                    Calculator
                </h2>

                {/* Display */}
                <div
                    className="p-5 rounded-2xl mb-6 text-right overflow-x-auto"
                    style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        border: "1px solid rgba(255, 255, 255, 0.35)",
                        boxShadow: "inset 0 2px 10px rgba(0,0,0,0.04)",
                    }}
                >
                    <motion.div
                        key={display}
                        initial={{ opacity: 0.6, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-bold tracking-tight text-slate-700 font-mono min-h-[3rem] flex items-end justify-end"
                    >
                        {display}
                    </motion.div>
                </div>

                {/* Button Grid */}
                <div className="grid grid-cols-4 gap-2.5">
                    {buttons.map((btn) => (
                        <motion.button
                            key={btn.label}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleClick(btn)}
                            className={`h-16 rounded-2xl font-bold text-lg transition-all duration-200 cursor-pointer ${btn.span === 2 ? "col-span-2" : ""
                                }`}
                            style={{
                                ...getButtonStyle(btn),
                                backdropFilter: "blur(8px)",
                                transform: pressedBtn === btn.label ? "scale(0.92)" : undefined,
                            }}
                        >
                            {btn.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Ambient glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full -z-10 pointer-events-none"
                style={{ background: "rgba(129, 140, 248, 0.05)", filter: "blur(60px)" }}
            />
        </motion.div>
    );
};
