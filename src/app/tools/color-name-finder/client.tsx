"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Type, Copy, CheckCircle2, Zap, Search } from "lucide-react";

const namedColors: { name: string; hex: string }[] = [
  { name: "Red", hex: "#ff0000" }, { name: "Green", hex: "#008000" }, { name: "Blue", hex: "#0000ff" },
  { name: "Yellow", hex: "#ffff00" }, { name: "Cyan", hex: "#00ffff" }, { name: "Magenta", hex: "#ff00ff" },
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#ffffff" }, { name: "Orange", hex: "#ffa500" },
  { name: "Purple", hex: "#800080" }, { name: "Pink", hex: "#ffc0cb" }, { name: "Brown", hex: "#a52a2a" },
  { name: "Gray", hex: "#808080" }, { name: "Lime", hex: "#00ff00" }, { name: "Teal", hex: "#008080" },
  { name: "Navy", hex: "#000080" }, { name: "Maroon", hex: "#800000" }, { name: "Olive", hex: "#808000" },
  { name: "Coral", hex: "#ff7f50" }, { name: "Gold", hex: "#ffd700" }, { name: "Indigo", hex: "#4b0082" },
  { name: "Violet", hex: "#ee82ee" }, { name: "Turquoise", hex: "#40e0d0" }, { name: "Salmon", hex: "#fa8072" },
];

export default function ColorNameFinder() {
  const [color, setColor] = useState("#3f51b5");
  const [closestName, setClosestName] = useState("");
  const [closestHex, setClosestHex] = useState("");
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; };

  useEffect(() => {
    const rgb = hexToRgb(color); if (!rgb) return;
    let bestDist = Infinity; let bestName = "Custom"; let bestHex = color;
    namedColors.forEach(c => {
      const crgb = hexToRgb(c.hex); if (!crgb) return;
      const dist = Math.pow(rgb.r - crgb.r, 2) + Math.pow(rgb.g - crgb.g, 2) + Math.pow(rgb.b - crgb.b, 2);
      if (dist < bestDist) { bestDist = dist; bestName = c.name; bestHex = c.hex; }
    });
    setClosestName(bestName); setClosestHex(bestHex);
  }, [color]);

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
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
