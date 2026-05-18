"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Network, 
  Copy, 
  Check, 
  RefreshCw,
  Zap,
  Info,
  Globe,
  Lock,
  Server,
  Activity,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RandomPortGenerator() {
  const [count, setCount] = useState(5);
  const [type, setType] = useState<"ephemeral" | "registered" | "all">("ephemeral");
  const [ports, setPorts] = useState<number[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const generatePorts = () => {
    const newPorts = new Set<number>();
    let min = 0;
    let max = 65535;

    if (type === "ephemeral") {
      min = 49152;
    } else if (type === "registered") {
      min = 1024;
      max = 49151;
    }

    while (newPorts.size < count) {
      const port = Math.floor(Math.random() * (max - min + 1)) + min;
      newPorts.add(port);
    }
    setPorts(Array.from(newPorts));
  };

  useEffect(() => {
    generatePorts();
  }, [count, type]);

  const copy = (val: string, index: number) => {
    navigator.clipboard.writeText(val);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(ports.join(", "));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Server className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Random Port Generator</h1>
          <p className="text-sm text-muted-foreground">
            Generate random non-conflicting TCP/UDP ports for your applications.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-sm font-bold">Port Range</Label>
                  <div className="grid grid-cols-1 gap-2 p-1 bg-muted/50 rounded-2xl border border-border/40">
                    {[
                      { id: "ephemeral", label: "Ephemeral", desc: "49152 - 65535" },
                      { id: "registered", label: "Registered", desc: "1024 - 49151" },
                      { id: "all", label: "Full Range", desc: "0 - 65535" }
                    ].map((opt) => (
                      <Button
                        key={opt.id}
                        variant={type === opt.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setType(opt.id as any)}
                        className={cn(
                          "rounded-xl h-14 justify-between px-6 transition-all",
                          type === opt.id && "shadow-lg shadow-primary/20"
                        )}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-bold text-xs uppercase tracking-wider">{opt.label}</span>
                          <span className={cn("text-[9px] font-mono", type === opt.id ? "text-primary-foreground/70" : "text-muted-foreground")}>{opt.desc}</span>
                        </div>
                        {type === opt.id && <Check className="w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-sm font-bold">Batch Size</Label>
                    <span className="text-xs font-mono font-bold text-primary">{count} Ports</span>
                  </div>
                  <Slider 
                    value={[count]} 
                    onValueChange={([v]) => setCount(v)} 
                    max={20} 
                    min={1} 
                    step={1}
                    className="py-4"
                  />
                </div>
              </div>

              <Button 
                onClick={generatePorts}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Regenerate
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Port Ranges</h3>
            </div>
            <div className="space-y-3 text-[11px] text-muted-foreground leading-relaxed">
              <p><strong>0 - 1023:</strong> Well-known ports (System use only).</p>
              <p><strong>1024 - 49151:</strong> Registered ports (User applications).</p>
              <p><strong>49152 - 65535:</strong> Dynamic/Ephemeral ports (Private use).</p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Generated Ports</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAll}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied === -1 && "text-green-500 hover:text-green-500"
                )}
              >
                {copied === -1 ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied === -1 ? "All Copied" : "Copy All"}
              </Button>
            </div>
            <CardContent className="p-8 flex-1 overflow-auto bg-primary/[0.01]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ports.map((port, i) => (
                  <div 
                    key={i}
                    className="group flex items-center justify-between p-6 rounded-2xl bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-primary/20 transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-xs font-black text-primary shadow-inner shrink-0 border border-primary/10">
                        {i + 1}
                      </div>
                      <span className="font-mono text-2xl font-black tracking-widest">{port}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copy(port.toString(), i)}
                      className="h-10 w-10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      {copied === i ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
