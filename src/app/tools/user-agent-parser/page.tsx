"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Monitor, 
  Smartphone, 
  Globe, 
  Cpu, 
  Search,
  Check,
  Copy,
  Trash2,
  Zap,
  Info,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UAParser } from "ua-parser-js";

export default function UserAgentParser() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const parseUA = (ua: string) => {
    setInput(ua);
    if (!ua.trim()) {
      setResult(null);
      return;
    }
    const parser = new UAParser(ua);
    setResult(parser.getResult());
  };

  useEffect(() => {
    // Automatically parse the current browser's UA on mount
    const currentUA = navigator.userAgent;
    parseUA(currentUA);
  }, []);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const ResultCard = ({ title, icon: Icon, data, label }: { title: string, icon: any, data: any, label?: string }) => {
    if (!data || (typeof data === 'object' && Object.values(data).every(v => !v))) return null;
    
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
        </div>
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(data).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key} className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider">{key}</p>
                    <p className="text-sm font-bold truncate">{String(value)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Search className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">User Agent Parser</h1>
          <p className="text-sm text-muted-foreground">
            Decode and analyze browser user agent strings to identify device, OS, and browser details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Section */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Server className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">UA String</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => parseUA("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste User Agent string here..."
                value={input}
                onChange={(e) => parseUA(e.target.value)}
                className="w-full h-[200px] p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed break-all"
              />
              <div className="p-4 bg-primary/5 border-t border-border/40 flex justify-between items-center">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full">
                  Live Parsing
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => parseUA(navigator.userAgent)}
                  className="text-[10px] font-bold uppercase tracking-widest h-8"
                >
                  <Zap className="w-3 h-3 mr-2 text-primary" />
                  Use My Browser
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">What is a User Agent?</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              A User Agent is a string sent by your browser to websites. It contains information about your browser version, operating system, and hardware architecture.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-8">
              <ResultCard title="Browser" icon={Globe} data={result.browser} />
              <ResultCard title="Operating System" icon={Monitor} data={result.os} />
              <ResultCard title="Device" icon={Smartphone} data={result.device} />
              <ResultCard title="Engine" icon={Cpu} data={result.engine} />
              <ResultCard title="CPU" icon={Cpu} data={result.cpu} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6 bg-muted/20 rounded-[2.5rem] border border-dashed border-border/40 min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Waiting for Input</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Paste a User Agent string or click "Use My Browser" to see the breakdown.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
