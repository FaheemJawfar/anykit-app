"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Info,
  Maximize2,
  Palette,
  Settings2,
  Code,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function GlassmorphismStudio() {
  const [config, setConfig] = useState({
    transparency: 0.1,
    blur: 10,
    outline: 0.1,
    saturation: 100,
    color: "#ffffff"
  });
  const [copied, setCopied] = useState(false);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const rgb = hexToRgb(config.color);
  
  const glassStyle = {
    background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.transparency})`,
    backdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%)`,
    WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturation}%)`,
    border: `1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.outline})`,
  };

  const cssCode = `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.transparency});
backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
-webkit-backdrop-filter: blur(${config.blur}px) saturate(${config.saturation}%);
border: 1px solid rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.outline});
border-radius: 16px;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Layers className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Glassmorphism Studio</h1>
          <p className="text-sm text-muted-foreground">
            Generate modern frosted-glass effects with real-time visual controls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visual Rules</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transparency</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.transparency.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={config.transparency} onChange={(e) => setConfig({...config, transparency: parseFloat(e.target.value)})} className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Blur Intensity</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.blur}px</span>
                  </div>
                  <input type="range" min="0" max="50" step="1" value={config.blur} onChange={(e) => setConfig({...config, blur: parseInt(e.target.value)})} className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Outline Alpha</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.outline.toFixed(2)}</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.01" value={config.outline} onChange={(e) => setConfig({...config, outline: parseFloat(e.target.value)})} className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Glass Color</Label>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-xl border border-border/40 overflow-hidden shrink-0">
                      <input type="color" value={config.color} onChange={(e) => setConfig({...config, color: e.target.value})} className="w-full h-full cursor-pointer scale-150" />
                    </div>
                    <div className="flex-1 px-4 rounded-xl bg-muted/30 border border-border/40 flex items-center font-mono text-sm uppercase font-bold text-primary">
                      {config.color}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Design Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Glassmorphism looks best over vibrant, colorful backgrounds. Use higher <strong>Blur</strong> and lower <strong>Transparency</strong> for a more professional "frosted" look.
            </p>
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col min-h-[400px] relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <CardContent className="relative flex-1 flex items-center justify-center p-12">
              <div 
                style={glassStyle}
                className="w-full max-w-sm aspect-video rounded-[2rem] shadow-2xl flex flex-col items-center justify-center p-8 text-white transition-all duration-300"
              >
                <Zap className="w-12 h-12 mb-4 drop-shadow-lg" />
                <h3 className="text-2xl font-black tracking-tight drop-shadow-md">Glass Effect</h3>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mt-2">Interactive Preview</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">CSS Properties</span>
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
                {copied ? "Copied" : "Copy CSS"}
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
    </div>
  );
}
