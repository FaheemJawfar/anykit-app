"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Palette, 
  Copy, 
  Check, 
  RefreshCcw, 
  Maximize2, 
  Sliders, 
  LayoutGrid,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ColorConverter() {
  const [hex, setHex] = useState("#4f46e5");
  const [rgb, setRgb] = useState({ r: 79, g: 70, b: 229 });
  const [hsl, setHsl] = useState({ h: 243, s: 75, l: 59 });
  const [copied, setCopied] = useState<string | null>(null);

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }, []);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  useEffect(() => {
    const rgbFromHex = hexToRgb(hex);
    if (rgbFromHex) {
      setRgb(rgbFromHex);
      setHsl(rgbToHsl(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b));
    }
  }, [hex, hexToRgb]);

  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    const numValue = parseInt(value) || 0;
    const newRgb = { ...rgb, [channel]: Math.min(255, Math.max(0, numValue)) };
    setRgb(newRgb);
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getContrastColor = (hexColor: string) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "text-black" : "text-white";
  };

  const generateShades = () => {
    return [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(factor => {
      const r = Math.round(rgb.r * (1 - factor));
      const g = Math.round(rgb.g * (1 - factor));
      const b = Math.round(rgb.b * (1 - factor));
      return rgbToHex(r, g, b);
    });
  };

  return (
    <ToolLayout toolId="color-converter">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div 
              className={cn("w-full h-64 flex flex-col items-center justify-center space-y-4 transition-colors duration-300 relative group", getContrastColor(hex))}
              style={{ backgroundColor: hex }}
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-6xl font-mono font-bold tracking-tighter uppercase relative z-10">{hex}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md font-bold transition-all relative z-10", getContrastColor(hex))}
                onClick={() => copy(hex, 'main')}
              >
                {copied === 'main' ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === 'main' ? "Copied" : "Copy HEX"}
              </Button>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">HEX Code</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      value={hex} 
                      onChange={(e) => setHex(e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl cursor-pointer bg-background" 
                    />
                    <Input 
                      value={hex} 
                      onChange={(e) => setHex(e.target.value)}
                      className="flex-1 font-mono uppercase h-12 rounded-xl bg-muted/30 border-transparent focus:border-primary/20" 
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">RGB Values</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["r", "g", "b"].map((c) => (
                      <div key={c} className="relative">
                        <Input 
                          type="number" 
                          min={0} max={255} 
                          value={rgb[c as keyof typeof rgb]} 
                          onChange={(e) => handleRgbChange(c as any, e.target.value)}
                          className="h-12 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-center font-mono" 
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/30 uppercase">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Adjust Channels</span>
                </div>
                <div className="space-y-4">
                  {Object.entries(rgb).map(([c, v]) => (
                    <div key={c} className="flex items-center gap-6">
                      <span className="w-4 text-[10px] font-bold uppercase text-muted-foreground">{c}</span>
                      <input 
                        type="range" min={0} max={255} value={v} 
                        onChange={(e) => handleRgbChange(c as any, e.target.value)}
                        className="flex-1 h-1.5 bg-muted rounded-full appearance-none accent-primary"
                      />
                      <span className="w-8 text-xs font-mono font-bold text-right">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Shades & Tints</span>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-3">
                {generateShades().map((shade, i) => (
                  <button 
                    key={i}
                    className="group relative aspect-square rounded-2xl overflow-hidden border border-border/20 transition-transform active:scale-95"
                    style={{ backgroundColor: shade }}
                    onClick={() => setHex(shade)}
                    title={shade}
                  >
                    <div className={cn("absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 text-[10px] font-mono font-bold", getContrastColor(shade))}>
                      {shade}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Copy Formats</span>
            </div>
            <CardContent className="p-6 space-y-3">
              {[
                { label: "HEX", value: hex.toUpperCase() },
                { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
                { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
                { label: "CSS", value: `background-color: ${hex};` },
              ].map((format) => (
                <div key={format.label} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/10 transition-colors group">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60">{format.label}</p>
                    <p className="text-xs font-mono font-medium">{format.value}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8 rounded-lg", copied === format.label && "text-green-500")}
                    onClick={() => copy(format.value, format.label)}
                  >
                    {copied === format.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}

