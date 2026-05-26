"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileCode, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Download,
  AlertCircle,
  FileImage,
  RefreshCw,
  Code,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
export default function SVGOptimizer() {
  const [input, setInput] = useState('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">\n  <!-- This is a comment that will be removed -->\n  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />\n</svg>');
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; optimized: number; savings: number } | null>(null);

  const handleOptimize = (val: string) => {
    setInput(val);
    setError(null);
    if (!val.trim()) {
      setOutput("");
      setStats(null);
      return;
    }

    try {
      // Basic manual SVG optimization
      let optimized = val
        .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
        .replace(/[\n\r]/g, '') // Remove newlines
        .trim();

      // Basic XML cleanup
      optimized = optimized.replace(/<\?xml[\s\S]*?\?>/g, ''); // Remove XML declaration
      optimized = optimized.replace(/<!DOCTYPE[\s\S]*?>/g, ''); // Remove DOCTYPE

      setOutput(optimized);
      const originalSize = new Blob([val]).size;
      const optimizedSize = new Blob([optimized]).size;
      setStats({
        original: originalSize,
        optimized: optimizedSize,
        savings: Math.max(0, originalSize - optimizedSize)
      });
    } catch (e: any) {
      setError(e.message || "Invalid SVG format.");
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

  const downloadSVG = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "optimized.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <ToolLayout toolId="svg-optimizer">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[450px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Source SVG</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleOptimize("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative">
              <Textarea
                placeholder="Paste your SVG code here..."
                value={input}
                onChange={(e) => handleOptimize(e.target.value)}
                className="w-full h-full min-h-[350px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-xs leading-relaxed"
              />
            </CardContent>
          </Card>

          {stats && (
            <div className="grid grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4">
              {[
                { label: "Original", value: formatSize(stats.original) },
                { label: "Optimized", value: formatSize(stats.optimized) },
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

        {/* Results Side */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[450px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Optimized Output</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadSVG}
                  disabled={!output}
                  className="rounded-xl font-bold px-3 hover:bg-primary/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save
                </Button>
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
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              {error ? (
                <div className="p-8 h-full bg-destructive/5 text-destructive font-mono text-sm space-y-4">
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle className="w-3 h-3" />
                    Optimization Error
                  </div>
                  <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 whitespace-pre-wrap leading-relaxed">
                    {error}
                  </div>
                </div>
              ) : (
                <div className="p-8 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap h-full max-h-[400px] overflow-auto">
                  {output || <span className="text-muted-foreground italic opacity-50">Optimized result will appear here...</span>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <FileImage className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Preview</span>
            </div>
            <CardContent className="p-8 flex items-center justify-center bg-muted/20 min-h-[200px]">
              {output ? (
                <div 
                  className="max-w-full max-h-[300px] shadow-lg rounded-xl overflow-hidden bg-white p-4 animate-in zoom-in-95"
                  dangerouslySetInnerHTML={{ __html: output }}
                />
              ) : (
                <div className="opacity-30 flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No Preview Available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
