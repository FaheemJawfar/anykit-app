"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Thermometer, Copy, CheckCircle2 } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Hex"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Info</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">Color temperature is measured in Kelvin (K). Lower values are warmer (orange), higher values are cooler (blue).</p>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Thermometer className="w-5 h-5 text-primary" /></div>Temperature</h3>
            <input type="range" min="1000" max="12000" step="100" value={kelvin} onChange={(e) => setKelvin(Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs font-bold text-muted-foreground mt-2"><span>1000K (Warm)</span><span>12000K (Cool)</span></div>
            <div className="mt-6 text-center"><span className="text-3xl font-black text-foreground">{kelvin}K</span></div>
            <input type="text" value={hex} readOnly className="w-full mt-4 px-4 py-3 bg-muted border border-border rounded-2xl text-sm font-mono font-bold text-foreground text-center uppercase" />
          </div>
          <div className="h-40 rounded-[2rem] border border-border shadow-sm flex items-center justify-center" style={{ backgroundColor: hex }}><span className="text-sm font-black uppercase bg-white/90 text-black px-4 py-2 rounded-lg">{hex}</span></div>
        </div>
      </div>
    </ToolLayout>
  );
}
