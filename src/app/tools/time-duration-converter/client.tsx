"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Clock, RotateCcw, Copy, Check, Zap, CalendarDays, Timer, Play, ArrowRightLeft, ShieldCheck, Info } from "lucide-react";

export default function TimeDurationConverter() {
  const [inputValue, setInputValue] = useState<string>("");
  const [inputUnit, setInputUnit] = useState<string>("hour");
  const [copied, setCopied] = useState<string | null>(null);

  const units = [
    { value: "millisecond", label: "Milliseconds", short: "ms", factor: 0.001, icon: <Zap className="w-4 h-4" /> },
    { value: "second", label: "Seconds", short: "s", factor: 1, icon: <Timer className="w-4 h-4" /> },
    { value: "minute", label: "Minutes", short: "m", factor: 60, icon: <Clock className="w-4 h-4" /> },
    { value: "hour", label: "Hours", short: "h", factor: 3600, icon: <Clock className="w-4 h-4" /> },
    { value: "day", label: "Days", short: "d", factor: 86400, icon: <CalendarDays className="w-4 h-4" /> },
    { value: "week", label: "Weeks", short: "w", factor: 604800, icon: <CalendarDays className="w-4 h-4" /> },
    { value: "month", label: "Months (Avg)", short: "mo", factor: 2629746, icon: <CalendarDays className="w-4 h-4" /> },
    { value: "year", label: "Years (Avg)", short: "y", factor: 31557600, icon: <CalendarDays className="w-4 h-4" /> },
  ];

  const getResults = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || !inputValue) return [];
    const currentUnit = units.find(u => u.value === inputUnit);
    if (!currentUnit) return [];
    const seconds = val * currentUnit.factor;
    return units.map(unit => {
      let result = seconds / unit.factor;
      let formattedResult;
      if (result === 0) formattedResult = "0";
      else if (Math.abs(result) < 0.000001) formattedResult = result.toExponential(4);
      else if (result % 1 === 0) formattedResult = result.toString();
      else formattedResult = result.toLocaleString(undefined, { maximumFractionDigits: 4 });
      return { ...unit, result: formattedResult };
    });
  };

  const handleCopy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); } catch (err) { console.error(err); }
  };

  const results = getResults();

  return (
    <ToolLayout toolId="time-duration-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={() => { setInputValue(""); setCopied(null); }} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Entry Unit</h3>
            <div className="grid grid-cols-2 gap-2">
              {units.map(u => (
                <button key={u.value} onClick={() => setInputUnit(u.value)} className={`p-2 rounded-xl border-2 text-[10px] font-bold uppercase tracking-wider transition-all ${inputUnit === u.value ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground hover:border-border"}`}>{u.label}</button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Calculation Base</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Months are averaged at 30.44 days and years at 365.24 days to account for leap years and month variability.</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 md:p-10 bg-card border border-border rounded-[2.5rem] shadow-sm transition-all focus-within:shadow-2xl focus-within:shadow-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><Timer className="w-48 h-48 text-primary" /></div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-10 items-center relative z-10">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Time Duration</label>
                <div className="flex items-center gap-4">
                  <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter duration..." className="w-full text-5xl md:text-6xl font-black text-foreground outline-none placeholder:text-muted-foreground bg-transparent px-2" />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Temporal Unit</label>
                <div className="relative">
                  <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)} className="w-full h-16 px-6 bg-muted border-2 border-border rounded-2xl text-lg font-bold text-foreground outline-none focus:bg-card focus:border-primary transition-all appearance-none cursor-pointer">
                    {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"><ArrowRightLeft className="w-5 h-5 rotate-90" /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Equivalent Durations</span><div className="h-px flex-1 bg-border" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {results.length > 0 ? results.map((res) => (
                <div key={res.value} className={`p-6 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${res.value === inputUnit ? "bg-primary border-primary shadow-xl shadow-primary/30" : "bg-card border-border hover:border-border hover:shadow-lg hover:shadow-primary/5"}`}>
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${res.value === inputUnit ? "bg-card/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{res.icon}</div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${res.value === inputUnit ? "text-primary-foreground" : "text-muted-foreground"}`}>{res.label}</span>
                    </div>
                    <button onClick={() => handleCopy(res.result, res.value)} className={`p-2 rounded-xl transition-all ${res.value === inputUnit ? "hover:bg-card/20 text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}>{copied === res.value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
                  </div>
                  <div className="relative z-10">
                    <p className={`text-2xl font-black whitespace-nowrap leading-tight ${res.value === inputUnit ? "text-primary-foreground" : "text-foreground"}`}>{res.result}</p>
                    <p className={`text-[10px] font-bold mt-1 uppercase tracking-tighter ${res.value === inputUnit ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Total {res.short}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-muted rounded-[3rem] border-2 border-dashed border-border text-muted-foreground">
                  <Clock className="w-16 h-16 mb-6 opacity-20" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Temporal matrix awaiting input</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
