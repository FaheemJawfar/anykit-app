"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw, Clock, CalendarDays, Timer, TrendingUp, Baby, Target, Cake, Zap, Activity, CalendarClock } from "lucide-react";

export default function AgeCalculator() {
  const [birthDay, setBirthDay] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthYear, setBirthYear] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const d = parseInt(birthDay); const m = parseInt(birthMonth) - 1; const y = parseInt(birthYear);
    if (isNaN(d) || isNaN(m) || isNaN(y) || d < 1 || d > 31 || m < 0 || m > 11) { setResult(null); return; }
    const birthDate = new Date(y, m, d, 0, 0, 0);
    if (birthDate.getDate() !== d || birthDate.getMonth() !== m || birthDate.getFullYear() !== y) { setResult(null); return; }
    if (birthDate > new Date()) { setResult(null); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const now = new Date();
      let years = now.getFullYear() - birthDate.getFullYear();
      let months = now.getMonth() - birthDate.getMonth();
      let days = now.getDate() - birthDate.getDate();
      if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
      if (months < 0) { years--; months += 12; }
      const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;
      const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
      const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const zodiac = getZodiac(birthDate.getDate(), birthDate.getMonth() + 1);
      setResult({ years, months, days, totalDays, totalWeeks, totalHours, totalMinutes, daysUntilBirthday, zodiac, nextBirthday: nextBirthday.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) });
      setIsCalculating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [birthDay, birthMonth, birthYear]);

  const getZodiac = (day: number, month: number) => {
    const signs = [
      { name: "Capricorn", start: [1, 1], end: [1, 19] }, { name: "Aquarius", start: [1, 20], end: [2, 18] },
      { name: "Pisces", start: [2, 19], end: [3, 20] }, { name: "Aries", start: [3, 21], end: [4, 19] },
      { name: "Taurus", start: [4, 20], end: [5, 20] }, { name: "Gemini", start: [5, 21], end: [6, 20] },
      { name: "Cancer", start: [6, 21], end: [7, 22] }, { name: "Leo", start: [7, 23], end: [8, 22] },
      { name: "Virgo", start: [8, 23], end: [9, 22] }, { name: "Libra", start: [9, 23], end: [10, 22] },
      { name: "Scorpio", start: [10, 23], end: [11, 21] }, { name: "Sagittarius", start: [11, 22], end: [12, 21] },
      { name: "Capricorn", start: [12, 22], end: [12, 31] }
    ];
    for (const sign of signs) {
      const startMonth = sign.start[0]; const startDay = sign.start[1];
      const endMonth = sign.end[0]; const endDay = sign.end[1];
      if (month === startMonth && day >= startDay || month === endMonth && day <= endDay) return sign.name;
    }
    return "Unknown";
  };

  const handleReset = () => { setBirthDay(""); setBirthMonth(""); setBirthYear(""); setResult(null); };

  return (
    <ToolLayout toolId="age-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Inputs
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Fun Facts</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">Your zodiac sign is determined by the position of the sun on your birthday. The average person takes about 23,000 breaths per day!</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><Calendar className="w-5 h-5" /></div>
              <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Your Birth Date</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Enter when you were born</p></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Day</label><input type="number" min="1" max="31" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} placeholder="DD" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-bold text-foreground text-center" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Month</label><input type="number" min="1" max="12" value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} placeholder="MM" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-bold text-foreground text-center" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Year</label><input type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} placeholder="YYYY" className="w-full px-4 py-3 bg-muted border border-border rounded-xl outline-none transition-all text-sm font-bold text-foreground text-center" /></div>
            </div>
          </div>

          {isCalculating ? (
            <div className="bg-card rounded-[2.5rem] border border-border p-16 text-center shadow-sm">
              <div className="flex flex-col items-center gap-6">
                <div className="relative"><div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div><Timer className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 text-primary" /></div>
                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Calculating Age...</h3>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="bg-card rounded-[2.5rem] border border-border shadow-xl shadow-primary/5 overflow-hidden">
                <div className="p-10 md:p-16 text-center bg-gradient-to-br from-slate-50/50 via-transparent to-transparent flex flex-col items-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20"></div>
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em] mb-8 block">Your Exact Age</span>
                  <div className="relative mb-12 flex flex-col md:flex-row items-baseline gap-4 md:gap-8 justify-center">
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-none">{result.years}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Years</span></div>
                    <div className="text-5xl font-black text-muted-foreground hidden md:block">/</div>
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-primary tracking-tighter leading-none">{result.months}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Months</span></div>
                    <div className="text-5xl font-black text-muted-foreground hidden md:block">/</div>
                    <div className="flex flex-col"><span className="text-7xl md:text-8xl font-black text-foreground tracking-tighter leading-none">{result.days}</span><span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mt-2">Days</span></div>
                  </div>
                  <div className="flex items-center justify-center gap-3 px-6 py-2.5 bg-muted rounded-2xl border border-border text-muted-foreground">
                    <Activity className="w-4 h-4 text-emerald-500" /><span className="text-[10px] font-bold uppercase tracking-widest">Zodiac: {result.zodiac}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-border bg-muted/30">
                  {[{ label: "Total Days", value: result.totalDays, icon: <CalendarDays className="w-5 h-5" />, color: "text-primary", bg: "bg-muted" }, { label: "Total Weeks", value: result.totalWeeks, icon: <Clock className="w-5 h-5" />, color: "text-indigo-600", bg: "bg-indigo-50" }, { label: "Total Hours", value: result.totalHours.toLocaleString(), icon: <Zap className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50" }, { label: "Next Birthday", value: result.daysUntilBirthday, icon: <CalendarClock className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50", suffix: " days" }].map((stat, i) => (
                    <div key={i} className={`p-6 flex flex-col items-center text-center gap-2 ${i < 3 ? "border-r border-border" : ""}`}>
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>{stat.icon}</div>
                      <div><div className="text-2xl font-black text-foreground tabular-nums tracking-tight">{stat.value}{stat.suffix ? <span className="text-sm text-muted-foreground ml-1">{stat.suffix}</span> : ""}</div><div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-[2.5rem] p-8 text-center">
                <div className="flex items-center justify-center gap-3"><Cake className="w-5 h-5 text-primary" /><h3 className="text-lg font-black text-foreground uppercase tracking-tight">Next Birthday</h3></div>
                <p className="text-3xl font-black text-foreground mt-4">{result.nextBirthday}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Only {result.daysUntilBirthday} days to go!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-card rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-24 h-24 bg-primary/5 rounded-[2rem] flex items-center justify-center mb-8"><Baby className="w-12 h-12 text-primary" /></div>
              <h3 className="text-3xl font-black text-foreground mb-3 uppercase tracking-tight">Ready to Calculate</h3>
              <p className="text-muted-foreground text-center max-w-sm leading-relaxed font-medium text-lg">Enter your birth date above to see your exact age in years, months, and days.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
