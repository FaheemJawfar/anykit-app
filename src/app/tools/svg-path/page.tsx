"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Settings2,
  Code,
  PenTool,
  Maximize2,
  Download,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SVGPathEditor() {
  const [path, setPath] = useState("M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80");
  const [fill, setFill] = useState("transparent");
  const [stroke, setStroke] = useState("#6366f1");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [copied, setCopied] = useState(false);

  const fullSvg = `<svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <path d="${path}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullSvg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSVG = () => {
    const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "path-export.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="svg-path">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Path Data (d)</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPath("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-8">
              <Textarea
                placeholder="M10 10 L90 90..."
                value={path}
                onChange={(e) => setPath(e.target.value)}
                className="w-full h-32 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-lg leading-relaxed"
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Styles</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold">Stroke Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                    <Input value={stroke} onChange={(e) => setStroke(e.target.value)} className="h-8 text-[10px] font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold">Fill Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={fill === "transparent" ? "#ffffff" : fill} onChange={(e) => setFill(e.target.value)} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setFill(fill === "transparent" ? "#6366f1" : "transparent")}
                      className="h-8 text-[8px] uppercase font-bold"
                    >
                      {fill === "transparent" ? "Set Fill" : "Transparent"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between px-1">
                  <Label className="text-[10px] font-bold">Stroke Width</Label>
                  <span className="text-xs font-mono font-bold text-primary">{strokeWidth}px</span>
                </div>
                <input type="range" min="1" max="20" value={strokeWidth} onChange={(e) => setStrokeWidth(parseInt(e.target.value))} className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Canvas Side */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col relative aspect-square bg-muted/20 group">
            <div className="absolute top-8 right-8 z-10 flex gap-2">
              <Button size="sm" variant="outline" onClick={downloadSVG} className="rounded-xl font-bold bg-white/80 dark:bg-black/80 backdrop-blur-md">
                <Download className="w-4 h-4 mr-2" />
                Export SVG
              </Button>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12">
              <div className="w-full h-full border border-border/20 rounded-2xl bg-background shadow-inner relative overflow-hidden">
                {/* Coordinate Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <svg width="100%" height="100%" viewBox="0 0 200 200" className="relative z-10 drop-shadow-2xl transition-all duration-500">
                  <path 
                    d={path} 
                    fill={fill} 
                    stroke={stroke} 
                    strokeWidth={strokeWidth} 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-500"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">SVG Code</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
            <CardContent className="p-0">
              <pre className="p-8 font-mono text-[10px] leading-relaxed text-muted-foreground/80 overflow-auto max-h-[150px] bg-primary/[0.01]">
                {fullSvg}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
