"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Split, 
  Copy, 
  Check, 
  Trash2,
  FileCode,
  Zap,
  AlertCircle,
  ArrowRight,
  Braces,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsonDiff from "json-diff";

export default function JSONDiff() {
  const [leftJson, setLeftJson] = useState('{\n  "name": "AnyKit",\n  "version": "1.0",\n  "active": true,\n  "tags": ["utility", "web"]\n}');
  const [rightJson, setRightJson] = useState('{\n  "name": "AnyKit",\n  "version": "1.1",\n  "active": false,\n  "tags": ["utility", "web", "new"]\n}');
  const [diffResult, setDiffResult] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const calculateDiff = () => {
    setError(null);
    try {
      const left = JSON.parse(leftJson);
      const right = JSON.parse(rightJson);
      
      const diff = jsonDiff.diffString(left, right, { color: false });
      setDiffResult(diff || "JSON objects are identical.");
    } catch (e: any) {
      setError("Invalid JSON input. Please ensure both inputs are valid JSON.");
      setDiffResult("");
    }
  };

  const copyToClipboard = () => {
    if (!diffResult) return;
    navigator.clipboard.writeText(diffResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setLeftJson("");
    setRightJson("");
    setDiffResult("");
    setError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Braces className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON Diff</h1>
          <p className="text-sm text-muted-foreground">
            Compare two JSON objects and find structural and value differences.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Input Side */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original JSON</span>
                <FileCode className="w-4 h-4 text-muted-foreground/40" />
              </div>
              <CardContent className="p-0 flex-1 relative">
                <Textarea
                  placeholder="Paste original JSON..."
                  value={leftJson}
                  onChange={(e) => setLeftJson(e.target.value)}
                  className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
                />
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Modified JSON</span>
                <FileCode className="w-4 h-4 text-primary/40" />
              </div>
              <CardContent className="p-0 flex-1 relative">
                <Textarea
                  placeholder="Paste modified JSON..."
                  value={rightJson}
                  onChange={(e) => setRightJson(e.target.value)}
                  className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-4 shrink-0">
            <Button 
              onClick={calculateDiff}
              className="flex-1 h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <Split className="w-5 h-5 mr-2" />
              Compare JSON
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clear}
              className="w-14 h-14 rounded-2xl border-border/40 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Result Side */}
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
          <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Structural Diff</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              disabled={!diffResult}
              className={cn(
                "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                copied && "text-green-500 hover:text-green-500"
              )}
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied" : "Copy Diff"}
            </Button>
          </div>
          <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
            {error ? (
              <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                  <AlertCircle className="w-3 h-3" />
                  JSON Parse Error
                </div>
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                  {error}
                </div>
              </div>
            ) : (
              <pre className="w-full h-full min-h-[400px] p-8 font-mono text-[10px] leading-relaxed overflow-auto whitespace-pre">
                {diffResult ? (
                  diffResult.split('\n').map((line, i) => {
                    const isAdded = line.startsWith('+') || line.includes(': "++');
                    const isRemoved = line.startsWith('-') || line.includes(': "--');
                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "px-2 rounded-sm",
                          isAdded && "bg-green-500/10 text-green-600 font-bold",
                          isRemoved && "bg-destructive/10 text-destructive font-bold",
                          !isAdded && !isRemoved && "text-muted-foreground opacity-70"
                        )}
                      >
                        {line}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground italic opacity-50">Differences will be highlighted here...</span>
                )}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">How to read</h3>
          </div>
          <div className="space-y-2 text-[11px] text-muted-foreground leading-relaxed">
            <p><span className="text-green-600 font-bold mr-2">+</span> Lines or keys added in the modified version.</p>
            <p><span className="text-destructive font-bold mr-2">-</span> Lines or keys removed from the original version.</p>
            <p><span className="font-bold mr-2">~</span> Values that have been changed.</p>
          </div>
        </div>
        <div className="p-6 rounded-3xl bg-muted/30 border border-border/40 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner">
            <ArrowRight className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm">Semantic Comparison</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Unlike standard text diffs, JSON Diff understands the structure of objects. It ignores key ordering and focuses on the actual data hierarchy and values.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
