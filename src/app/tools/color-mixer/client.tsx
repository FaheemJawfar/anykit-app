"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Copy, CheckCircle2, Zap, Layers } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Palette className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color 1</span></div>
              <CardContent className="p-8 space-y-4">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-20 rounded-2xl cursor-pointer" />
                <Input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Palette className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color 2</span></div>
              <CardContent className="p-8 space-y-4">
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-20 rounded-2xl cursor-pointer" />
                <Input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
              </CardContent>
            </Card>
          </div>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mixed Result</span></div>
            <CardContent className="p-8">
              <div className="h-40 rounded-2xl border border-border shadow-sm flex items-center justify-center" style={{ backgroundColor: mixedColor }}>
                <span className="text-sm font-black uppercase bg-white/90 text-black px-4 py-2 rounded-lg">{mixedColor}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Mixed"}</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mix Ratio</span></div>
            <CardContent className="p-8 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Color 1</Label><span className="text-xs font-mono font-bold">{ratio}%</span></div>
                <input type="range" min="0" max="100" value={ratio} onChange={(e) => setRatio(Number(e.target.value))} className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs font-bold text-muted-foreground"><span>{ratio}%</span><span>{100 - ratio}%</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
