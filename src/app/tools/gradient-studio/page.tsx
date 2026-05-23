"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Copy, 
  Check, 
  Zap,
  Info,
  Palette,
  Settings2,
  Code,
  ArrowRight,
  Plus,
  Trash2,
  MoveHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorStop {
  color: string;
  position: number;
  id: number;
}

export default function GradientStudio() {
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#6366f1", position: 0, id: 1 },
    { color: "#ec4899", position: 100, id: 2 }
  ]);
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [copied, setCopied] = useState(false);

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);
  const gradientStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(", ");
  
  const cssValue = type === "linear" 
    ? `linear-gradient(${angle}deg, ${gradientStr})`
    : `radial-gradient(circle, ${gradientStr})`;

  const addStop = () => {
    if (stops.length >= 5) return;
    const newId = Math.max(...stops.map(s => s.id)) + 1;
    setStops([...stops, { color: "#ffffff", position: 50, id: newId }]);
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter(s => s.id !== id));
  };

  const updateStop = (id: number, updates: Partial<ColorStop>) => {
    setStops(stops.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`background: ${cssValue};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Palette className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Gradient Studio</h1>
          <p className="text-sm text-muted-foreground">
            Create professional linear and radial CSS gradients with multi-stop precision.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gradient Settings</span>
                  </div>
                  <div className="flex bg-muted/50 p-1 rounded-xl border border-border/40">
                    <Button 
                      variant={type === "linear" ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => setType("linear")}
                      className="h-7 text-[10px] uppercase font-bold rounded-lg"
                    >Linear</Button>
                    <Button 
                      variant={type === "radial" ? "default" : "ghost"} 
                      size="sm" 
                      onClick={() => setType("radial")}
                      className="h-7 text-[10px] uppercase font-bold rounded-lg"
                    >Radial</Button>
                  </div>
                </div>

                {type === "linear" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Angle</Label>
                      <span className="text-xs font-mono font-bold text-primary">{angle}°</span>
                    </div>
                    <Slider value={[angle]} min={0} max={360} step={1} onValueChange={([v]) => setAngle(v)} />
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Color Stops</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={addStop} 
                      disabled={stops.length >= 5}
                      className="h-7 rounded-lg text-primary hover:bg-primary/5"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Stop
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {stops.map((stop) => (
                      <div key={stop.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-4 group">
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2 items-center">
                            <div className="w-8 h-8 rounded-lg border border-border/40 overflow-hidden shrink-0">
                              <input 
                                type="color" 
                                value={stop.color} 
                                onChange={(e) => updateStop(stop.id, { color: e.target.value })} 
                                className="w-full h-full cursor-pointer scale-150" 
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase text-muted-foreground">{stop.color}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeStop(stop.id)}
                            disabled={stops.length <= 2}
                            className="h-6 w-6 rounded-md text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between px-1">
                            <span className="text-[8px] font-bold uppercase text-muted-foreground">Position</span>
                            <span className="text-[10px] font-mono font-bold text-primary">{stop.position}%</span>
                          </div>
                          <Slider 
                            value={[stop.position]} 
                            min={0} 
                            max={100} 
                            step={1} 
                            onValueChange={([v]) => updateStop(stop.id, { position: v })} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden flex flex-col min-h-[450px] relative">
            <div 
              style={{ background: cssValue }} 
              className="absolute inset-0 transition-all duration-700" 
            />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
            
            <div className="absolute top-8 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-black/40 text-[10px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md border border-white/10">
                Visual Preview
              </div>
            </div>

            <CardContent className="relative flex-1 flex items-center justify-center p-12">
              <div className="text-white text-center drop-shadow-2xl animate-in zoom-in-95 duration-500">
                <Palette className="w-20 h-20 mx-auto mb-6 opacity-80" />
                <h3 className="text-4xl font-black tracking-tighter">Gradient Mesh</h3>
                <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-2">AnyKit App Visual Lab</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">CSS Property</span>
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
              <pre className="p-8 font-mono text-[11px] leading-loose text-foreground/80 overflow-auto whitespace-pre-wrap selection:bg-primary/20">
                background: {cssValue};
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
