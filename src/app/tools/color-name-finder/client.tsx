"use client";

import React, { useState, useMemo } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Type, Copy, CheckCircle2, Zap, Search } from "lucide-react";
import { colorsNamed } from "culori";

const namedColors: { name: string; hex: string }[] = Object.entries(colorsNamed).map(([name, value]) => ({
  name,
  hex: `#${(value as number).toString(16).padStart(6, "0")}`,
}));

const hexToRgb = (hex: string) => { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; };

export default function ColorNameFinder() {
  const [color, setColor] = useState("#3f51b5");
  const [copied, setCopied] = useState(false);

  const matches = useMemo(() => {
    const rgb = hexToRgb(color); if (!rgb) return [] as { name: string; hex: string; dist: number }[];
    return namedColors
      .map(c => { const crgb = hexToRgb(c.hex)!; return { ...c, dist: Math.sqrt(Math.pow(rgb.r - crgb.r, 2) + Math.pow(rgb.g - crgb.g, 2) + Math.pow(rgb.b - crgb.b, 2)) }; })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 6);
  }, [color]);
  const closestName = matches[0]?.name ?? "Custom";
  const closestHex = matches[0]?.hex ?? color;

  const copyToClipboard = async () => { try { await navigator.clipboard.writeText(color); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="color-name-finder">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Type className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Pick a Color</span></div>
            <CardContent className="p-8 space-y-4">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-24 rounded-2xl cursor-pointer" />
              <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="h-14 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
            </CardContent>
          </Card>
          <div className="h-40 rounded-[2.5rem] border border-border shadow-sm" style={{ backgroundColor: color }} />
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8">
              <Button onClick={copyToClipboard} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Hex"}</Button>
            </CardContent>
          </Card>
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Search className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Closest Match</span></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="w-14 h-14 rounded-xl border border-border shadow-sm flex-shrink-0" style={{ backgroundColor: closestHex }} />
                <div>
                  <p className="text-lg font-black text-foreground">{closestName}</p>
                  <p className="text-xs text-muted-foreground font-mono font-bold">{closestHex}</p>
                </div>
              </div>
              {matches.length > 1 && (
                <ul className="mt-4 space-y-1.5">
                  {matches.slice(1).map(m => (
                    <li key={m.name}>
                      <button type="button" onClick={() => setColor(m.hex)} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors text-left" title={`Use ${m.name}`}>
                        <span className="w-7 h-7 rounded-md border border-border shrink-0" style={{ backgroundColor: m.hex }} />
                        <span className="flex-1 min-w-0"><span className="block text-sm font-semibold truncate">{m.name}</span><span className="block text-[11px] font-mono text-muted-foreground">{m.hex}</span></span>
                        <span className="text-[10px] text-muted-foreground font-bold">Δ{m.dist.toFixed(0)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
