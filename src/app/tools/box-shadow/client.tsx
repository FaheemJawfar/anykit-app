"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Copy, 
  Check, 
  Zap,
  Info,
  Maximize2,
  Box,
  Settings2,
  Code,
  Layers,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BoxShadowStudio() {
  const [config, setConfig] = useState({
    x: 0,
    y: 10,
    blur: 20,
    spread: -5,
    opacity: 0.1,
    color: "#000000",
    inset: false,
    boxColor: "#ffffff",
    bgColor: "#f8fafc"
  });
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgb = hexToRgb(config.color);
  const shadowValue = `${config.inset ? 'inset ' : ''}${config.x}px ${config.y}px ${config.blur}px ${config.spread}px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.opacity})`;

  const cssCode = `box-shadow: ${shadowValue};
border-radius: 24px;
background-color: ${config.boxColor};`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="box-shadow">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shadow Properties</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">X Offset</Label>
                      <span className="text-xs font-mono font-bold text-primary">{config.x}px</span>
                    </div>
                    <Slider value={[config.x]} min={-100} max={100} step={1} onValueChange={([v]) => setConfig({...config, x: v})} />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Y Offset</Label>
                      <span className="text-xs font-mono font-bold text-primary">{config.y}px</span>
                    </div>
                    <Slider value={[config.y]} min={-100} max={100} step={1} onValueChange={([v]) => setConfig({...config, y: v})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Blur Radius</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.blur}px</span>
                  </div>
                  <Slider value={[config.blur]} min={0} max={100} step={1} onValueChange={([v]) => setConfig({...config, blur: v})} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Spread Radius</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.spread}px</span>
                  </div>
                  <Slider value={[config.spread]} min={-50} max={50} step={1} onValueChange={([v]) => setConfig({...config, spread: v})} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shadow Opacity</Label>
                    <span className="text-xs font-mono font-bold text-primary">{(config.opacity * 100).toFixed(0)}%</span>
                  </div>
                  <Slider value={[config.opacity]} min={0} max={1} step={0.01} onValueChange={([v]) => setConfig({...config, opacity: v})} />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/40 transition-all hover:bg-muted/50">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-bold">Inset Shadow</Label>
                      <p className="text-[10px] text-muted-foreground">Internal shadow effect</p>
                    </div>
                    <Switch checked={config.inset} onCheckedChange={(v) => setConfig({...config, inset: v})} />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Shadow Color</Label>
                    <div className="flex gap-2">
                      <div className="w-10 h-10 rounded-xl border border-border/40 overflow-hidden shrink-0">
                        <input type="color" value={config.color} onChange={(e) => setConfig({...config, color: e.target.value})} className="w-full h-full cursor-pointer scale-150" />
                      </div>
                      <input 
                        value={config.color} 
                        onChange={(e) => setConfig({...config, color: e.target.value})}
                        className="flex-1 bg-muted/30 border border-border/40 rounded-xl px-3 text-xs font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Environment</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold">Box Color</Label>
                  <div className="flex gap-2">
                    <input type="color" value={config.boxColor} onChange={(e) => setConfig({...config, boxColor: e.target.value})} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                    <Input value={config.boxColor} onChange={(e) => setConfig({...config, boxColor: e.target.value})} className="h-8 text-[10px] font-mono" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold">Background</Label>
                  <div className="flex gap-2">
                    <input type="color" value={config.bgColor} onChange={(e) => setConfig({...config, bgColor: e.target.value})} className="w-8 h-8 rounded-lg border border-border/40 cursor-pointer" />
                    <Input value={config.bgColor} onChange={(e) => setConfig({...config, bgColor: e.target.value})} className="h-8 text-[10px] font-mono" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden flex flex-col min-h-[450px] relative transition-colors duration-500" style={{ backgroundColor: config.bgColor }}>
            <div className="absolute top-8 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-border/20">
                Live Preview
              </div>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12">
              <div 
                style={{
                  backgroundColor: config.boxColor,
                  boxShadow: shadowValue,
                  borderRadius: '32px'
                }}
                className="w-full max-w-sm aspect-square flex flex-col items-center justify-center p-8 transition-all duration-300 group"
              >
                <Box className="w-16 h-16 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl font-bold mt-6 opacity-30">Preview Box</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">CSS Syntax</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Style"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              <pre className="p-8 font-mono text-[11px] leading-loose text-foreground/80 overflow-auto selection:bg-primary/20">
                {cssCode}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
