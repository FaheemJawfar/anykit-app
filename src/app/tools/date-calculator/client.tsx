"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, CalendarPlus, CalendarMinus, RotateCcw, Clock, Zap, CheckCircle2, Timer, ArrowRightLeft, CalendarSearch, Target } from "lucide-react";

type Operation = "add" | "subtract" | "difference";

export default function DateCalculator() {
  const [operation, setOperation] = useState<Operation>("difference");
  const today = new Date();
  const [startDay, setStartDay] = useState<string>(today.getDate().toString());
  const [startMonth, setStartMonth] = useState<string>((today.getMonth() + 1).toString());
  const [startYear, setStartYear] = useState<string>(today.getFullYear().toString());
  const [endDay, setEndDay] = useState<string>("");
  const [endMonth, setEndMonth] = useState<string>("");
  const [endYear, setEndYear] = useState<string>("");
  const [years, setYears] = useState<string>("");
  const [months, setMonths] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [debouncedResult, setDebouncedResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const getValidDate = (dStr: string, mStr: string, yStr: string) => {
    const d = parseInt(dStr); const m = parseInt(mStr) - 1; const y = parseInt(yStr);
    if (d > 0 && d <= 31 && m >= 0 && m < 12 && y >= 1) {
      const date = new Date(y, m, d, 12, 0, 0);
      if (date.getDate() === d && date.getMonth() === m && date.getFullYear() === y) return date;
    }
    return null;
  };

  const calculateDate = (baseDate: Date) => {
    const date = new Date(baseDate);
    const y = parseInt(years) || 0; const m = parseInt(months) || 0; const d = parseInt(days) || 0;
    const op = operation === "add" ? 1 : -1;
    date.setFullYear(date.getFullYear() + (op * y));
    date.setMonth(date.getMonth() + (op * m));
    date.setDate(date.getDate() + (op * d));
    return { iso: date.toISOString().split("T")[0], formatted: date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) };
  };

  const calculateDifference = (start: Date, end: Date) => {
    const isBackward = start > end;
    const s = isBackward ? end : start; const e = isBackward ? start : end;
    let y = e.getFullYear() - s.getFullYear(); let m = e.getMonth() - s.getMonth(); let d = e.getDate() - s.getDate();
    if (d < 0) { m--; const prev = new Date(e.getFullYear(), e.getMonth(), 0); d += prev.getDate(); }
    if (m < 0) { y--; m += 12; }
    const totalDays = Math.floor(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return { years: y, months: m, days: d, totalDays, totalWeeks: Math.floor(totalDays / 7), totalMonths: y * 12 + m, totalHours: totalDays * 24, isBackward };
  };

  useEffect(() => {
    const startDate = getValidDate(startDay, startMonth, startYear);
    const endDate = operation === "difference" ? getValidDate(endDay, endMonth, endYear) : null;
    const hasRequiredInputs = operation === "difference" ? (startDate && endDate) : (startDate && (parseInt(years) > 0 || parseInt(months) > 0 || parseInt(days) > 0));
    if (!hasRequiredInputs) { setDebouncedResult(null); setIsCalculating(false); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      if (operation === "difference") { setDebouncedResult(calculateDifference(startDate!, endDate!)); }
      else { setDebouncedResult(calculateDate(startDate!)); }
      setIsCalculating(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [operation, startDay, startMonth, startYear, endDay, endMonth, endYear, years, months, days]);

  const handleReset = () => {
    setStartDay(today.getDate().toString()); setStartMonth((today.getMonth() + 1).toString()); setStartYear(today.getFullYear().toString());
    setEndDay(""); setEndMonth(""); setEndYear(""); setYears(""); setMonths(""); setDays(""); setDebouncedResult(null);
  };

  return (
    <ToolLayout toolId="date-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Mode</h3>
            <div className="grid grid-cols-1 gap-2">
              {[{ id: "difference", label: "Date Difference", icon: <ArrowRightLeft className="w-4 h-4" /> }, { id: "add", label: "Add to Date", icon: <CalendarPlus className="w-4 h-4" /> }, { id: "subtract", label: "Subtract from Date", icon: <CalendarMinus className="w-4 h-4" /> }].map((mode) => (
                <button key={mode.id} onClick={() => setOperation(mode.id as Operation)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-black transition-all ${operation === mode.id ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground border border-border"}`}>{mode.icon}<span className="tracking-tight">{mode.label}</span></button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All
            </Button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><Calendar className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Start Date</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Initial point in time</p></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Day</label><input type="number" min="1" max="31" value={startDay} onChange={(e) => setStartDay(e.target.value)} placeholder="DD" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Month</label><input type="number" min="1" max="12" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} placeholder="MM" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Year</label><input type="number" min="1" value={startYear} onChange={(e) => setStartYear(e.target.value)} placeholder="YYYY" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                </div>
              </div>
              <div className="space-y-6">
                {operation === "difference" ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><Target className="w-5 h-5" /></div>
                      <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">End Date</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Target point in time</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Day</label><input type="number" min="1" max="31" value={endDay} onChange={(e) => setEndDay(e.target.value)} placeholder="DD" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Month</label><input type="number" min="1" max="12" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} placeholder="MM" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Year</label><input type="number" min="1" value={endYear} onChange={(e) => setEndYear(e.target.value)} placeholder="YYYY" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100"><Timer className="w-5 h-5" /></div>
                      <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Time Offset</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Amount to {operation}</p></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Years</label><input type="number" value={years} onChange={(e) => setYears(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Months</label><input type="number" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Days</label><input type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="0" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-black text-foreground text-center" /></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {isCalculating ? (
            <div className="bg-card rounded-[2.5rem] border border-border p-16 text-center shadow-sm">
              <div className="flex flex-col items-center gap-6">
                <div className="relative"><div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div><Clock className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 text-primary" /></div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Calculating Date...</h3>
              </div>
            </div>
          ) : debouncedResult ? (
            operation === "difference" ? (
              <div className="bg-card rounded-[2.5rem] border border-border shadow-xl shadow-primary/5 overflow-hidden">
                <div className="p-10 md:p-16 text-center bg-gradient-to-br from-slate-50/50 via-transparent to-transparent flex flex-col items-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/20 via-primary/40 to-blue-600/20"></div>
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-10 block">Time Difference</span>
                  <div className="relative mb-12 flex flex-col md:flex-row items-baseline gap-4 md:gap-8 justify-center">
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-none">{debouncedResult.years}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Years</span></div>
                    <div className="text-5xl font-black text-muted-foreground hidden md:block">/</div>
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-primary tracking-tighter leading-none">{debouncedResult.months}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Months</span></div>
                    <div className="text-5xl font-black text-muted-foreground hidden md:block">/</div>
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-none">{debouncedResult.days}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Days</span></div>
                  </div>
                  {debouncedResult.isBackward && <div className="flex items-center justify-center gap-3 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700"><Timer className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Calculating backward through time</span></div>}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border bg-muted/30">
                  {[{ label: "Total Days", value: debouncedResult.totalDays, icon: <CalendarDays className="w-5 h-5" />, color: "text-primary", bg: "bg-muted" }, { label: "Total Weeks", value: debouncedResult.totalWeeks, icon: <Clock className="w-5 h-5" />, color: "text-indigo-600", bg: "bg-indigo-50" }, { label: "Total Months", value: debouncedResult.totalMonths, icon: <Calendar className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }, { label: "Total Hours", value: debouncedResult.totalHours, icon: <Zap className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50" }].map((stat, i) => (
                    <div key={i} className={`p-8 flex flex-col items-center text-center gap-3 ${i < 3 ? "border-r border-border" : ""}`}>
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                      <div><div className="text-2xl font-black text-foreground tabular-nums tracking-tight">{stat.value?.toLocaleString() ?? "0"}</div><div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-[2.5rem] border border-border shadow-xl shadow-primary/5 overflow-hidden p-10 md:p-16 text-center relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
                <div className="space-y-6">
                  <div><span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-4 block">The Date</span><h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">{debouncedResult.formatted}</h2><p className="text-xl font-mono text-muted-foreground mt-2 font-bold">{debouncedResult.iso}</p></div>
                  <div className="flex items-center justify-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 mx-auto w-fit"><CheckCircle2 className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Adjusted for leap years and months</span></div>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-card rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8"><CalendarSearch className="w-12 h-12 text-primary" /></div>
              <h3 className="text-3xl font-black text-foreground mb-3 uppercase tracking-tight">Ready to Calculate</h3>
              <p className="text-muted-foreground text-center max-w-sm leading-relaxed font-medium text-lg">Enter your dates or offsets above to calculate the exact time difference and find future dates.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
