"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Globe, 
  Search, 
  Copy, 
  Check, 
  Zap,
  Info,
  ExternalLink,
  Eye,
  Layout,
  MessageSquare,
  Share2,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OpenGraphDebugger() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const fetchMetadata = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      // Since this is client-side, we use a public CORS proxy for metadata extraction
      // or a simple simulated fetch for demo if proxy fails
      const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.status === "success") {
        setMetadata(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch metadata.");
      }
    } catch (err: any) {
      setError("Unable to fetch metadata. This could be due to CORS restrictions or an invalid URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="og-debugger">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Website URL</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-sm focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    onClick={fetchMetadata}
                    disabled={loading || !url}
                    className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                  >
                    {loading ? <Zap className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-primary">How it works</h3>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                  This tool fetches the <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> tags from your site's header to simulate social card rendering.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Side */}
        <div className="lg:col-span-7 space-y-8">
          {metadata ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Facebook/LinkedIn Preview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Standard Feed Preview</span>
                </div>
                <Card className="border-border/40 bg-card/40 rounded-xl overflow-hidden max-w-[550px] shadow-2xl">
                  <div className="aspect-[1.91/1] bg-muted/20 relative overflow-hidden border-b border-border/10">
                    {metadata.image?.url ? (
                      <img src={metadata.image.url} alt="OG Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-[10px] font-bold uppercase">No Image Found</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 bg-white dark:bg-card/20 space-y-1.5">
                    <p className="text-[10px] uppercase text-muted-foreground tracking-widest font-black truncate">
                      {metadata.publisher || new URL(url).hostname.toUpperCase()}
                    </p>
                    <h3 className="text-lg font-black text-foreground line-clamp-2 leading-tight">
                      {metadata.title || "Page Title"}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {metadata.description || "The description will appear here..."}
                    </p>
                  </div>
                </Card>
              </div>

              {/* Twitter/X Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Twitter / X Preview</span>
                </div>
                <Card className="border-border/40 bg-card/40 rounded-3xl overflow-hidden max-w-[550px] shadow-xl border-2">
                  <div className="relative">
                    <div className="aspect-[1.91/1] bg-muted/30">
                      {metadata.image?.url && <img src={metadata.image.url} alt="Twitter" className="w-full h-full object-cover" />}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                      <p className="text-white text-sm font-bold line-clamp-1">{metadata.title}</p>
                      <p className="text-white/60 text-[10px] font-mono truncate">{new URL(url).hostname}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : !loading && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[500px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Eye className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">No URL Parsed</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Enter a website URL on the left to see how it will be presented when shared on social networks.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
