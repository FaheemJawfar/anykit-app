"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Percent, 
  ArrowUpRight, 
  ArrowDownRight, 
  Equal, 
  Calculator, 
  History,
  Eraser,
  Copy,
  Check,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PercentageCalculator() {
  const [copied, setCopied] = useState<string | null>(null);
  
  // What is X% of Y?
  const [val1_is, setVal1_is] = useState("");
  const [val2_is, setVal2_is] = useState("");
  
  // X is what % of Y?
  const [val1_pct, setVal1_pct] = useState("");
  const [val2_pct, setVal2_pct] = useState("");
  
  // Increase/Decrease
  const [val1_trend, setVal1_trend] = useState("");
  const [val2_trend, setVal2_trend] = useState("");

  const results = useMemo(() => {
    const v1_is = parseFloat(val1_is);
    const v2_is = parseFloat(val2_is);
    const v1_pct = parseFloat(val1_pct);
    const v2_pct = parseFloat(val2_pct);
    const v1_trend = parseFloat(val1_trend);
    const v2_trend = parseFloat(val2_trend);

    return {
      is: !isNaN(v1_is) && !isNaN(v2_is) ? ((v1_is / 100) * v2_is).toLocaleString() : null,
      pct: !isNaN(v1_pct) && !isNaN(v2_pct) ? ((v1_pct / v2_pct) * 100).toFixed(2) : null,
      inc: !isNaN(v1_trend) && !isNaN(v2_trend) ? (v1_trend + (v1_trend * v2_trend / 100)).toLocaleString() : null,
      dec: !isNaN(v1_trend) && !isNaN(v2_trend) ? (v1_trend - (v1_trend * v2_trend / 100)).toLocaleString() : null,
    };
  }, [val1_is, val2_is, val1_pct, val2_pct, val1_trend, val2_trend]);

  const copy = (val: string, id: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Percent className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Percentage Calculator</h1>
          <p className="text-sm text-muted-foreground">
            Perform common percentage calculations quickly and accurately.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What is X% of Y? */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden group">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Calculator className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Find Value</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Input 
                    type="number" 
                    placeholder="Percentage" 
                    value={val1_is} 
                    onChange={(e) => setVal1_is(e.target.value)}
                    className="h-14 px-4 pr-10 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono" 
                  />
                  <Percent className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                </div>
                <span className="text-muted-foreground font-medium">of</span>
                <Input 
                  type="number" 
                  placeholder="Total Value" 
                  value={val2_is} 
                  onChange={(e) => setVal2_is(e.target.value)}
                  className="h-14 px-4 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono flex-1" 
                />
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-primary/5 border border-primary/10 group-hover:border-primary/20 transition-colors">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70 mb-1">Resulting Value</p>
                  <p className="text-3xl font-mono font-bold tracking-tighter text-primary">
                    {results.is || "0"}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("rounded-xl transition-all", copied === 'is' && "text-green-500")}
                  onClick={() => copy(results.is || "0", 'is')}
                  disabled={!results.is}
                >
                  {copied === 'is' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* X is what % of Y? */}
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden group">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2 text-indigo-500">
              <Percent className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Find Percentage</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  placeholder="Value" 
                  value={val1_pct} 
                  onChange={(e) => setVal1_pct(e.target.value)}
                  className="h-14 px-4 rounded-2xl bg-muted/30 border-transparent focus:border-indigo-500/20 text-lg font-mono flex-1" 
                />
                <span className="text-muted-foreground font-medium">is what % of</span>
                <Input 
                  type="number" 
                  placeholder="Total Value" 
                  value={val2_pct} 
                  onChange={(e) => setVal2_pct(e.target.value)}
                  className="h-14 px-4 rounded-2xl bg-muted/30 border-transparent focus:border-indigo-500/20 text-lg font-mono flex-1" 
                />
              </div>
              <div className="flex items-center justify-between p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500/70 mb-1">Percentage Result</p>
                  <p className="text-3xl font-mono font-bold tracking-tighter text-indigo-500">
                    {results.pct ? `${results.pct}%` : "0%"}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("rounded-xl transition-all", copied === 'pct' && "text-green-500")}
                  onClick={() => copy(results.pct || "0", 'pct')}
                  disabled={!results.pct}
                >
                  {copied === 'pct' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Increase/Decrease */}
        <Card className="md:col-span-2 border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-8">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Percentage Shift</span>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Base Value</Label>
                    <Input 
                      type="number" 
                      placeholder="Enter amount..." 
                      value={val1_trend} 
                      onChange={(e) => setVal1_trend(e.target.value)}
                      className="h-16 px-6 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-2xl font-mono" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Percentage to Shift</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="Enter percentage..." 
                        value={val2_trend} 
                        onChange={(e) => setVal2_trend(e.target.value)}
                        className="h-16 px-6 pr-12 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-2xl font-mono" 
                      />
                      <Percent className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/40" />
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-xl text-muted-foreground hover:text-red-500 transition-all font-bold"
                  onClick={() => { setVal1_trend(""); setVal2_trend(""); }}
                >
                  <Eraser className="w-4 h-4 mr-2" />
                  Clear Shift
                </Button>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 space-y-4 group transition-all hover:border-emerald-500/30">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn("rounded-lg", copied === 'inc' && "text-green-500")}
                      onClick={() => copy(results.inc || "0", 'inc')}
                      disabled={!results.inc}
                    >
                      {copied === 'inc' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 mb-1">Increased To</p>
                    <p className="text-4xl font-mono font-bold tracking-tighter text-emerald-600 truncate">
                      {results.inc || "0"}
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-[2rem] bg-rose-500/5 border border-rose-500/10 space-y-4 group transition-all hover:border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn("rounded-lg", copied === 'dec' && "text-green-500")}
                      onClick={() => copy(results.dec || "0", 'dec')}
                      disabled={!results.dec}
                    >
                      {copied === 'dec' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600/70 mb-1">Decreased To</p>
                    <p className="text-4xl font-mono font-bold tracking-tighter text-rose-600 truncate">
                      {results.dec || "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> 
              Instant Calculation
            </h4>
            <p className="text-sm text-muted-foreground">Results update in real-time as you type. No need to click any buttons.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> 
              Formatted Results
            </h4>
            <p className="text-sm text-muted-foreground">Numbers are automatically formatted for readability with locale-aware grouping.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> 
              One-Click Copy
            </h4>
            <p className="text-sm text-muted-foreground">Easily copy any resulting value to your clipboard with the dedicated copy buttons.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

