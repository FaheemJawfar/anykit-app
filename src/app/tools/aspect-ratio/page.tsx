"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Maximize2, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  RefreshCw,
  Layout,
  Smartphone,
  Monitor,
  Tv,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolLayout } from "@/components/tool-layout";

export default function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState("16");
  const [ratioH, setRatioH] = useState("9");
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [copied, setCopied] = useState<string | null>(null);

  const calculateHeight = (w: string, rw: string, rh: string) => {
    const wVal = parseFloat(w);
    const rwVal = parseFloat(rw);
    const rhVal = parseFloat(rh);
    if (!isNaN(wVal) && !isNaN(rwVal) && !isNaN(rhVal) && rwVal !== 0) {
      setHeight(Math.round((wVal * rhVal) / rwVal).toString());
    }
  };

  const calculateWidth = (h: string, rw: string, rh: string) => {
    const hVal = parseFloat(h);
    const rwVal = parseFloat(rw);
    const rhVal = parseFloat(rh);
    if (!isNaN(hVal) && !isNaN(rwVal) && !isNaN(rhVal) && rhVal !== 0) {
      setWidth(Math.round((hVal * rwVal) / rhVal).toString());
    }
  };

  const applyPreset = (rw: string, rh: string) => {
    setRatioW(rw);
    setRatioH(rh);
    calculateHeight(width, rw, rh);
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout toolId="aspect-ratio">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Aspect Ratio</Label>
                  <div className="flex items-center gap-4">
                    <Input 
                      type="number"
                      value={ratioW}
                      onChange={(e) => {
                        setRatioW(e.target.value);
                        calculateHeight(width, e.target.value, ratioH);
                      }}
                      className="h-16 rounded-2xl bg-muted/30 border-border/40 font-bold text-2xl focus:ring-primary/20 text-center"
                    />
                    <span className="text-2xl font-black opacity-20">:</span>
                    <Input 
                      type="number"
                      value={ratioH}
                      onChange={(e) => {
                        setRatioH(e.target.value);
                        calculateHeight(width, ratioW, e.target.value);
                      }}
                      className="h-16 rounded-2xl bg-muted/30 border-border/40 font-bold text-2xl focus:ring-primary/20 text-center"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Dimensions</Label>
                  <div className="space-y-4">
                    <div className="space-y-2 group">
                      <div className="flex justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Width (px)</span>
                        <Button 
                          variant="ghost" size="sm" onClick={() => copy(width, 'w')}
                          className="h-5 px-2 rounded-lg text-[8px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-all"
                        >
                          {copied === 'w' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                          Copy
                        </Button>
                      </div>
                      <Input 
                        type="number"
                        value={width}
                        onChange={(e) => {
                          setWidth(e.target.value);
                          calculateHeight(e.target.value, ratioW, ratioH);
                        }}
                        className="h-14 rounded-xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                      />
                    </div>

                    <div className="flex justify-center">
                      <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                        <RefreshCw className="w-3 h-3 text-primary/40" />
                      </div>
                    </div>

                    <div className="space-y-2 group">
                      <div className="flex justify-between px-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Height (px)</span>
                        <Button 
                          variant="ghost" size="sm" onClick={() => copy(height, 'h')}
                          className="h-5 px-2 rounded-lg text-[8px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-all"
                        >
                          {copied === 'h' ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
                          Copy
                        </Button>
                      </div>
                      <Input 
                        type="number"
                        value={height}
                        onChange={(e) => {
                          setHeight(e.target.value);
                          calculateWidth(e.target.value, ratioW, ratioH);
                        }}
                        className="h-14 rounded-xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Common Presets</span>
            </div>
            <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "HD Video", ratio: "16:9", icon: Tv },
                { label: "Standard", ratio: "4:3", icon: Monitor },
                { label: "Classic", ratio: "3:2", icon: Smartphone },
                { label: "Square", ratio: "1:1", icon: Layout },
                { label: "Portrait", ratio: "9:16", icon: Smartphone },
                { label: "Cinema", ratio: "21:9", icon: Tv }
              ].map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  onClick={() => applyPreset(preset.ratio.split(':')[0], preset.ratio.split(':')[1])}
                  className="h-20 rounded-2xl border-border/40 flex flex-col items-center justify-center gap-1.5 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  <preset.icon className="w-4 h-4 text-primary/40" />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase text-foreground/80">{preset.label}</p>
                    <p className="text-xs font-mono font-bold text-primary">{preset.ratio}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden flex flex-col min-h-[300px] relative bg-muted/20">
            <CardContent className="flex-1 flex items-center justify-center p-12">
              <div 
                style={{
                  aspectRatio: `${ratioW} / ${ratioH}`,
                  width: '100%',
                  maxWidth: '400px'
                }}
                className="bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center shadow-xl animate-in zoom-in-95 duration-500"
              >
                <div className="text-center space-y-1">
                  <p className="text-2xl font-black text-primary tracking-tight">{ratioW}:{ratioH}</p>
                  <p className="text-[10px] font-bold uppercase text-primary/40 tracking-[0.2em]">Aspect Preview</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
