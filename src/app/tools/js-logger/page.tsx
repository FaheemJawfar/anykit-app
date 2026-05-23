"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Terminal, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  Bug,
  Search,
  ChevronRight,
  Code,
  FileCode,
  Braces
} from "lucide-react";
import { cn } from "@/lib/utils";

const LogItem = ({ data, level = "info" }: { data: any, level?: string }) => {
  const isObject = typeof data === "object" && data !== null;

  return (
    <div className={cn(
      "p-4 rounded-xl border flex gap-4 animate-in slide-in-from-left-2",
      level === "error" ? "bg-destructive/5 border-destructive/20" : 
      level === "warn" ? "bg-orange-500/5 border-orange-500/20" : 
      "bg-muted/30 border-border/20"
    )}>
      <div className="pt-0.5">
        <div className={cn(
          "w-5 h-5 rounded-lg flex items-center justify-center shadow-sm",
          level === "error" ? "bg-destructive text-white" : 
          level === "warn" ? "bg-orange-500 text-white" : 
          "bg-primary text-white"
        )}>
          <span className="text-[10px] font-black uppercase">{level[0]}</span>
        </div>
      </div>
      <div className="flex-1 space-y-2 min-w-0">
        <div className="flex justify-between items-center">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-30">{new Date().toLocaleTimeString()}</span>
        </div>
        <div className="font-mono text-xs leading-relaxed break-all">
          {isObject ? (
            <pre className="whitespace-pre-wrap text-foreground/80">{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <span className="text-foreground/90 font-bold">{String(data)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function JSConsoleLogger() {
  const [input, setInput] = useState('{\n  "status": 200,\n  "message": "User fetched successfully",\n  "data": {\n    "id": "USR_99",\n    "name": "AnyKit App Explorer"\n  }\n}');
  const [logs, setLogs] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const addLog = (level: string) => {
    try {
      let parsed;
      try {
        parsed = JSON.parse(input);
      } catch {
        parsed = input;
      }
      setLogs([{ data: parsed, level, id: Date.now() }, ...logs].slice(0, 50));
    } catch (e) {
      // Fallback to string
      setLogs([{ data: input, level, id: Date.now() }, ...logs].slice(0, 50));
    }
  };

  const clearLogs = () => setLogs([]);

  const copyLogs = () => {
    navigator.clipboard.writeText(JSON.stringify(logs, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Bug className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">JS Console Prettifier</h1>
          <p className="text-sm text-muted-foreground">
            A visual debugging workspace to format and organize complex JS objects and logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Log Payload</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setInput("")} className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <CardContent className="p-0">
              <Textarea
                placeholder="Paste object or message to log..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-64 p-8 bg-transparent border-none focus-visible:ring-0 resize-none font-mono text-sm leading-relaxed"
              />
              <div className="p-6 bg-muted/20 border-t border-border/40 grid grid-cols-3 gap-3">
                <Button onClick={() => addLog("info")} className="h-10 rounded-xl font-bold uppercase text-[9px] bg-primary hover:bg-primary/90">Info Log</Button>
                <Button onClick={() => addLog("warn")} className="h-10 rounded-xl font-bold uppercase text-[9px] bg-orange-500 hover:bg-orange-600">Warn Log</Button>
                <Button onClick={() => addLog("error")} className="h-10 rounded-xl font-bold uppercase text-[9px] bg-destructive hover:bg-destructive/90">Error Log</Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              This tool automatically attempts to parse pasted content as JSON. If it's just a string, it will log it as raw text. Perfect for organizing messy console outputs during debugging.
            </p>
          </div>
        </div>

        {/* Console Viewport */}
        <div className="lg:col-span-7 flex flex-col h-[calc(100vh-250px)] min-h-[500px]">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full relative">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">AnyKit App Debug Console</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={copyLogs} disabled={logs.length === 0} className="h-8 rounded-xl font-bold text-[10px] uppercase">
                  {copied ? <Check className="w-3.5 h-3.5 mr-2" /> : <Copy className="w-3.5 h-3.5 mr-2" />}
                  Export
                </Button>
                <Button variant="ghost" size="sm" onClick={clearLogs} disabled={logs.length === 0} className="h-8 rounded-xl font-bold text-[10px] uppercase text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            
            <CardContent className="p-6 flex-1 overflow-auto bg-black/[0.02] dark:bg-white/[0.01]">
              <div className="space-y-4">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <LogItem key={log.id} data={log.data} level={log.level} />
                  ))
                ) : (
                  <div className="h-full py-24 flex flex-col items-center justify-center gap-4 opacity-20">
                    <Terminal className="w-16 h-16" />
                    <p className="text-sm font-bold uppercase tracking-widest">Console is empty</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
