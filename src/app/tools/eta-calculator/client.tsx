"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Play,
  RotateCcw,
  Timer,
  Navigation,
  Activity,
  History,
  TrendingUp,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ETACalculator() {
  const [total, setTotal] = useState<number>(100);
  const [processed, setProcessed] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [unit, setSpeedUnit] = useState("items/s");
  const [eta, setEta] = useState<string>("");
  const [percentage, setPercentage] = useState(0);

  const calculateETA = () => {
    if (total <= 0 || processed < 0 || speed <= 0) {
      setEta("N/A");
      setPercentage(0);
      return;
    }

    const remaining = total - processed;
    if (remaining <= 0) {
      setEta("Completed");
      setPercentage(100);
      return;
    }

    const seconds = remaining / speed;
    setPercentage(Math.min(100, (processed / total) * 100));

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    
    setEta(parts.join(" "));
  };

  useEffect(() => {
    calculateETA();
  }, [total, processed, speed]);

  const clear = () => {
    setTotal(100);
    setProcessed(0);
    setSpeed(1);
  };

  return (
    <ToolLayout toolId="eta-calculator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Total Workload</Label>
                  <Input 
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(parseFloat(e.target.value) || 0)}
                    className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-bold text-xl focus:ring-primary/20"
                    placeholder="e.g. 1000"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Work Done (Processed)</Label>
                  <Input 
                    type="number"
                    value={processed}
                    onChange={(e) => setProcessed(parseFloat(e.target.value) || 0)}
                    className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-bold text-xl focus:ring-primary/20"
                    placeholder="e.g. 250"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Processing Speed</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="number"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
                      className="h-14 px-6 rounded-2xl bg-muted/30 border-border/40 font-bold text-xl focus:ring-primary/20 flex-1"
                      placeholder="e.g. 10"
                    />
                    <select 
                      value={unit} 
                      onChange={(e) => setSpeedUnit(e.target.value)}
                      className="h-14 px-4 rounded-2xl bg-muted/50 border border-border/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="items/s">Items/s</option>
                      <option value="kb/s">KB/s</option>
                      <option value="mb/s">MB/s</option>
                      <option value="% /s">% /s</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button 
                variant="ghost"
                onClick={clear}
                className="w-full h-12 rounded-xl font-bold text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Calculator
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Time Prediction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full", processed < total ? "bg-green-500 animate-pulse" : "bg-primary")} />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  {processed < total ? "Calculating..." : "Finished"}
                </span>
              </div>
            </div>
            
            <CardContent className="p-8 flex-1 flex flex-col items-center justify-center space-y-12 bg-primary/[0.01]">
              <div className="space-y-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estimated Remaining Time</p>
                <div className="text-7xl md:text-8xl font-black tracking-tighter text-foreground drop-shadow-sm">
                  {eta}
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overall Progress</span>
                  <span className="text-xl font-black text-primary tracking-tighter">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden p-1 border border-border/20 shadow-inner">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 relative group"
                    style={{ width: `${percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 flex flex-col items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground/40" />
                  <span className="text-[8px] font-bold uppercase text-muted-foreground">Remaining</span>
                  <span className="text-sm font-bold">{Math.max(0, total - processed).toLocaleString()}</span>
                </div>
                <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 flex flex-col items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
                  <span className="text-[8px] font-bold uppercase text-muted-foreground">Speed</span>
                  <span className="text-sm font-bold">{speed} {unit}</span>
                </div>
                <div className="p-4 rounded-3xl bg-muted/20 border border-border/10 flex flex-col items-center gap-2">
                  <Percent className="w-4 h-4 text-muted-foreground/40" />
                  <span className="text-[8px] font-bold uppercase text-muted-foreground">Ratio</span>
                  <span className="text-sm font-bold">1:{((total - processed) / (speed || 1)).toFixed(0)}s</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-[2.5rem] bg-muted/30 border border-border/40 flex items-start gap-6">
            <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner shrink-0">
              <Info className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm">How it's calculated</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                The ETA is calculated by taking the <strong>remaining workload</strong> (Total - Done) and dividing it by your <strong>current speed</strong>. This assumes a constant rate of progress.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
