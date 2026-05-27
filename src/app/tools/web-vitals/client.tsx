"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Gauge, 
  Zap,
  Clock,
  Activity,
  MousePointerClick,
  Layout,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function WebVitalsSimulator() {
  const [lcpImageSize, setLcpImageSize] = useState([500]); // KB
  const [serverResponse, setServerResponse] = useState([300]); // ms
  const [scriptCount, setScriptCount] = useState([15]);
  const [layoutShifts, setLayoutShifts] = useState([2]); // count
  const [adCount, setAdCount] = useState([3]);

  // LCP estimation (simplified model)
  const estimatedLCP = Math.min(
    4.0,
    (serverResponse[0] / 1000) + (lcpImageSize[0] / 150) + (scriptCount[0] * 0.05)
  );

  // FID estimation (simplified model)
  const estimatedFID = Math.min(
    500,
    scriptCount[0] * 15 + layoutShifts[0] * 20
  );

  // CLS estimation (simplified model)
  const estimatedCLS = Math.min(
    1.0,
    (layoutShifts[0] * 0.08) + (adCount[0] * 0.05) + (scriptCount[0] * 0.002)
  );

  const getScore = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return { label: "Good", color: "text-green-500", bg: "bg-green-500", pct: 100 };
    if (value <= thresholds.poor) return { label: "Needs Improvement", color: "text-orange-400", bg: "bg-orange-400", pct: 50 };
    return { label: "Poor", color: "text-destructive", bg: "bg-destructive", pct: 20 };
  };

  const lcpScore = getScore(estimatedLCP, { good: 2.5, poor: 4.0 });
  const fidScore = getScore(estimatedFID, { good: 100, poor: 300 });
  const clsScore = getScore(estimatedCLS, { good: 0.1, poor: 0.25 });

  const overallScore = Math.round(
    (lcpScore.pct + fidScore.pct + clsScore.pct) / 3
  );

  const GaugeRing = ({ value, max, color, label, metric, unit }: { value: number; max: number; color: string; label: string; metric: string; unit: string }) => {
    const pct = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={color}
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black tracking-tight">{value.toFixed(metric === "CLS" ? 2 : metric === "FID" ? 0 : 1)}</span>
            <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">{unit}</span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold">{metric}</p>
          <p className={cn("text-[10px] font-black uppercase tracking-wider", color)}>{label}</p>
        </div>
      </div>
    );
  };

  return (
    <ToolLayout toolId="web-vitals">

      {/* Overall Score Banner */}
      <Card className={cn(
        "border-border/40 shadow-xl backdrop-blur-sm rounded-[2.5rem] overflow-hidden",
        overallScore >= 80 ? "bg-green-500/5" : overallScore >= 50 ? "bg-orange-500/5" : "bg-destructive/5"
      )}>
        <CardContent className="p-8 flex items-center gap-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0",
            overallScore >= 80 ? "bg-green-500" : overallScore >= 50 ? "bg-orange-400" : "bg-destructive"
          )}>
            {overallScore >= 80 ? <CheckCircle2 className="w-8 h-8" /> : overallScore >= 50 ? <AlertTriangle className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Estimated Performance Score</p>
            <div className="flex items-baseline gap-3">
              <span className={cn(
                "text-5xl font-black tracking-tighter",
                overallScore >= 80 ? "text-green-500" : overallScore >= 50 ? "text-orange-400" : "text-destructive"
              )}>
                {overallScore}
              </span>
              <span className="text-2xl font-bold text-muted-foreground/30">/ 100</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-muted-foreground/40">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Simulated</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Site Parameters</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold">LCP Image Size</Label>
                  <span className="text-xs font-mono font-bold text-primary">{lcpImageSize[0]} KB</span>
                </div>
                <Slider value={lcpImageSize} onValueChange={setLcpImageSize} min={10} max={2000} step={10} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold">Server Response Time</Label>
                  <span className="text-xs font-mono font-bold text-primary">{serverResponse[0]} ms</span>
                </div>
                <Slider value={serverResponse} onValueChange={setServerResponse} min={50} max={1000} step={10} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold">JavaScript Files</Label>
                  <span className="text-xs font-mono font-bold text-primary">{scriptCount[0]}</span>
                </div>
                <Slider value={scriptCount} onValueChange={setScriptCount} min={0} max={50} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold">Layout Shifts</Label>
                  <span className="text-xs font-mono font-bold text-primary">{layoutShifts[0]}</span>
                </div>
                <Slider value={layoutShifts} onValueChange={setLayoutShifts} min={0} max={20} step={1} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-bold">Dynamic Ad Slots</Label>
                  <span className="text-xs font-mono font-bold text-primary">{adCount[0]}</span>
                </div>
                <Slider value={adCount} onValueChange={setAdCount} min={0} max={15} step={1} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center gap-3">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Core Web Vitals</span>
            </div>
            <CardContent className="p-12">
              <div className="grid grid-cols-3 gap-8">
                <GaugeRing 
                  value={estimatedLCP} 
                  max={5} 
                  color={lcpScore.color} 
                  label={lcpScore.label} 
                  metric="LCP"
                  unit="seconds"
                />
                <GaugeRing 
                  value={estimatedFID} 
                  max={500} 
                  color={fidScore.color} 
                  label={fidScore.label} 
                  metric="FID"
                  unit="ms"
                />
                <GaugeRing 
                  value={estimatedCLS} 
                  max={1} 
                  color={clsScore.color} 
                  label={clsScore.label} 
                  metric="CLS"
                  unit="score"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, label: "LCP", desc: "Largest Contentful Paint measures loading performance. Target: < 2.5s", threshold: "< 2.5s" },
              { icon: MousePointerClick, label: "FID", desc: "First Input Delay measures interactivity. Target: < 100ms", threshold: "< 100ms" },
              { icon: Layout, label: "CLS", desc: "Cumulative Layout Shift measures visual stability. Target: < 0.1", threshold: "< 0.1" }
            ].map((item) => (
              <div key={item.label} className="p-6 rounded-2xl bg-muted/20 border border-border/10 space-y-3">
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 text-primary/60" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{item.desc}</p>
                <div className="inline-flex px-2 py-1 rounded-md bg-primary/10 text-[9px] font-black uppercase tracking-wider text-primary">
                  Target: {item.threshold}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
