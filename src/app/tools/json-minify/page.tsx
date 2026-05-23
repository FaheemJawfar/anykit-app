"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Braces, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  AlertCircle,
  Minimize2,
  FileCode,
  AlignLeft,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JSONMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  const minify = (val: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      setStats(null);
      return;
    }

    try {
      const json = JSON.parse(val);
      const minified = JSON.stringify(json);
      setOutput(minified);
      
      const originalSize = new Blob([val]).size;
      const minifiedSize = new Blob([minified]).size;
      setStats({
        original: originalSize,
        minified: minifiedSize,
        savings: Math.max(0, originalSize - minifiedSize)
      });
    } catch (e: any) {
      setError(e.message);
      setOutput("");
      setStats(null);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Minimize2 className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON Minifier</h1>
          <p className="text-sm text-muted-foreground">
            Remove whitespace and comments to compress your JSON data to its smallest size.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original JSON</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => minify("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative">
              <Textarea
                placeholder='Paste your JSON here... e.g. { "name": "AnyKit App", "type": "Utility" }'
                value={input}
                onChange={(e) => minify(e.target.value)}
                className="w-full h-full min-h-[300px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>

          {stats && (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
              {[
                { label: "Original", value: formatSize(stats.original) },
                { label: "Minified", value: formatSize(stats.minified) },
                { label: "Savings", value: `${((stats.savings / stats.original) * 100).toFixed(1)}%`, highlight: true }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-3xl bg-card border border-border/40 text-center shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 tracking-widest">{item.label}</p>
                  <p className={cn("text-lg font-black", item.highlight && "text-primary")}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Output Side */}
        <div className="lg:col-span-7 h-full">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Minified Output</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!output}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Result"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              {error ? (
                <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    Invalid JSON Format
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                    {error}
                  </div>
                </div>
              ) : (
                <div className="p-8 font-mono text-sm leading-relaxed break-all whitespace-pre-wrap h-full">
                  {output || <span className="text-muted-foreground italic opacity-50">Compression result will appear here...</span>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
