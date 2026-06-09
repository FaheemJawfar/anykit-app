"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRightLeft, Copy, Check, Globe, Sun, Moon, Clock, Info, RotateCcw, ShieldCheck } from "lucide-react";

interface TimezoneGroup { name: string; timezones: string[]; }
interface TimezoneInfo { timezone: string; time: string; date: string; offset: string; isDST: boolean; }

export default function TimeZoneConverter() {
  const [dateTime, setDateTime] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  });
  const [fromTimezone, setFromTimezone] = useState<string>("UTC");
  const [toTimezone, setToTimezone] = useState<string>("America/New_York");
  const [result, setResult] = useState<string>("");
  const [resultDate, setResultDate] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showWorldClock, setShowWorldClock] = useState(true);
  const [use24Hour, setUse24Hour] = useState(true);
  const [timezones, setTimezones] = useState<TimezoneGroup[]>([]);

  useEffect(() => {
    try {
      const allTimezones = typeof (Intl as any).supportedValuesOf === "function" ? (Intl as any).supportedValuesOf("timeZone") : ["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"];
      const groups: Record<string, string[]> = {};
      allTimezones.forEach((tz: string) => { const part = tz.split("/")[0]; const region = part === "Etc" ? "Others" : part; if (!groups[region]) groups[region] = []; groups[region].push(tz); });
      setTimezones(Object.keys(groups).sort().map(region => ({ name: region, timezones: groups[region].sort() })));
    } catch (e) { console.error("Failed to load timezones:", e); }
  }, []);

  const formatDateTimeForDisplay = (date: Date, timezone: string) => {
    const timeOptions: Intl.DateTimeFormatOptions = { timeZone: timezone, hour: "2-digit", minute: "2-digit", second: showSeconds ? "2-digit" : undefined, hour12: !use24Hour };
    const dateOptions: Intl.DateTimeFormatOptions = { timeZone: timezone, weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const offsetFormatter = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "longOffset" });
    const offsetParts = offsetFormatter.formatToParts(date);
    const offset = offsetParts.find(part => part.type === "timeZoneName")?.value || "";
    return { time: new Intl.DateTimeFormat("en-US", timeOptions).format(date), date: new Intl.DateTimeFormat("en-US", dateOptions).format(date), offset };
  };

  useEffect(() => {
    try {
      const date = new Date(dateTime);
      if (isNaN(date.getTime())) { setError("Invalid date/time"); setResult(""); setResultDate(""); return; }
      const formatted = formatDateTimeForDisplay(date, toTimezone);
      setResult(formatted.time); setResultDate(formatted.date); setError("");
    } catch (err) { setError("Error converting time zones"); setResult(""); setResultDate(""); }
  }, [dateTime, fromTimezone, toTimezone, use24Hour, showSeconds]);

  const swapTimezones = () => { const temp = fromTimezone; setFromTimezone(toTimezone); setToTimezone(temp); };
  const handleCopy = async (text: string) => { if (text) { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) {} } };
  const setCurrentTime = () => { const now = new Date(); setDateTime(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`); };
  const handleReset = () => { setCurrentTime(); setFromTimezone("UTC"); setToTimezone("America/New_York"); setResult(""); setResultDate(""); setError(""); };

  const getWorldClockInfo = (): TimezoneInfo[] => {
    const now = new Date();
    const majorTimezones = ["America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Singapore", "Australia/Sydney"];
    return majorTimezones.map(tz => {
      const formatted = formatDateTimeForDisplay(now, tz);
      const jan = new Date(now.getFullYear(), 0, 1); const jul = new Date(now.getFullYear(), 6, 1);
      const janOffset = new Date(jan.toLocaleString("en-US", { timeZone: tz })).getTime() - jan.getTime();
      const julOffset = new Date(jul.toLocaleString("en-US", { timeZone: tz })).getTime() - jul.getTime();
      return { timezone: tz, time: formatted.time, date: formatted.date, offset: formatted.offset, isDST: janOffset !== julOffset };
    });
  };

  return (
    <ToolLayout toolId="time-zone-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset All
            </Button>
            <Button onClick={setCurrentTime} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              <Clock className="w-4 h-4 mr-2" /> Use Current
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">Include Seconds</span><button onClick={() => setShowSeconds(!showSeconds)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showSeconds ? "bg-primary" : "bg-muted"}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${showSeconds ? "translate-x-6" : "translate-x-1"}`} /></button></div>
              <div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">24-hour Format</span><button onClick={() => setUse24Hour(!use24Hour)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${use24Hour ? "bg-primary" : "bg-muted"}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${use24Hour ? "translate-x-6" : "translate-x-1"}`} /></button></div>
              <div className="flex items-center justify-between"><span className="text-sm font-bold text-muted-foreground">World Clock</span><button onClick={() => setShowWorldClock(!showWorldClock)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showWorldClock ? "bg-primary" : "bg-muted"}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-card transition-transform ${showWorldClock ? "translate-x-6" : "translate-x-1"}`} /></button></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Choose Date & Time</span><div className="h-px flex-1 bg-border" /></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-6 bg-card rounded-3xl border-2 border-border focus-within:border-primary shadow-sm transition-all">
                <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} step={showSeconds ? "1" : "60"} className="w-full text-2xl md:text-3xl font-black text-foreground outline-none bg-transparent" />
              </div>
              <Button onClick={setCurrentTime} className="h-auto px-8 rounded-3xl font-bold uppercase tracking-widest text-xs">
                <Calendar className="w-4 h-4 mr-2" /> Use Current
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
            <div className="p-6 md:p-8 bg-card rounded-[2.5rem] border-2 border-border focus-within:border-primary transition-all shadow-sm">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 block">Source Timezone</label>
              <select value={fromTimezone} onChange={(e) => setFromTimezone(e.target.value)} className="w-full h-14 px-6 bg-muted border-2 border-border rounded-2xl text-base font-bold text-foreground outline-none focus:bg-card focus:border-primary transition-all appearance-none cursor-pointer">
                {timezones.map((group) => (<optgroup key={group.name} label={group.name}>{group.timezones.map((tz) => (<option key={tz} value={tz}>{tz.replace(/_/g, " ").replace(/\//g, " / ")}</option>))}</optgroup>))}
              </select>
              <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs bg-muted px-3 py-1.5 rounded-lg w-fit"><Globe className="w-3.5 h-3.5" />{fromTimezone.split("/").pop()?.replace(/_/g, " ")}</div>
            </div>
            <div className="flex justify-center"><button onClick={swapTimezones} className="w-14 h-14 rounded-full bg-muted border-2 border-border text-muted-foreground hover:text-primary hover:border-border transition-all flex items-center justify-center shadow-sm"><ArrowRightLeft className="w-6 h-6" /></button></div>
            <div className="p-6 md:p-8 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] shadow-xl shadow-primary/20 min-h-[200px] flex flex-col justify-center relative overflow-hidden">
              <label className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/50 mb-2 relative z-10">Target Result</label>
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className={`font-black text-primary-foreground py-1 ${result.length > 10 ? "text-4xl" : "text-5xl"}`}>{result || "--:--"}</p>
                  <p className="text-primary-foreground/70 font-bold text-sm mt-1">{resultDate}</p>
                  <p className="text-primary-foreground/50 font-bold text-xs mt-0.5">{toTimezone.replace(/_/g, " ").replace(/\//g, " / ")}</p>
                </div>
                {result && <button onClick={() => handleCopy(result)} className="p-4 bg-card/10 hover:bg-card/20 rounded-2xl text-primary-foreground transition-all flex-shrink-0">{copied ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}</button>}
              </div>
              <div className="mt-4 relative z-10">
                <select value={toTimezone} onChange={(e) => setToTimezone(e.target.value)} className="w-full h-12 px-6 bg-card/10 border border-white/10 rounded-2xl text-sm font-bold text-primary-foreground outline-none focus:bg-card/20 transition-all appearance-none cursor-pointer">
                  {timezones.map((group) => (<optgroup key={group.name} label={group.name}>{group.timezones.map((tz) => (<option key={tz} value={tz}>{tz.replace(/_/g, " ").replace(/\//g, " / ")}</option>))}</optgroup>))}
                </select>
              </div>
            </div>
          </div>

          {showWorldClock && (
            <div className="space-y-4">
              <div className="flex items-center gap-4"><span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Global Clocks</span><div className="h-px flex-1 bg-border" /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getWorldClockInfo().map((info) => (
                  <div key={info.timezone} className="p-6 bg-card border-2 border-border rounded-3xl hover:border-border hover:shadow-xl hover:shadow-primary/5 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary transition-colors">{info.timezone.split("/").pop()?.replace(/_/g, " ")}</span>
                      <div className="flex items-center gap-1.5 grayscale group-hover:grayscale-0 transition-all">{info.isDST ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-primary" />}<span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">{info.offset}</span></div>
                    </div>
                    <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{info.time}</p>
                    <p className="text-[10px] font-bold text-muted-foreground mt-1">{info.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
