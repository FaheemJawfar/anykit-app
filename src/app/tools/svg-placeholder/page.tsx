"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Download,
  Zap,
  Info,
  Maximize2,
  Palette,
  Type,
  Settings2,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SVGPlaceholderGenerator() {
  const [config, setTags] = useState({
    width: 600,
    height: 400,
    text: "",
    bgColor: "#e2e8f0",
    textColor: "#64748b",
    fontSize: 32
  });
  const [svg, setSvg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const text = config.text || `${config.width} x ${config.height}`;
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}">
  <rect width="100%" height="100%" fill="${config.bgColor}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${config.fontSize}px" fill="${config.textColor}" font-weight="bold">
    ${text}
  </text>
</svg>`;
    setSvg(svgStr);
  }, [config]);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadSVG = () => {
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placeholder-${config.width}x${config.height}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <ImageIcon className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">SVG Placeholder Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create customizable SVG placeholder images for your website prototypes and layouts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Configuration</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Width (px)</Label>
                  <Input 
                    type="number"
                    value={config.width}
                    onChange={(e) => setTags({...config, width: parseInt(e.target.value) || 0})}
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Height (px)</Label>
                  <Input 
                    type="number"
                    value={config.height}
                    onChange={(e) => setTags({...config, height: parseInt(e.target.value) || 0})}
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Custom Text (Optional)</Label>
                <Input 
                  value={config.text}
                  onChange={(e) => setTags({...config, text: e.target.value})}
                  placeholder="Defaults to dimensions..."
                  className="h-12 rounded-xl bg-muted/30 border-border/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Background</Label>
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-xl border border-border/40 overflow-hidden shrink-0">
                      <input 
                        type="color" 
                        value={config.bgColor}
                        onChange={(e) => setTags({...config, bgColor: e.target.value})}
                        className="w-full h-full cursor-pointer scale-150"
                      />
                    </div>
                    <Input 
                      value={config.bgColor}
                      onChange={(e) => setTags({...config, bgColor: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Text Color</Label>
                  <div className="flex gap-2">
                    <div className="w-12 h-12 rounded-xl border border-border/40 overflow-hidden shrink-0">
                      <input 
                        type="color" 
                        value={config.textColor}
                        onChange={(e) => setTags({...config, textColor: e.target.value})}
                        className="w-full h-full cursor-pointer scale-150"
                      />
                    </div>
                    <Input 
                      value={config.textColor}
                      onChange={(e) => setTags({...config, textColor: e.target.value})}
                      className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-xs uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/40">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Font Size</Label>
                  <span className="text-xs font-mono font-bold text-primary">{config.fontSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="8" 
                  max="120" 
                  value={config.fontSize} 
                  onChange={(e) => setTags({...config, fontSize: parseInt(e.target.value)})}
                  className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Canvas</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadSVG}
                className="rounded-xl font-bold px-4 hover:bg-primary/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <CardContent className="p-12 flex-1 flex items-center justify-center bg-muted/20">
              <div 
                className="shadow-2xl rounded-lg overflow-hidden max-w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source Code</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => copy(svg, 'svg')} className="h-8 rounded-xl font-bold">
                  {copied === 'svg' ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                  Copy SVG
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copy(`data:image/svg+xml;base64,${btoa(svg)}`, 'base64')} className="h-8 rounded-xl font-bold">
                  {copied === 'base64' ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                  Copy Base64
                </Button>
              </div>
            </div>
            <CardContent className="p-0">
              <pre className="p-8 font-mono text-[10px] leading-relaxed text-muted-foreground/80 overflow-auto max-h-[150px] bg-primary/[0.01]">
                {svg}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
