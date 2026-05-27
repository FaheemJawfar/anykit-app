"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Keyboard, 
  Copy, 
  Check, 
  Zap,
  Info,
  Type,
  Hash,
  Binary,
  Code,
  MousePointer2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ToolLayout } from "@/components/tool-layout";

export default function KeycodeInfo() {
  const [event, setEvent] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setEvent({
        key: e.key,
        code: e.code,
        which: e.keyCode, // Deprecated but often needed
        location: e.location,
        ctrl: e.ctrlKey,
        meta: e.metaKey,
        shift: e.shiftKey,
        alt: e.altKey,
        repeat: e.repeat
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const InfoItem = ({ label, value, icon: Icon, id }: { label: string, value: any, icon: any, id: string }) => (
    <div className="group relative bg-muted/30 border border-border/40 p-6 rounded-2xl hover:bg-muted/50 transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{label}</p>
          <p className="text-xl font-mono font-bold break-all">{String(value)}</p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => copy(String(value), id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg h-10 w-10"
      >
        {copied === id ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
      </Button>
    </div>
  );

  return (
    <ToolLayout toolId="keycode-info">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Detection Area */}
        <div className="lg:col-span-12">
          <div className={cn(
            "h-48 rounded-[2.5rem] border-4 border-dashed flex flex-col items-center justify-center text-center transition-all duration-500",
            event ? "bg-primary/5 border-primary/20 scale-[1.01]" : "bg-muted/20 border-border/40"
          )}>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce-slow">
              <Keyboard className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-foreground/80 uppercase">
              {event ? `Pressed: ${event.key}` : "Press any key to start"}
            </h3>
          </div>
        </div>

        {/* Info Grid */}
        <div className="lg:col-span-12">
          {event ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
              <InfoItem label="event.key" value={event.key} icon={Type} id="key" />
              <InfoItem label="event.code" value={event.code} icon={Code} id="code" />
              <InfoItem label="event.which" value={event.which} icon={Hash} id="which" />
              
              <Card className="col-span-1 sm:col-span-2 lg:col-span-3 border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="px-8 py-4 border-b border-border/40 bg-primary/5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">Modifiers & Flags</span>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary">Real-time Data</span>
                  </div>
                </div>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {[
                      { label: "CTRL", active: event.ctrl },
                      { label: "META", active: event.meta },
                      { label: "SHIFT", active: event.shift },
                      { label: "ALT", active: event.alt },
                      { label: "REPEAT", active: event.repeat }
                    ].map((flag) => (
                      <div key={flag.label} className="flex flex-col items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all",
                          flag.active ? "bg-primary text-white border-primary shadow-lg scale-110" : "bg-muted/30 text-muted-foreground border-border/40 opacity-40"
                        )}>
                          {flag.label}
                        </div>
                        <span className={cn("text-[10px] font-bold", flag.active ? "text-primary" : "text-muted-foreground/40")}>
                          {flag.active ? "TRUE" : "FALSE"}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-20 rounded-[2.5rem] bg-muted/10 border border-border/20 flex flex-col items-center justify-center text-center gap-4 border-dashed">
              <MousePointer2 className="w-12 h-12 text-muted-foreground/20" />
              <p className="text-muted-foreground italic font-medium">Waiting for keyboard interaction...</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 flex items-start gap-6">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Info className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-primary">Developer Reference</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            The <strong>key</strong> property represents the character value, while <strong>code</strong> represents the physical key position. <strong>which/keyCode</strong> is the legacy numeric value often used in older browser implementations.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
