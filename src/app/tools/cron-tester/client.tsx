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
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CronExpressionParser } from "cron-parser";
import cronstrue from "cronstrue";

export default function CronTester() {
  const [expression, setExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");
  const [nextDates, setNextDates] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const testCron = (exp: string) => {
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

      // 2. Get next execution dates
      const cronExpr = CronExpressionParser.parse(exp);
      const dates = [];
      for (let i = 0; i < 10; i++) {
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
    testCron(expression);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="cron-tester">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Cron Expression</Label>
                <div className="relative">
                  <Input 
                    value={expression}
                    onChange={(e) => testCron(e.target.value)}
                    placeholder="e.g. 0 0 * * *"
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-2xl font-black focus:ring-primary/20 tracking-widest text-center"
                  />
                  {expression && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => testCron("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              {description && (
                <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-start gap-4 animate-in fade-in zoom-in-95">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Human Readable</h3>
                    <p className="text-lg font-bold text-foreground leading-snug">
                      "{description}"
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10 flex items-start gap-4 animate-in fade-in zoom-in-95">
                  <div className="w-10 h-10 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-destructive">Syntax Error</h3>
                    <p className="text-xs font-mono text-destructive/80 leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Standard Format</h3>
            </div>
            <div className="grid grid-cols-5 gap-2 text-[8px] font-black text-center text-muted-foreground uppercase tracking-widest">
              <div>Min</div>
              <div>Hour</div>
              <div>Day</div>
              <div>Mon</div>
              <div>Week</div>
            </div>
            <div className="grid grid-cols-5 gap-2 text-xs font-mono text-center text-primary font-bold">
              <div>0-59</div>
              <div>0-23</div>
              <div>1-31</div>
              <div>1-12</div>
              <div>0-6</div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Execution Schedule</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <span className="text-[10px] font-bold text-primary">Next 10 Times</span>
              </div>
            </div>
            
            <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
              {nextDates.length > 0 ? (
                <div className="divide-y divide-border/10">
                  {nextDates.map((date, i) => (
                    <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-primary/[0.02] transition-colors animate-in slide-in-from-top-2" style={{ animationDelay: `${i * 30}ms` }}>
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-black text-muted-foreground/20 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground/80">
                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-lg font-black tracking-tight text-primary">
                            {new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-muted/30 text-[10px] font-mono text-muted-foreground">
                        {new Date(date).getTime()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 opacity-30">
                  <Clock className="w-20 h-20" />
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Schedule Preview</h3>
                    <p className="text-sm max-w-xs mx-auto">
                      Enter a valid cron expression to see its future execution dates.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
