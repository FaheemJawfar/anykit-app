"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Copy, 
  Check, 
  Download, 
  FileJson, 
  Eraser, 
  Maximize2, 
  Braces,
  AlertCircle,
  FileCode,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJson = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input]);

  const minifyJson = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [input]);

  const copyToClipboard = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = () => {
    const example = {
      name: "AnyKit App",
      version: "1.0.0",
      features: ["Security", "Fast", "Private"],
      metadata: {
        author: "Faheem",
        status: "Development"
      }
    };
    setInput(JSON.stringify(example, null, 2));
    setError(null);
  };

  const downloadJson = () => {
    if (!input) return;
    const blob = new Blob([input], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anykit-formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <FileJson className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JSON Formatter</h1>
          <p className="text-sm text-muted-foreground">
            Beautify, minify, and validate your JSON data.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-[2rem] overflow-hidden">
          <div className="border-b border-border/40 bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/20" />
              </div>
              <div className="h-4 w-px bg-border/60 mx-1" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AnyKit App Editor</span>
            </div>
            <div className="flex items-center gap-2">
              {error ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="w-3 h-3" />
                  Invalid JSON
                </div>
              ) : input.trim() && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-wider animate-in fade-in zoom-in duration-300">
                  <Check className="w-3 h-3" />
                  Valid JSON
                </div>
              )}
            </div>
          </div>
          <CardContent className="p-0 relative">
            <Textarea
              placeholder='Paste your JSON data here or click "Example Data"...'
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              className="min-h-[500px] font-mono text-sm p-8 bg-transparent border-none focus-visible:ring-0 resize-none placeholder:text-muted-foreground/30 leading-relaxed"
            />
            
            {!input && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                <Braces className="w-24 h-24 text-muted-foreground/10" />
              </div>
            )}
          </CardContent>
          <div className="border-t border-border/40 bg-muted/20 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button 
                onClick={formatJson} 
                disabled={!input.trim()}
                className="h-11 rounded-xl px-6 bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all"
              >
                <Braces className="w-4 h-4 mr-2" />
                Beautify
              </Button>
              <Button 
                onClick={minifyJson} 
                disabled={!input.trim()}
                variant="outline"
                className="h-11 rounded-xl px-6 border-border/50 hover:bg-background font-bold transition-all"
              >
                <Zap className="w-4 h-4 mr-2" />
                Minify
              </Button>
              <Button 
                onClick={loadExample} 
                variant="ghost"
                className="h-11 rounded-xl px-4 text-muted-foreground hover:text-foreground font-bold"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Example
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={copyToClipboard} 
                disabled={!input.trim()}
                variant="outline"
                className={cn(
                  "h-11 rounded-xl px-4 border-border/50 font-bold transition-all",
                  copied && "text-green-500 border-green-500/20 bg-green-500/5"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button 
                onClick={downloadJson} 
                disabled={!input.trim()}
                variant="outline"
                className="h-11 rounded-xl px-4 border-border/50 font-bold"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <div className="w-px h-6 bg-border/60 mx-1" />
              <Button 
                onClick={() => setInput("")} 
                variant="ghost" 
                size="icon"
                className="h-11 w-11 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/5 transition-all"
              >
                <Eraser className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 flex gap-3 animate-in slide-in-from-top-2 duration-500">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-red-500">Parsing Error</p>
              <p className="text-xs font-mono text-red-500/80 leading-relaxed">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border/40 space-y-3 hover:border-primary/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Maximize2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold">Smart Formatting</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Automatic indentation and spacing to make complex objects readable.</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border/40 space-y-3 hover:border-primary/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold">Live Validation</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">Instant syntax checking with descriptive error highlighting.</p>
        </div>
        <div className="p-6 rounded-[2rem] bg-muted/30 border border-border/40 space-y-3 hover:border-primary/20 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Eraser className="w-5 h-5" />
          </div>
          <h3 className="font-bold">Privacy Guaranteed</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">All processing is done 100% locally in your browser. Data never leaves your machine.</p>
        </div>
      </div>
    </div>
  );
}

