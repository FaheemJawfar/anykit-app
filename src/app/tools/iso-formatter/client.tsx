"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Calendar, RotateCcw, Copy, Check, Info, Globe, Clock, Code, ClipboardList, ShieldCheck, Zap } from "lucide-react";

export default function ISOFormatter() {
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString());
  const [copied, setCopied] = useState<string | null>(null);

  const formats = [
    { label: "ISO 8601 (Full)", fn: (d: Date) => d.toISOString(), desc: "Complete date and time in UTC", icon: <Globe className="w-4 h-4" /> },
    { label: "ISO 8601 (YMD)", fn: (d: Date) => d.toISOString().split("T")[0], desc: "Date part only", icon: <Calendar className="w-4 h-4" /> },
    { label: "Local ISO", fn: (d: Date) => { const offset = d.getTimezoneOffset(); const localDate = new Date(d.getTime() - offset * 60 * 1000); return localDate.toISOString().split(".")[0].replace("Z", ""); }, desc: "No timezone offset", icon: <Clock className="w-4 h-4" /> },
    { label: "Localized String", fn: (d: Date) => d.toLocaleString(), desc: "User regional format", icon: <ClipboardList className="w-4 h-4" /> },
    { label: "Short Date", fn: (d: Date) => d.toLocaleDateString(), desc: "Brief regional date", icon: <Calendar className="w-4 h-4" /> },
    { label: "RFC 2822 / UTC", fn: (d: Date) => d.toUTCString(), desc: "HTTP/Email standard", icon: <Code className="w-4 h-4" /> },
  ];

  const handleCopy = async (text: string, id: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); setTimeout(() => setCopied(null), 2000); } catch (err) { console.error(err); }
  };

  const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());
  const parsedDate = new Date(inputDate);
  const isDateError = !isValidDate(parsedDate);

  const handleReset = () => { setInputDate(""); setCopied(null); };
  const setNow = () => { setInputDate(new Date().toISOString()); };

  return (
    <ToolLayout toolId="iso-formatter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Clear Input
            </Button>
            <Button onClick={setNow} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              <Zap className="w-4 h-4 mr-2" /> Use Now
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">About ISO 8601</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">ISO 8601 eliminates ambiguity by utilizing a standardized YYYY-MM-DD hierarchy, ensuring seamless data exchange across international boundaries.</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Enter Date or Time</label>
              {inputDate && !isDateError && <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Valid Date</span>}
            </div>
            <div className={`p-8 md:p-10 bg-card border-2 rounded-[2.5rem] transition-all flex flex-col md:flex-row items-center gap-8 ${isDateError && inputDate ? "border-red-100 bg-red-50/10" : "border-border shadow-sm focus-within:border-primary focus-within:shadow-2xl focus-within:shadow-primary/5"}`}>
              <div className={`p-5 rounded-[2rem] hidden md:block ${isDateError && inputDate ? "bg-red-50 text-red-400" : "bg-muted text-primary"}`}><Calendar className="w-10 h-10" /></div>
              <div className="flex-1 w-full">
                <input type="text" value={inputDate} onChange={(e) => setInputDate(e.target.value)} className="w-full text-3xl md:text-4xl font-black text-foreground outline-none placeholder:text-muted-foreground bg-transparent text-center md:text-left" placeholder="2024-01-01 or 1704067200" />
                {isDateError && inputDate && <p className="mt-3 text-xs font-bold text-red-500 flex items-center justify-center md:justify-start gap-2"><Info className="w-4 h-4" /> Invalid temporal format detected</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 px-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ISO 8601 Result</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formats.map((f, index) => {
                const result = !isDateError ? f.fn(parsedDate) : null;
                return (
                  <div key={f.label} className="bg-card p-6 md:p-8 rounded-[2.5rem] border border-border transition-all hover:border-border hover:shadow-xl hover:shadow-primary/5 group">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-muted rounded-xl text-muted-foreground group-hover:text-primary transition-colors">{f.icon}</div>
                        <div><h4 className="text-sm font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{f.label}</h4><p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{f.desc}</p></div>
                      </div>
                      {result && (
                        <button onClick={() => handleCopy(result, f.label)} className="p-3 bg-muted hover:bg-emerald-50 rounded-[1.25rem] text-muted-foreground hover:text-emerald-600 transition-all">
                          {copied === f.label ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                    <div className="bg-muted p-5 rounded-2xl border border-border/50 group-hover:bg-card group-hover:border-border transition-all">
                      <code className="text-lg font-mono font-bold text-foreground break-all leading-tight">{result || <span className="text-muted-foreground">Waiting for valid input...</span>}</code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
