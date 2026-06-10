"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SwatchBook, Copy, CheckCircle2, Shuffle, Palette, Zap } from "lucide-react";

interface HarmonyScheme { id: string; name: string; description: string; colors: string[]; }

export default function ColorHarmony() {
  const [baseColor, setBaseColor] = useState("#3f51b5");
  const [harmonies, setHarmonies] = useState<HarmonyScheme[]>([]);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  const hexToHsl = (hex: string) => { const r = parseInt(hex.slice(1, 3), 16) / 255; const g = parseInt(hex.slice(3, 5), 16) / 255; const b = parseInt(hex.slice(5, 7), 16) / 255; const max = Math.max(r, g, b); const min = Math.min(r, g, b); let h = 0, s = 0, l = (max + min) / 2; if (max !== min) { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: h * 360, s: s * 100, l: l * 100 }; };

  const hslToHex = (h: number, s: number, l: number) => { h = h % 360; s = Math.max(0, Math.min(100, s)) / 100; l = Math.max(0, Math.min(100, l)) / 100; const c = (1 - Math.abs(2 * l - 1)) * s; const x = c * (1 - Math.abs((h / 60) % 2 - 1)); const m = l - c / 2; let r = 0, g = 0, b = 0; if (0 <= h && h < 60) { r = c; g = x; } else if (60 <= h && h < 120) { r = x; g = c; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; } r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };

  useEffect(() => {
    const hsl = hexToHsl(baseColor);
    const schemes: HarmonyScheme[] = [
      { id: "complementary", name: "Complementary", description: "Colors opposite on the color wheel", colors: [baseColor, hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l)] },
      { id: "analogous", name: "Analogous", description: "Colors next to each other on the wheel", colors: [hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l), baseColor, hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)] },
      { id: "triadic", name: "Triadic", description: "Three evenly spaced colors", colors: [baseColor, hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l)] },
      { id: "split-complementary", name: "Split Complementary", description: "Base color plus two adjacent to its complement", colors: [baseColor, hslToHex((hsl.h + 150) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 210) % 360, hsl.s, hsl.l)] },
      { id: "tetradic", name: "Tetradic", description: "Two complementary pairs", colors: [baseColor, hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l), hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l)] },
      { id: "monochromatic", name: "Monochromatic", description: "Variations of the same hue", colors: [hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)), hslToHex(hsl.h, hsl.s, hsl.l), hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 30))] },
    ];
    setHarmonies(schemes);
  }, [baseColor]);

  const copyColor = async (color: string, id: string) => { try { await navigator.clipboard.writeText(color); setCopied(prev => ({ ...prev, [id]: true })); setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000); } catch (err) { console.error(err); } };

  return (
    <ToolLayout toolId="color-harmony">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {harmonies.map((scheme) => (
            <Card key={scheme.id} className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3"><SwatchBook className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{scheme.name}</span></div>
                <p className="text-xs text-muted-foreground font-medium">{scheme.description}</p>
              </div>
              <CardContent className="p-8">
                <div className="flex gap-3">{scheme.colors.map((color, i) => (
                  <button key={i} onClick={() => copyColor(color, `${scheme.id}-${i}`)} className="flex-1 h-24 rounded-2xl border border-border shadow-sm transition-all hover:scale-105 relative group overflow-hidden" style={{ backgroundColor: color }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                      <span className="text-[10px] font-black uppercase bg-white/90 text-black px-2 py-1 rounded-md">{copied[`${scheme.id}-${i}`] ? <CheckCircle2 className="w-3 h-3 inline" /> : color}</span>
                    </div>
                  </button>
                ))}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Base Color</span></div>
            <CardContent className="p-8 space-y-4">
              <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="w-full h-20 rounded-2xl cursor-pointer" />
              <Input type="text" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-sm font-mono font-bold text-center uppercase" />
              <Button onClick={() => setBaseColor("#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"))} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Shuffle className="w-4 h-4 mr-2" /> Randomize</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Info</span></div>
            <CardContent className="p-6"><p className="text-xs text-muted-foreground leading-relaxed font-medium">Click any color swatch to copy its hex value. Each scheme is generated from the base color using color wheel relationships.</p></CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
