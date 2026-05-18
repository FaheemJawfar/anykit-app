"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Eye, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Info,
  ShieldCheck,
  ShieldAlert,
  Search,
  Palette,
  Type,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState("#ffffff");
  const [background, setBackground] = useState("#6366f1");
  const [copied, setCopied] = useState<string | null>(null);

  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const contrast = useMemo(() => {
    const rgb1 = hexToRgb(foreground);
    const rgb2 = hexToRgb(background);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return ratio.toFixed(2);
  }, [foreground, background]);

  const ratioNum = parseFloat(contrast);
  const aaLevel = ratioNum >= 4.5;
  const aaaLevel = ratioNum >= 7;
  const aaLargeLevel = ratioNum >= 3;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Palette className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Color Contrast Checker</h1>
          <p className="text-sm text-muted-foreground">
            Verify accessibility compliance (WCAG 2.1) between text and background colors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Foreground (Text)</Label>
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-2xl border border-border/40 overflow-hidden shrink-0 shadow-inner">
                      <input type="color" value={foreground} onChange={(e) => setForeground(e.target.value)} className="w-full h-full cursor-pointer scale-150" />
                    </div>
                    <Input value={foreground} onChange={(e) => setForeground(e.target.value)} className="h-14 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl font-bold uppercase" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Background Color</Label>
                  <div className="flex gap-3">
                    <div className="w-14 h-14 rounded-2xl border border-border/40 overflow-hidden shrink-0 shadow-inner">
                      <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="w-full h-full cursor-pointer scale-150" />
                    </div>
                    <Input value={background} onChange={(e) => setBackground(e.target.value)} className="h-14 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl font-bold uppercase" />
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setForeground(background); setBackground(foreground); }}
                  className="rounded-xl font-bold h-10 px-6 border border-border/20 hover:bg-primary/5"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Swap Colors
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Compliance Guide</h3>
            </div>
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <p><strong>AA (Normal):</strong> 4.5:1 ratio required.</p>
              <p><strong>AA (Large Text):</strong> 3:1 ratio required.</p>
              <p><strong>AAA (Enhanced):</strong> 7:1 ratio required.</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col relative">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Contrast Score</span>
              </div>
            </div>
            
            <CardContent className="p-0 flex-1 flex flex-col">
              {/* Preview Box */}
              <div 
                style={{ backgroundColor: background, color: foreground }}
                className="p-16 text-center transition-colors duration-500 min-h-[300px] flex flex-col items-center justify-center gap-6"
              >
                <h3 className="text-5xl font-black tracking-tight leading-none">The quick brown fox</h3>
                <p className="text-lg font-medium opacity-90 max-w-sm mx-auto">
                  Jumps over the lazy dog. This is how your text looks with the current combination.
                </p>
              </div>

              {/* Status Badges */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/10 border-t border-border/10">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Contrast Ratio</p>
                    <p className="text-4xl font-black text-primary">{contrast}:1</p>
                  </div>
                </div>

                <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between",
                    aaLevel ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-destructive/10 border-destructive/20 text-destructive"
                  )}>
                    <div className="flex items-center gap-3">
                      {aaLevel ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                      <span className="text-sm font-black uppercase tracking-widest">WCAG AA</span>
                    </div>
                    <span className="text-[10px] font-bold">{aaLevel ? "PASSED" : "FAILED"}</span>
                  </div>

                  <div className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between",
                    aaaLevel ? "bg-green-500/10 border-green-500/20 text-green-600" : "bg-destructive/10 border-destructive/20 text-destructive"
                  )}>
                    <div className="flex items-center gap-3">
                      {aaaLevel ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                      <span className="text-sm font-black uppercase tracking-widest">WCAG AAA</span>
                    </div>
                    <span className="text-[10px] font-bold">{aaaLevel ? "PASSED" : "FAILED"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
