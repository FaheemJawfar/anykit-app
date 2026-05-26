"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Copy, 
  Check, 
  Calendar, 
  Timer, 
  ArrowRightLeft, 
  ArrowDown, 
  ArrowUp,
  RefreshCcw,
  Globe,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [isoInput, setIsoInput] = useState("");
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));
  const [copied, setCopied] = useState<string | null>(null);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnixChange = (val: string) => {
    setUnixInput(val);
    const ts = parseInt(val);
    if (!isNaN(ts)) {
      const date = new Date(ts * 1000);
      setIsoInput(date.toISOString());
    } else {
      setIsoInput("");
    }
  };

  const handleIsoChange = (val: string) => {
    setIsoInput(val);
    const date = new Date(val);
    if (!isNaN(date.getTime())) {
      setUnixInput(Math.floor(date.getTime() / 1000).toString());
    } else {
      setUnixInput("");
    }
  };

  const setNow = () => {
    const now = Math.floor(Date.now() / 1000);
    handleUnixChange(now.toString());
  };

  const copy = (val: string, id: string) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const dateObj = !isNaN(parseInt(unixInput)) ? new Date(parseInt(unixInput) * 1000) : null;

  return (
    <ToolLayout toolId="timestamp-converter">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          {/* Real-time Ticker */}
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-primary/5 border-primary/10 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Timer className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Current Unix Timestamp</p>
                  <p className="text-2xl font-mono font-bold tracking-tighter text-primary">{currentTime}</p>
                </div>
              </div>
              <Button 
                onClick={setNow}
                className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 font-bold"
              >
                Use Current Time
              </Button>
            </CardContent>
          </Card>

          {/* Unified Converter */}
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unix Timestamp</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 text-[10px] font-bold gap-1.5", copied === 'unix' && "text-green-500")}
                    onClick={() => copy(unixInput, 'unix')}
                  >
                    {copied === 'unix' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                </div>
                <div className="relative">
                  <Input 
                    placeholder="Enter seconds since Epoch (e.g. 1715956800)"
                    value={unixInput}
                    onChange={(e) => handleUnixChange(e.target.value)}
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-2xl font-mono"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground/40">SECONDS</div>
                </div>
              </div>

              <div className="flex justify-center relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <div className="relative w-10 h-10 rounded-full bg-muted border border-border/40 flex items-center justify-center text-muted-foreground z-10 shadow-sm">
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">ISO 8601 Date</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cn("h-7 text-[10px] font-bold gap-1.5", copied === 'iso' && "text-green-500")}
                    onClick={() => copy(isoInput, 'iso')}
                  >
                    {copied === 'iso' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </Button>
                </div>
                <Input 
                  placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                  value={isoInput}
                  onChange={(e) => handleIsoChange(e.target.value)}
                  className="h-16 px-6 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-xl font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Date Components</span>
            </div>
            <CardContent className="p-6">
              {dateObj ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/20">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/60 mb-1">Local Time</p>
                      <p className="text-sm font-bold truncate">{dateObj.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/20">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/60 mb-1">UTC Time</p>
                      <p className="text-sm font-bold truncate">{dateObj.toUTCString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { label: "Year", value: dateObj.getFullYear() },
                      { label: "Month", value: dateObj.toLocaleString('default', { month: 'long' }) },
                      { label: "Day", value: dateObj.getDate() },
                      { label: "Weekday", value: dateObj.toLocaleString('default', { weekday: 'long' }) },
                      { label: "Time", value: dateObj.toLocaleTimeString() },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                        <span className="text-sm font-bold font-mono">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                  <Calendar className="w-12 h-12" />
                  <p className="text-sm font-medium">Waiting for valid input...</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Timezone Info</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Unix time (also known as Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since 00:00:00 UTC, Thursday, 1 January 1970.
            </p>
            <div className="pt-2 flex items-center justify-between text-[10px] font-bold text-primary/70 border-t border-primary/10 mt-2">
              <span>Your Timezone:</span>
              <span>{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}

