"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Minimize2, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Activity,
  History,
  TrendingDown,
  RefreshCw,
  Search,
  FileCode,
  Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";
import pako from "pako";

export default function TextCompressor() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    if (!input.trim()) return null;

    const originalSize = new Blob([input]).size;
    
    // Gzip
    const gzipData = pako.gzip(input);
    const gzipSize = gzipData.length;
    
    // Deflate (Zlib)
    const deflateData = pako.deflate(input);
    const deflateSize = deflateData.length;

    return {
      original: originalSize,
      gzip: {
        size: gzipSize,
        savings: originalSize > gzipSize ? ((1 - gzipSize / originalSize) * 100).toFixed(1) : "0"
      },
      deflate: {
        size: deflateSize,
        savings: originalSize > deflateSize ? ((1 - deflateSize / originalSize) * 100).toFixed(1) : "0"
      }
    };
  }, [input]);

  return (
    <ToolLayout toolId="text-compressor">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-12 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileCode className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Payload to Compress</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste long text, JSON, or code here to test compression..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-12 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-lg leading-relaxed text-foreground/80"
              />
            </CardContent>
          </Card>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-12">
          {stats ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Original Size */}
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original Size</p>
                  <div className="text-6xl font-black tracking-tighter text-foreground">
                    {stats.original < 1024 ? `${stats.original} B` : `${(stats.original / 1024).toFixed(2)} KB`}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-muted/50 text-[10px] font-bold uppercase tracking-widest">
                    Uncompressed
                  </div>
                </Card>

                {/* Gzip Result */}
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-primary/20 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Gzip (Level 6)</p>
                  <div className="text-6xl font-black tracking-tighter text-primary group-hover:scale-105 transition-transform duration-500">
                    {stats.gzip.size < 1024 ? `${stats.gzip.size} B` : `${(stats.gzip.size / 1024).toFixed(2)} KB`}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingDown className="w-3 h-3" />
                    {stats.gzip.savings}% Smaller
                  </div>
                </Card>

                {/* Zlib Result */}
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden p-8 flex flex-col items-center justify-center text-center gap-4 group hover:border-blue-500/20 transition-all">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Zlib / Deflate</p>
                  <div className="text-6xl font-black tracking-tighter text-blue-600 group-hover:scale-105 transition-transform duration-500">
                    {stats.deflate.size < 1024 ? `${stats.deflate.size} B` : `${(stats.deflate.size / 1024).toFixed(2)} KB`}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <TrendingDown className="w-3 h-3" />
                    {stats.deflate.savings}% Smaller
                  </div>
                </Card>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-primary">Web Optimization Note</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">
                    Compression is a standard part of the modern web. <strong>Gzip</strong> is universally supported by browsers and servers, typically reducing text-based assets like JSON or JS by 60-80%. <strong>Brotli</strong> (coming soon in this tool) generally provides even better results for static assets.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-20 rounded-[2.5rem] bg-muted/10 border border-border/20 flex flex-col items-center justify-center text-center gap-4 border-dashed opacity-50">
              <Gauge className="w-12 h-12 text-primary/30" />
              <p className="text-muted-foreground italic font-medium">Insights will appear here as you type...</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
