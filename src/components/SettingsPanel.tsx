"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSafety } from "@/context/SafetyContext";
import { ShieldAlert, Info } from "lucide-react";

export const SettingsPanel: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({
    open,
    onOpenChange,
}) => {
    const { config, updateConfig } = useSafety();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-red-100 text-red-600 rounded-full">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <DialogTitle>Safety Protocol Configuration</DialogTitle>
                    </div>
                    <DialogDescription>
                        Configure the discreet triggers and recovery environment.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="shortcut" className="font-semibold">Keyboard Shortcut</Label>
                        <Input
                            id="shortcut"
                            value={config.shortcut}
                            onChange={(e) => updateConfig({ shortcut: e.target.value })}
                            placeholder="e.g. Shift+Alt+S"
                        />
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Info className="w-3 h-3" /> Currently fixed to Shift+Alt+S for demonstration.
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="clicks" className="font-semibold">Multi-Click Logo Threshold</Label>
                        <Input
                            id="clicks"
                            type="number"
                            value={config.multiClickThreshold}
                            onChange={(e) => updateConfig({ multiClickThreshold: parseInt(e.target.value) || 5 })}
                            min={2}
                            max={10}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="safeword" className="font-semibold">Safe Word / Keyword</Label>
                        <Input
                            id="safeword"
                            value={config.safeWord}
                            onChange={(e) => updateConfig({ safeWord: e.target.value })}
                            placeholder="Keyword to trigger safety flow"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="url" className="font-semibold">Recovery URL</Label>
                        <Input
                            id="url"
                            value={config.safeUrl}
                            onChange={(e) => updateConfig({ safeUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid gap-2 border-t pt-4">
                        <Label htmlFor="emergency" className="font-semibold text-red-600 flex items-center gap-2">
                            Emergency Contact Number
                        </Label>
                        <Input
                            id="emergency"
                            value={config.emergencyNumber}
                            onChange={(e) => updateConfig({ emergencyNumber: e.target.value })}
                            placeholder="e.g. 911 or personal number"
                        />
                        <p className="text-[10px] text-slate-500 italic">
                            This number will be used for the simulated "Secure Call" protocol.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} className="w-full">
                        Save and Close Settings
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
