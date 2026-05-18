"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  Copy, 
  Check, 
  Zap,
  Info,
  Globe,
  Calendar,
  RefreshCw,
  Search,
  Timer,
  History,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, subDays, differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const COMMON_TIMEZONES = [
  "UTC", "America/New_York", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Dubai", "Asia/Kolkata", "Australia/Sydney"
];

export default function DateTimeHub() {
  const [now, setNow] = useState(new Date());
  const [targetDate, setTargetDate] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const selectedDate = new Date(targetDate);
  const diffDays = differenceInDays(selectedDate, now);
  const diffHours = differenceInHours(selectedDate, now) % 24;
  const diffMins = differenceInMinutes(selectedDate, now) % 60;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Advanced DateTime Hub</h1>
          <p className="text-sm text-muted-foreground">
            Professional timezone converter, date calculator, and live precision clock.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Clock Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Local Live Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Real-time</span>
              </div>
            </div>
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-sm font-bold text-primary/60 uppercase tracking-[0.3em]">{format(now, "EEEE, MMMM do")}</p>
              <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground tabular-nums leading-none">
                {format(now, "HH:mm:ss")}
              </h2>
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/10">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">UNIX Timestamp</p>
                  <p className="text-xs font-mono font-bold text-primary">{Math.floor(now.getTime() / 1000)}</p>
                </div>
                <div className="p-3 rounded-2xl bg-muted/20 border border-border/10">
                  <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">ISO 8601</p>
                  <p className="text-[10px] font-mono font-bold text-primary truncate">{now.toISOString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-3">
              <Globe className="w-4 h-4 text-primary/40" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Global Sync</span>
            </div>
            <CardContent className="p-0">
              <div className="divide-y divide-border/10">
                {COMMON_TIMEZONES.map((tz) => (
                  <div key={tz} className="px-8 py-4 flex items-center justify-between hover:bg-primary/[0.02] transition-colors group">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-wider mb-0.5">{tz.split('/').pop()?.replace('_', ' ')}</p>
                      <p className="text-sm font-bold text-foreground/80">{formatInTimeZone(now, tz, "HH:mm:ss")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-mono text-muted-foreground/40">{formatInTimeZone(now, tz, "zzz")}</p>
                      <p className="text-[8px] font-bold text-primary/40 uppercase mt-0.5">{formatInTimeZone(now, tz, "yyyy-MM-dd")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Calculator Side */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Date Difference Calculator</span>
              </div>
            </div>
            <CardContent className="p-8 space-y-12">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Select Target Date & Time</Label>
                <div className="flex gap-4">
                  <Input 
                    type="datetime-local"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl font-bold focus:ring-primary/20"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setTargetDate(format(addDays(now, 7), "yyyy-MM-dd'T'HH:mm"))}
                    className="h-16 px-6 rounded-2xl border-border/40 font-bold text-xs uppercase"
                  >
                    +1 Week
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/40 border-dashed" /></div>
                <div className="relative flex justify-center">
                  <div className="bg-background px-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Countdown / Elapsed</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-3xl bg-muted/20 border border-border/10 flex items-center justify-center">
                    <span className={cn("text-5xl font-black tracking-tighter", Math.abs(diffDays) > 0 ? "text-primary" : "text-muted-foreground/20")}>
                      {Math.abs(diffDays)}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Days</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-3xl bg-muted/20 border border-border/10 flex items-center justify-center">
                    <span className={cn("text-5xl font-black tracking-tighter", Math.abs(diffHours) > 0 ? "text-primary" : "text-muted-foreground/20")}>
                      {Math.abs(diffHours)}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Hours</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-3xl bg-muted/20 border border-border/10 flex items-center justify-center">
                    <span className={cn("text-5xl font-black tracking-tighter", Math.abs(diffMins) > 0 ? "text-primary" : "text-muted-foreground/20")}>
                      {Math.abs(diffMins)}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Minutes</p>
                </div>
              </div>

              <div className={cn(
                "p-8 rounded-[2rem] border flex items-center gap-6 animate-in slide-in-from-bottom-2",
                selectedDate >= now ? "bg-primary/5 border-primary/20 text-primary" : "bg-orange-500/5 border-orange-500/20 text-orange-600"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                  selectedDate >= now ? "bg-primary text-white" : "bg-orange-500 text-white"
                )}>
                  {selectedDate >= now ? <TrendingUp className="w-6 h-6" /> : <History className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{selectedDate >= now ? "Time Remaining" : "Time Elapsed"}</h3>
                  <p className="text-sm font-medium opacity-80 leading-snug">
                    {selectedDate >= now 
                      ? `There are approximately ${Math.abs(diffDays)} days until this target date.`
                      : `This date was approximately ${Math.abs(diffDays)} days ago.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
