"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Link, 
  Copy, 
  Check, 
  Trash2,
  Settings2,
  Zap,
  Info,
  Hash,
  Globe,
  Database,
  Search,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";

interface URLParts {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  queryParams: Record<string, string>;
}

export default function URLParser() {
  const [input, setInput] = useState("https://example.com:8080/path/to/resource?id=123&name=AnyKit App#section-1");
  const [parts, setParts] = useState<URLParts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const parseURL = (url: string) => {
    setInput(url);
    setError(null);
    if (!url.trim()) {
      setParts(null);
      return;
    }

    try {
      const parsed = new URL(url);
      const queryParams: Record<string, string> = {};
      parsed.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });

      setParts({
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        origin: parsed.origin,
        queryParams
      });
    } catch (e) {
      setError("Invalid URL format. Please include protocol (http:// or https://)");
      setParts(null);
    }
  };

  useEffect(() => {
    parseURL(input);
  }, []);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const PartCard = ({ label, value, icon: Icon, id }: { label: string, value: string, icon: any, id: string }) => {
    if (!value) return null;
    return (
      <div className="group relative bg-muted/30 border border-border/40 p-4 rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{label}</p>
            <p className="text-sm font-mono font-bold break-all">{value}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => copy(value, id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-8 w-8"
        >
          {copied === id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Link className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">URL Parser</h1>
          <p className="text-sm text-muted-foreground">
            Deconstruct complex URLs into readable components and query parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Input URL</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => parseURL("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste URL here..."
                value={input}
                onChange={(e) => parseURL(e.target.value)}
                className="w-full h-[150px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed break-all"
              />
            </CardContent>
          </Card>

          {error && (
            <div className="p-6 rounded-3xl bg-destructive/5 border border-destructive/10 text-destructive text-xs font-bold flex items-center gap-3">
              <Info className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Components</h3>
            </div>
            <div className="space-y-2 text-[11px] text-muted-foreground">
              <p><strong>Protocol:</strong> e.g. http:, https:</p>
              <p><strong>Hostname:</strong> Domain name or IP</p>
              <p><strong>Query Params:</strong> Key-value pairs after ?</p>
              <p><strong>Hash:</strong> Fragment identifier after #</p>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {parts ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PartCard label="Protocol" value={parts.protocol} icon={Shield2} id="protocol" />
                <PartCard label="Hostname" value={parts.hostname} icon={Globe} id="hostname" />
                <PartCard label="Port" value={parts.port} icon={Database} id="port" />
                <PartCard label="Origin" value={parts.origin} icon={Key} id="origin" />
              </div>
              
              <PartCard label="Pathname" value={parts.pathname} icon={Settings2} id="pathname" />
              <PartCard label="Hash" value={parts.hash} icon={Hash} id="hash" />

              {Object.keys(parts.queryParams).length > 0 && (
                <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Query Parameters</span>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      {Object.entries(parts.queryParams).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/20 group">
                          <div className="flex gap-4">
                            <span className="text-xs font-bold text-primary font-mono">{key}</span>
                            <span className="text-xs text-muted-foreground font-mono">=</span>
                            <span className="text-xs font-mono font-bold break-all">{value}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => copy(value, `param-${key}`)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                          >
                            {copied === `param-${key}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Link className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for URL</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste a full URL above to see its components.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Minimal Shield2 replacement if not found in Lucide
const Shield2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);
