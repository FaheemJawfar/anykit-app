"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Type, Copy, CheckCircle2 } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={copyToClipboard} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">{copied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}{copied ? "Copied!" : "Copy Hex"}</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Closest Match</h3>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl border border-border"><div className="w-10 h-10 rounded-lg border border-border" style={{ backgroundColor: closestHex }} /><div><p className="text-sm font-black text-foreground">{closestName}</p><p className="text-xs text-muted-foreground font-mono">{closestHex}</p></div></div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><Type className="w-5 h-5 text-primary" /></div>Pick a Color</h3>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-24 rounded-xl cursor-pointer" />
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full mt-4 px-4 py-3 bg-muted border border-border rounded-2xl focus:border-primary focus:outline-none text-sm font-mono font-bold text-foreground text-center uppercase" />
          </div>
          <div className="h-32 rounded-[2rem] border border-border shadow-sm" style={{ backgroundColor: color }} />
        </div>
      </div>
    </ToolLayout>
  );
}
