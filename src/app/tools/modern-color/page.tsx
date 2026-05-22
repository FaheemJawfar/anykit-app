"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Copy, 
  Check, 
  Zap,
  Info,
  RefreshCw,
  Pipette,
  SlidersHorizontal,
  Hash,
  Droplets,
  Sun,
  CircleDot
} from "lucide-react";
import { cn } from "@/lib/utils";
import { converter, formatHex, parse, oklch, rgb, lab, lch } from "culori";

const toOklch = converter("oklch");
const toLab = converter("lab");
const toLch = converter("lch");
const toRgb = converter("rgb");
const toHsl = converter("hsl");

export default function ModernColorConverter() {
  const [hex, setHex] = useState("#6366f1");
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = parse(hex);
  
  const rgbVal = parsed ? toRgb(parsed) : null;
  const hslVal = parsed ? toHsl(parsed) : null;
  const oklchVal = parsed ? toOklch(parsed) : null;
  const labVal = parsed ? toLab(parsed) : null;
  const lchVal = parsed ? toLch(parsed) : null;

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    const newColor = { mode: "rgb" as const, r: r / 255, g: g / 255, b: b / 255 };
    setHex(formatHex(newColor) || "#000000");
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const newColor = { mode: "hsl" as const, h, s: s / 100, l: l / 100 };
    setHex(formatHex(newColor) || "#000000");
  };

  const handleHexChange = (val: string) => {
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      setHex(val);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Pipette className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Modern Color Converter</h1>
          <p className="text-sm text-muted-foreground">
            Convert between HEX, RGB, HSL, OKLCH, LAB, and LCH color spaces.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Preview Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div 
                className="w-full aspect-square rounded-[2rem] shadow-2xl border-4 border-white/10 transition-all duration-300"
                style={{ backgroundColor: hex }}
              />
              <div className="text-center space-y-1">
                <p className="text-3xl font-black tracking-tight">{hex.toUpperCase()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Preview Swatch</p>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">CSS Color Spaces</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              OKLCH and LAB are perceptually uniform color spaces. Unlike RGB/HSL, they ensure that changing a value results in a visually proportional change. Ideal for design systems.
            </p>
          </div>
        </div>

        {/* Converter Side */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Color Values</span>
            </div>
            <CardContent className="p-8 space-y-8">
              {/* HEX Input */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">HEX</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                    <Input 
                      value={hex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg font-bold tracking-wider focus:ring-primary/20"
                    />
                  </div>
                  <Button variant="outline" onClick={() => copy(hex, "hex")} className="h-14 w-14 rounded-2xl border-border/40">
                    {copied === "hex" ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {/* RGB Inputs */}
              {rgbVal && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">RGB</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "R", val: Math.round(rgbVal.r * 255), color: "text-red-500" },
                      { label: "G", val: Math.round(rgbVal.g * 255), color: "text-green-500" },
                      { label: "B", val: Math.round(rgbVal.b * 255), color: "text-blue-500" }
                    ].map((c) => (
                      <div key={c.label} className="relative">
                        <Input 
                          type="number"
                          min={0}
                          max={255}
                          value={c.val}
                          onChange={(e) => {
                            const newVal = parseInt(e.target.value) || 0;
                            updateFromRgb(
                              c.label === "R" ? newVal : Math.round(rgbVal.r * 255),
                              c.label === "G" ? newVal : Math.round(rgbVal.g * 255),
                              c.label === "B" ? newVal : Math.round(rgbVal.b * 255)
                            );
                          }}
                          className={cn("h-14 pl-10 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg font-bold focus:ring-primary/20", c.color)}
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-30">{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                    <code className="text-xs font-mono text-foreground/70">rgb({Math.round(rgbVal.r * 255)}, {Math.round(rgbVal.g * 255)}, {Math.round(rgbVal.b * 255)})</code>
                    <Button variant="ghost" size="sm" onClick={() => copy(`rgb(${Math.round(rgbVal.r * 255)}, ${Math.round(rgbVal.g * 255)}, ${Math.round(rgbVal.b * 255)})`, "rgb-func")} className="h-7 text-[10px] font-bold">
                      {copied === "rgb-func" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}

              {/* HSL Inputs */}
              {hslVal && (
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">HSL</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "H", val: Math.round(hslVal.h || 0), suffix: "°", max: 360 },
                      { label: "S", val: Math.round((hslVal.s || 0) * 100), suffix: "%", max: 100 },
                      { label: "L", val: Math.round((hslVal.l || 0) * 100), suffix: "%", max: 100 }
                    ].map((c) => (
                      <div key={c.label} className="relative">
                        <Input 
                          type="number"
                          min={0}
                          max={c.max}
                          value={c.val}
                          onChange={(e) => {
                            const newVal = parseInt(e.target.value) || 0;
                            updateFromHsl(
                              c.label === "H" ? newVal : Math.round(hslVal.h || 0),
                              c.label === "S" ? newVal : Math.round((hslVal.s || 0) * 100),
                              c.label === "L" ? newVal : Math.round((hslVal.l || 0) * 100)
                            );
                          }}
                          className="h-14 pl-10 pr-8 rounded-2xl bg-muted/30 border-border/40 font-mono text-lg font-bold focus:ring-primary/20"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black opacity-30">{c.label}</span>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold opacity-30">{c.suffix}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between bg-muted/20 rounded-xl p-3">
                    <code className="text-xs font-mono text-foreground/70">hsl({Math.round(hslVal.h || 0)}, {Math.round((hslVal.s || 0) * 100)}%, {Math.round((hslVal.l || 0) * 100)}%)</code>
                    <Button variant="ghost" size="sm" onClick={() => copy(`hsl(${Math.round(hslVal.h || 0)}, ${Math.round((hslVal.s || 0) * 100)}%, ${Math.round((hslVal.l || 0) * 100)}%)`, "hsl-func")} className="h-7 text-[10px] font-bold">
                      {copied === "hsl-func" ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Modern Spaces */}
              <div className="space-y-4 pt-4 border-t border-border/20">
                <div className="flex items-center gap-2">
                  <CircleDot className="w-4 h-4 text-primary/40" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Perceptually Uniform Spaces</span>
                </div>
                
                {oklchVal && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">OKLCH</Label>
                    <div className="flex items-center justify-between bg-muted/20 rounded-xl p-4">
                      <code className="text-sm font-mono font-bold text-foreground/80">
                        oklch({(oklchVal.l * 100).toFixed(1)}% {(oklchVal.c || 0).toFixed(3)} {Math.round(oklchVal.h || 0)})
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => copy(`oklch(${(oklchVal.l * 100).toFixed(1)}% ${(oklchVal.c || 0).toFixed(3)} ${Math.round(oklchVal.h || 0)})`, "oklch")} className="h-7 text-[10px] font-bold">
                        {copied === "oklch" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                )}

                {labVal && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">LAB</Label>
                    <div className="flex items-center justify-between bg-muted/20 rounded-xl p-4">
                      <code className="text-sm font-mono font-bold text-foreground/80">
                        lab({(labVal.l).toFixed(1)}% {(labVal.a || 0).toFixed(1)} {(labVal.b || 0).toFixed(1)})
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => copy(`lab(${(labVal.l).toFixed(1)}% ${(labVal.a || 0).toFixed(1)} ${(labVal.b || 0).toFixed(1)})`, "lab")} className="h-7 text-[10px] font-bold">
                        {copied === "lab" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                )}

                {lchVal && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">LCH</Label>
                    <div className="flex items-center justify-between bg-muted/20 rounded-xl p-4">
                      <code className="text-sm font-mono font-bold text-foreground/80">
                        lch({(lchVal.l).toFixed(1)}% {(lchVal.c || 0).toFixed(1)} {Math.round(lchVal.h || 0)})
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => copy(`lch(${(lchVal.l).toFixed(1)}% ${(lchVal.c || 0).toFixed(1)} ${Math.round(lchVal.h || 0)})`, "lch")} className="h-7 text-[10px] font-bold">
                        {copied === "lch" ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
