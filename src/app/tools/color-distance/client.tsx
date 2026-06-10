"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Ruler, Shuffle, Layers, Zap } from "lucide-react";

export default function ColorDistance() {
  const [color1, setColor1] = useState("#ff6b6b");
  const [color2, setColor2] = useState("#4ecdc4");
  const [distances, setDistances] = useState({ euclidean: 0, manhattan: 0, deltaE: 0 });

  const hexToRgb = (hex: string) => { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; };

  const hexToLab = (hex: string) => {
    const rgb = hexToRgb(hex); if (!rgb) return { l: 0, a: 0, b: 0 };
    let { r, g, b } = rgb; r /= 255; g /= 255; b /= 255;
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805; const y = r * 0.2126 + g * 0.7152 + b * 0.0722; const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    const xn = x / 0.95047; const yn = y / 1.00000; const zn = z / 1.08883;
    const fx = xn > 0.008856 ? Math.pow(xn, 1 / 3) : (7.787 * xn + 16 / 116);
    const fy = yn > 0.008856 ? Math.pow(yn, 1 / 3) : (7.787 * yn + 16 / 116);
    const fz = zn > 0.008856 ? Math.pow(zn, 1 / 3) : (7.787 * zn + 16 / 116);
    return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
  };

  useEffect(() => {
    const rgb1 = hexToRgb(color1); const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return;
    const euclidean = Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2));
    const manhattan = Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b);
    const lab1 = hexToLab(color1); const lab2 = hexToLab(color2);
    const deltaE = Math.sqrt(Math.pow(lab1.l - lab2.l, 2) + Math.pow(lab1.a - lab2.a, 2) + Math.pow(lab1.b - lab2.b, 2));
    setDistances({ euclidean, manhattan, deltaE });
  }, [color1, color2]);

  const randomize = () => { setColor1("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")); setColor2("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")); };

  return (
    <ToolLayout toolId="color-distance">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Ruler className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color 1</span></div>
              <CardContent className="p-8 space-y-4">
                <input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} className="w-full h-20 rounded-2xl cursor-pointer" />
                <Input type="text" value={color1} onChange={(e) => setColor1(e.target.value)} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Ruler className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Color 2</span></div>
              <CardContent className="p-8 space-y-4">
                <input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} className="w-full h-20 rounded-2xl cursor-pointer" />
                <Input type="text" value={color2} onChange={(e) => setColor2(e.target.value)} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
              </CardContent>
            </Card>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 h-32 rounded-[2rem] border border-border shadow-sm" style={{ backgroundColor: color1 }} />
            <div className="flex-1 h-32 rounded-[2rem] border border-border shadow-sm" style={{ backgroundColor: color2 }} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8"><Button onClick={randomize} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Shuffle className="w-4 h-4 mr-2" /> Randomize Colors</Button></CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Distance Results</span></div>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Euclidean</span><span className="text-xs font-mono font-bold">{distances.euclidean.toFixed(2)}</span></div>
              <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Manhattan</span><span className="text-xs font-mono font-bold">{distances.manhattan.toFixed(2)}</span></div>
              <div className="flex justify-between p-3 rounded-xl bg-primary/5 border border-primary/10"><span className="text-[10px] font-bold uppercase text-primary/70">Delta E (CIE76)</span><span className="text-xs font-mono font-bold text-primary">{distances.deltaE.toFixed(2)}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
