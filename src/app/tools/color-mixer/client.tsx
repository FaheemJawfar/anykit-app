"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Palette, Copy, CheckCircle2, Shuffle } from "lucide-react";

export default function ColorMixer() {
  const [color1, setColor1] = useState("#ff6b6b");
  const [color2, setColor2] = useState("#4ecdc4");
  const [ratio, setRatio] = useState(50);
  const [mixedColor, setMixedColor] = useState("");
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; };

  useEffect(() => {
    const rgb1 = hexToRgb(color1); const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return;
    const r = Math.round(rgb1.r * (ratio / 100) + rgb2.r * (1 - ratio / 100));
    const g = Math.round(rgb1.g * (ratio / 100) + rgb2.g * (1 - ratio / 100));
    const b = Math.round(rgb1.b * (ratio / 100) + rgb2.b * (1 - ratio / 100));
    setMixedColor("#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1));
  }, [color1, color2, ratio]);

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(mixedColor); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="color-mixer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Mixed"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Mix Ratio</h3>
            <input type="range" min="0" max="100" value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full accent-primary" />
            <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>{ratio}% Color 1</span><span>{100 - ratio}% Color 2</span></div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Color 1</h3><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-16 rounded-xl cursor-pointer" /><input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full mt-3 px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-mono font-bold text-foreground text-center uppercase" /></div>
            <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8"><h3 className="text-sm font-black text-foreground mb-4 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> Color 2</h3><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-16 rounded-xl cursor-pointer" /><input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full mt-3 px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-mono font-bold text-foreground text-center uppercase" /></div>
          </div>
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-4">Mixed Result</h3>
            <div className="h-32 rounded-2xl border border-border shadow-sm flex items-center justify-center" style={{ backgroundColor: mixedColor }}><span className="text-sm font-black uppercase bg-white/90 text-black px-4 py-2 rounded-lg">{mixedColor}</span></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
