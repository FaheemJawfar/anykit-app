"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Flag,
  Zap,
  Info,
  History,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<any>(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const pause = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps([time, ...laps]);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    return {
      min: minutes.toString().padStart(2, "0"),
      sec: seconds.toString().padStart(2, "0"),
      ms: centiseconds.toString().padStart(2, "0")
    };
  };

  const timeParts = formatTime(time);

  return (
    <ToolLayout toolId="stopwatch">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Timer Display */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col items-center justify-center py-20 relative">
            <div className="absolute top-8 right-8 flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isRunning ? "bg-green-500 animate-pulse" : "bg-muted-foreground/30"
              )} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {isRunning ? "Running" : "Paused"}
              </span>
            </div>

            <div className="flex items-baseline gap-2 md:gap-4 select-none">
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none">{timeParts.min}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">Minutes</span>
              </div>
              <span className="text-6xl md:text-9xl font-black text-primary/20">:</span>
              <div className="flex flex-col items-center">
                <span className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none">{timeParts.sec}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mt-2">Seconds</span>
              </div>
              <span className="text-6xl md:text-9xl font-black text-primary/20">.</span>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-primary/80 mb-6 md:mb-12">{timeParts.ms}</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">ms</span>
              </div>
            </div>

            <div className="mt-16 flex items-center gap-4 md:gap-8">
              <Button 
                onClick={reset}
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full border-border/40 hover:bg-destructive/5 hover:text-destructive transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </Button>

              {isRunning ? (
                <Button 
                  onClick={pause}
                  className="w-24 h-24 rounded-full bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/20 transition-all scale-110 active:scale-95"
                >
                  <Pause className="w-10 h-10 fill-white" />
                </Button>
              ) : (
                <Button 
                  onClick={start}
                  className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all scale-110 active:scale-95"
                >
                  <Play className="w-10 h-10 fill-white ml-1" />
                </Button>
              )}

              <Button 
                onClick={addLap}
                disabled={!time}
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full border-border/40 hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Flag className="w-6 h-6" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Laps & History Panel */}
        <div className="lg:col-span-4 h-full">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col h-full min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Lap History</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                {laps.length} Laps
              </div>
            </div>
            <CardContent className="p-0 flex-1 overflow-auto bg-primary/[0.01]">
              {laps.length > 0 ? (
                <div className="divide-y divide-border/10">
                  {laps.map((lapTime, i) => {
                    const parts = formatTime(lapTime);
                    const prevLap = laps[i + 1] || 0;
                    const diff = lapTime - prevLap;
                    const diffParts = formatTime(diff);
                    
                    return (
                      <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-muted/10 transition-colors animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-muted-foreground/30 w-6">{(laps.length - i).toString().padStart(2, '0')}</span>
                          <div className="font-mono font-bold text-lg">
                            {parts.min}:{parts.sec}.<span className="text-sm opacity-50">{parts.ms}</span>
                          </div>
                        </div>
                        {i < laps.length - 1 && (
                          <span className="text-[10px] font-mono text-primary/60">
                            +{diffParts.sec}.{diffParts.ms}s
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-4 opacity-30">
                  <Flag className="w-12 h-12" />
                  <p className="text-sm font-medium italic">No laps recorded yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
