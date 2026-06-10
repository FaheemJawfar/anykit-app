"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Thermometer, Copy, CheckCircle2, Zap, Info } from "lucide-react";

export default function ColorTemperature() {
  const [kelvin, setKelvin] = useState(5500);
  const [hex, setHex] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const kelvinToRgb = (k: number) => {
    let r: number, g: number, b: number;
    if (k < 1000) k = 1000; if (k > 40000) k = 40000;
    const t = k / 100;
    if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
    else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
    return { r: Math.max(0, Math.min(255, Math.round(r))), g: Math.max(0, Math.min(255, Math.round(g))), b: Math.max(0, Math.min(255, Math.round(b))) };
  };

  useEffect(() => {
    const rgb = kelvinToRgb(kelvin);
    setHex("#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1));
  }, [kelvin]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(hex); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="color-temperature">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Thermometer className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Temperature</span></div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kelvin</Label><span className="text-xs font-mono font-bold">{kelvin}K</span></div>
                <input type="range" min="1000" max="12000" step="100" value={kelvin} onChange={(e) => setKelvin(Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>1000K (Warm)</span><span>12000K (Cool)</span></div>
              </div>
              <div className="text-center pt-2"><span className="text-5xl font-black text-foreground tracking-tight">{kelvin}K</span></div>
              <Input type="text" value={hex} readOnly className="h-14 px-4 rounded-xl bg-muted/30 border-transparent text-sm font-mono font-bold text-center uppercase" />
            </CardContent>
          </Card>
          <div className="h-48 rounded-[2.5rem] border border-border shadow-sm flex items-center justify-center" style={{ backgroundColor: hex }}>
            <span className="text-sm font-black uppercase bg-white/90 text-black px-4 py-2 rounded-lg">{hex}</span>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Hex"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Info className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Info</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium">Color temperature is measured in Kelvin (K). Lower values are warmer (orange), higher values are cooler (blue).</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
