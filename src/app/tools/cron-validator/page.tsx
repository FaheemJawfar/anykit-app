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
  Calendar,
  History,
  AlertCircle,
  Play,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

export default function CronValidator() {
  const [expression, setExpression] = useState("0 0 1 * *");
  const [description, setDescription] = useState("");
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validateCron = (exp: string) => {
    setExpression(exp);
    setError(null);
    if (!exp.trim()) {
      setDescription("");
      setNextDates([]);
      return;
    }

    try {
      // 1. Get human description
      setDescription(cronstrue.toString(exp));

      // 2. Parse and get next 5 dates
      const cronExpr = CronExpressionParser.parse(exp);
      const dates = [];
      for (let i = 0; i < 5; i++) {
        dates.push(cronExpr.next().toISOString());
      }
      setNextDates(dates);
    } catch (e: any) {
      setError(e.message || "Invalid cron expression");
      setDescription("");
      setNextDates([]);
    }
  };

  useEffect(() => {
    validateCron(expression);
  }, []);

  return (
    <ToolLayout toolId="cron-validator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Validator Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Test Expression</Label>
                <div className="relative">
                  <Input 
                    value={expression}
                    onChange={(e) => validateCron(e.target.value)}
                    placeholder="e.g. */5 * * * *"
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-2xl font-black focus:ring-primary/20 tracking-widest text-center"
                  />
                </div>
              </div>

              {description ? (
                <div className="p-6 rounded-[2rem] bg-green-500/5 border border-green-500/20 flex items-start gap-4 animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-green-600 mb-1">Valid Expression</h3>
                    <p className="text-lg font-bold text-foreground leading-snug">
                      "{description}"
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className="p-6 rounded-[2rem] bg-destructive/5 border border-destructive/20 flex items-start gap-4 animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-destructive mb-1">Invalid Expression</h3>
                    <p className="text-xs font-mono text-destructive/80 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Quick Cheat Sheet</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[10px] font-bold text-muted-foreground uppercase">
              <div className="p-2 rounded-xl bg-muted/30"><code>*</code> Any value</div>
              <div className="p-2 rounded-xl bg-muted/30"><code>,</code> Value list</div>
              <div className="p-2 rounded-xl bg-muted/30"><code>-</code> Range</div>
              <div className="p-2 rounded-xl bg-muted/30"><code>/</code> Step values</div>
            </div>
          </div>
        </div>

        {/* Schedule Side */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Next Executions</span>
              </div>
            </div>
            
            <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
              {nextDates.length > 0 ? (
                <div className="divide-y divide-border/10">
                  {nextDates.map((date, i) => (
                    <div key={i} className="px-8 py-5 flex items-center gap-6 hover:bg-primary/[0.02] transition-colors animate-in slide-in-from-top-2" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-xs font-black text-muted-foreground/30 shadow-inner">
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xl font-black tracking-tight text-primary">
                          {new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
                  <Clock className="w-20 h-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No dates predicted</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
