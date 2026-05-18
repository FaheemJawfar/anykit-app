"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Zap, 
  Play, 
  Trash2,
  Info,
  Activity,
  History,
  AlertCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  Settings2,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import Benchmark from "benchmark";

interface TestCase {
  id: number;
  name: string;
  code: string;
  result?: {
    opsPerSec: number;
    rme: number; // Relative Margin of Error
    isFastest: boolean;
  };
}

export default function PerformanceBenchmark() {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, name: "Array.map", code: "const arr = [1, 2, 3, 4, 5];\narr.map(x => x * 2);" },
    { id: 2, name: "For loop", code: "const arr = [1, 2, 3, 4, 5];\nconst res = [];\nfor(let i=0; i<arr.length; i++) {\n  res.push(arr[i] * 2);\n}" }
  ]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runBenchmark = () => {
    setError(null);
    setRunning(true);
    
    // Clear previous results
    setTestCases(prev => prev.map(tc => ({ ...tc, result: undefined })));

    const suite = new Benchmark.Suite();

    try {
      testCases.forEach(tc => {
        suite.add(tc.name, {
          fn: tc.code,
        });
      });

      suite
        .on('cycle', (event: any) => {
          const bench = event.target;
          setTestCases(prev => prev.map(tc => {
            if (tc.name === bench.name) {
              return {
                ...tc,
                result: {
                  opsPerSec: Math.round(bench.hz),
                  rme: bench.stats.rme,
                  isFastest: false
                }
              };
            }
            return tc;
          }));
        })
        .on('complete', function(this: any) {
          const fastest = this.filter('fastest').map('name');
          setTestCases(prev => prev.map(tc => ({
            ...tc,
            result: tc.result ? {
              ...tc.result,
              isFastest: fastest.includes(tc.name)
            } : undefined
          })));
          setRunning(false);
        })
        .on('error', (event: any) => {
          setError(event.target.error.message);
          setRunning(false);
        })
        .run({ async: true });

    } catch (err: any) {
      setError(err.message || "Benchmark failed to start.");
      setRunning(false);
    }
  };

  const addTestCase = () => {
    const newId = Math.max(...testCases.map(t => t.id)) + 1;
    setTestCases([...testCases, { id: newId, name: `Test Case ${newId}`, code: "" }]);
  };

  const removeTestCase = (id: number) => {
    if (testCases.length <= 1) return;
    setTestCases(testCases.filter(t => t.id !== id));
  };

  const updateTestCase = (id: number, updates: Partial<TestCase>) => {
    setTestCases(testCases.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Activity className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Performance Benchmark</h1>
          <p className="text-sm text-muted-foreground">
            Compare the execution speed of different JavaScript code snippets.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Code Snippets</span>
            </div>
            <Button variant="ghost" size="sm" onClick={addTestCase} className="h-8 rounded-xl font-bold text-primary hover:bg-primary/5">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Case
            </Button>
          </div>

          <div className="space-y-6">
            {testCases.map((tc, index) => (
              <Card key={tc.id} className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden animate-in slide-in-from-left-4" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-[10px] font-black text-muted-foreground/30 w-4">#{tc.id}</span>
                    <input 
                      value={tc.name}
                      onChange={(e) => updateTestCase(tc.id, { name: e.target.value })}
                      className="bg-transparent border-none focus:outline-none font-bold text-sm text-primary w-full"
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTestCase(tc.id)} disabled={testCases.length <= 1} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-0">
                  <Textarea 
                    value={tc.code}
                    onChange={(e) => updateTestCase(tc.id, { code: e.target.value })}
                    placeholder="Enter JS code to benchmark..."
                    className="w-full h-32 p-6 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
                  />
                </CardContent>
                {tc.result && (
                  <div className="px-6 py-3 bg-primary/5 border-t border-border/10 flex justify-between items-center animate-in fade-in">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Ops/Sec</span>
                        <span className="text-sm font-black text-primary">{tc.result.opsPerSec.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col border-l border-border/40 pl-4">
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Margin</span>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground">±{tc.result.rme.toFixed(2)}%</span>
                      </div>
                    </div>
                    {tc.result.isFastest && (
                      <div className="px-3 py-1 rounded-full bg-green-500 text-white text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-green-500/20">
                        <Zap className="w-3 h-3 fill-current" />
                        Fastest
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>

          <Button 
            onClick={runBenchmark}
            disabled={running}
            className="w-full h-16 rounded-3xl text-xl font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all active:scale-[0.98]"
          >
            {running ? <RefreshCw className="w-6 h-6 mr-3 animate-spin" /> : <Play className="w-6 h-6 mr-3 fill-white" />}
            {running ? "Analyzing performance..." : "Execute Benchmark"}
          </Button>
        </div>

        {/* Info Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Benchmark.js Engine</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              AnyKit uses the industry-standard Benchmark.js library to provide statistically significant results. It executes each snippet multiple times to account for background processes and JIT optimization.
            </p>
          </div>

          {error && (
            <div className="p-6 rounded-[2rem] bg-destructive/10 border border-destructive/20 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-destructive/20 flex items-center justify-center text-destructive shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-destructive">Runtime Error</h3>
                <p className="text-xs text-destructive/80 font-mono">{error}</p>
              </div>
            </div>
          )}

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Result Analysis</span>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black opacity-20">1</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong>Ops/Sec:</strong> The number of operations per second (hertz). Higher is better.
                  </p>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black opacity-20">2</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong>Margin of Error:</strong> The relative margin of error as a percentage of the mean. Lower is more stable.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
