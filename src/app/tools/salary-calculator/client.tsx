"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Banknote, Clock, Calendar, CalendarDays, TrendingUp, RotateCcw, DollarSign, Briefcase, Wallet, ArrowRight, Timer } from "lucide-react";

type InputType = "hourly" | "daily" | "weekly" | "monthly" | "annual";

export default function SalaryCalculator() {
  const [inputType, setInputType] = useState<InputType>("hourly");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("40");
  const [weeksPerYear, setWeeksPerYear] = useState<string>("52");

  const calculateSalaries = () => {
    const amount = parseFloat(inputAmount);
    const hours = parseFloat(hoursPerWeek);
    const weeks = parseFloat(weeksPerYear);
    if (!amount || !hours || !weeks) return null;
    let hourlyRate = 0;
    switch (inputType) {
      case "hourly": hourlyRate = amount; break;
      case "daily": hourlyRate = amount / (hours / 5); break;
      case "weekly": hourlyRate = amount / hours; break;
      case "monthly": hourlyRate = (amount * 12) / (hours * weeks); break;
      case "annual": hourlyRate = amount / (hours * weeks); break;
    }
    return { hourly: hourlyRate, daily: hourlyRate * (hours / 5), weekly: hourlyRate * hours, monthly: (hourlyRate * hours * weeks) / 12, annual: hourlyRate * hours * weeks };
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  const salaries = calculateSalaries();

  const handleReset = () => { setInputAmount(""); setHoursPerWeek("40"); setWeeksPerYear("52"); };

  const inputTypes = [
    { id: "hourly", label: "Hourly", icon: <Timer className="w-4 h-4" /> },
    { id: "daily", label: "Daily", icon: <Clock className="w-4 h-4" /> },
    { id: "weekly", label: "Weekly", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "monthly", label: "Monthly", icon: <Calendar className="w-4 h-4" /> },
    { id: "annual", label: "Annual", icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <ToolLayout toolId="salary-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Calculator
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pay Type</label>
              <div className="grid grid-cols-2 gap-2">
                {inputTypes.map((t) => (
                  <button key={t.id} onClick={() => setInputType(t.id as InputType)} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border ${inputType === t.id ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10" : "bg-card text-muted-foreground border-border hover:border-border hover:text-primary"}`}>{t.icon}{t.label}</button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Schedule</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <input type="number" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="40" className="w-full pl-3 pr-3 py-2.5 bg-card border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold text-foreground" />
                  <span className="text-[10px] text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 font-medium">Hrs/Wk</span>
                </div>
                <div className="relative">
                  <input type="number" value={weeksPerYear} onChange={(e) => setWeeksPerYear(e.target.value)} placeholder="52" className="w-full pl-3 pr-3 py-2.5 bg-card border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-sm font-bold text-foreground" />
                  <span className="text-[10px] text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 font-medium">Wks/Yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2.5 bg-muted rounded-xl"><Wallet className="w-5 h-5 text-primary" /></div>
                <div><h3 className="text-lg font-bold text-foreground">How much are you paid?</h3><p className="text-xs text-muted-foreground font-medium">Enter your pay before taxes</p></div>
              </div>
              <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 block ml-1">Enter your {inputType} pay</label>
                <div className="relative">
                  <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                  <input type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} placeholder="0.00" className="w-full pl-16 pr-6 py-5 bg-muted border-2 border-border rounded-2xl focus:border-primary focus:bg-card focus:ring-4 focus:ring-primary/10 outline-none transition-all text-3xl font-black text-foreground placeholder:text-muted-foreground" />
                </div>
                <p className="text-[10px] text-muted-foreground font-medium mt-3 ml-2">Adjust "Hours" and "Weeks" in the sidebar settings.</p>
              </div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 px-2">
                <div className="p-2.5 bg-indigo-100 rounded-xl"><CalendarDays className="w-5 h-5 text-indigo-600" /></div>
                <div><h3 className="text-lg font-bold text-foreground">Breakdown</h3><p className="text-xs text-muted-foreground font-medium">Your projected pay per period</p></div>
              </div>
              {salaries ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Weekly", val: salaries.weekly, icon: <CalendarDays className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Daily", val: salaries.daily, icon: <Clock className="w-4 h-4" />, color: "text-indigo-600", bg: "bg-indigo-50" },
                    { label: "Hourly", val: salaries.hourly, icon: <Timer className="w-4 h-4" />, color: "text-sky-600", bg: "bg-sky-50" },
                  ].map((item) => (
                    <div key={item.label} className="bg-card border border-border p-6 rounded-[2rem] shadow-sm">
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mb-4`}><div className={item.color}>{item.icon}</div></div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-xl font-black text-foreground tracking-tight">{formatCurrency(item.val)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-[2.5rem]">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4"><ArrowRight className="w-6 h-6 text-muted-foreground" /></div>
                  <p className="text-sm font-bold text-muted-foreground">Enter an amount to see the results</p>
                </div>
              )}
            </div>
          </div>

          {salaries && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><TrendingUp className="w-64 h-64 -mr-16 -mt-16" /></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border bg-muted/20 text-primary-foreground mb-4">
                    <TrendingUp className="w-3 h-3" /> Total Yearly Pay
                  </div>
                  <p className="text-sm font-bold opacity-70 uppercase tracking-widest text-muted-foreground pl-1">Annual Salary</p>
                  <div className="text-5xl sm:text-6xl font-black tracking-tight tabular-nums text-primary-foreground">{formatCurrency(salaries.annual)}</div>
                  <p className="text-xs text-muted-foreground mt-2 font-medium opacity-80 pl-1">Based on {hoursPerWeek} hrs/wk · {weeksPerYear} wks/yr</p>
                </div>
                <div className="bg-card/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 flex items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-muted-foreground" /><span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-80">Monthly Income</span></div>
                    <div className="text-3xl font-black tracking-tight tabular-nums text-primary-foreground">{formatCurrency(salaries.monthly)}</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-card/10 flex items-center justify-center border border-white/20"><TrendingUp className="w-6 h-6 text-muted-foreground" /></div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="p-6 bg-muted rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Briefcase className="w-4 h-4 text-muted-foreground" />Gross Income</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Figures represent pre-tax earnings. Actual take-home pay will vary based on your local tax bracket and deductions.</p>
            </div>
            <div className="p-6 bg-muted rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" />Overtime</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Standard calculations assume flat rate. Overtime is typically calculated at 1.5x your calculated hourly rate.</p>
            </div>
            <div className="p-6 bg-muted rounded-2xl border border-border">
              <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />Timetable</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Calculations assume a standard {weeksPerYear}-week working year with {hoursPerWeek} hours per week unless adjusted.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
