"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  History,
  RefreshCw,
  Hash,
  AlertCircle,
  FileCode,
  FunctionSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { evaluate } from "mathjs";

export default function MathEvaluator() {
  const [expression, setExpression] = useState("2 * sqrt(144) + sin(pi/2)");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ exp: string; res: string }[]>([]);

  const handleEvaluate = (val: string) => {
    setExpression(val);
    setError(null);
    if (!val.trim()) {
      setResult("");
      return;
    }

    try {
      const res = evaluate(val);
      const formattedRes = typeof res === 'number' ? 
        (res.toString().includes('.') ? res.toFixed(8).replace(/\.?0+$/, '') : res.toString()) : 
        String(res);
      
      setResult(formattedRes);
    } catch (e: any) {
      setError(e.message || "Invalid expression");
      setResult("");
    }
  };

  const addToHistory = () => {
    if (result && !error) {
      setHistory(prev => [{ exp: expression, res: result }, ...prev].slice(0, 10));
    }
  };

  useEffect(() => {
    handleEvaluate(expression);
  }, []);

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setExpression("");
    setResult("");
    setError(null);
  };

  return (
    <ToolLayout toolId="math-evaluator">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Mathematical Expression</span>
              </div>
              <Button variant="ghost" size="icon" onClick={clear} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative">
              <Textarea
                placeholder="e.g. (10 + 5) * log(100) / sin(90 deg)"
                value={expression}
                onChange={(e) => handleEvaluate(e.target.value)}
                onBlur={addToHistory}
                className="w-full h-full min-h-[300px] p-12 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-3xl leading-relaxed text-foreground/90 selection:bg-primary/20"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
              <div className="flex items-center gap-2">
                <FunctionSquare className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Supported Functions</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-[11px] text-muted-foreground font-mono">
                <div className="space-y-1">
                  <p><span className="text-primary font-bold">sqrt(x)</span> - Square root</p>
                  <p><span className="text-primary font-bold">log(x)</span> - Logarithm</p>
                  <p><span className="text-primary font-bold">sin(x)</span> - Sine</p>
                </div>
                <div className="space-y-1">
                  <p><span className="text-primary font-bold">pow(x,y)</span> - Power</p>
                  <p><span className="text-primary font-bold">abs(x)</span> - Absolute</p>
                  <p><span className="text-primary font-bold">pi, e</span> - Constants</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 space-y-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Scientific Usage</h3>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                You can use units like <strong>90 deg</strong> or <strong>2 rad</strong> for trigonometry. For powers, use either <code>^</code> or the <code>pow()</code> function.
              </p>
            </div>
          </div>
        </div>

        {/* Output Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Result</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!result}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            
            <CardContent className="p-12 flex flex-col items-center justify-center bg-primary/[0.01] min-h-[200px]">
              {error ? (
                <div className="text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive mx-auto">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-destructive/80 max-w-[200px] leading-relaxed">
                    {error}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <span className="text-7xl md:text-8xl font-black tracking-tighter text-primary break-all leading-none drop-shadow-sm">
                    {result || "0"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3 shrink-0">
                <History className="w-4 h-4 text-muted-foreground/40" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent History</span>
              </div>
              <CardContent className="p-0">
                <div className="divide-y divide-border/10">
                  {history.map((item, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleEvaluate(item.exp)}
                      className="px-8 py-4 space-y-1 hover:bg-muted/10 cursor-pointer transition-colors group"
                    >
                      <p className="text-[10px] font-mono text-muted-foreground/60 truncate group-hover:text-primary transition-colors">{item.exp}</p>
                      <p className="text-sm font-bold text-foreground/80">{item.res}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
