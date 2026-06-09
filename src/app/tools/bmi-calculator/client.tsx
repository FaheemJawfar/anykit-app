"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Weight, Ruler, Activity, CheckCircle2, RotateCcw, Scale } from "lucide-react";

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [debouncedBmi, setDebouncedBmi] = useState<number | null>(null);
  const [debouncedCat, setDebouncedCat] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateBMI = () => {
    let bmiValue = 0;
    if (unit === "metric") {
      const w = parseFloat(weight);
      const h = parseFloat(height) / 100;
      if (!isNaN(w) && !isNaN(h) && h > 0) {
        bmiValue = w / (h * h);
      }
    } else {
      const w = parseFloat(weight);
      const ft = parseFloat(feet) || 0;
      const inc = parseFloat(inches) || 0;
      const totalInches = ft * 12 + inc;
      if (!isNaN(w) && totalInches > 0) {
        bmiValue = (w / (totalInches * totalInches)) * 703;
      }
    }
    return bmiValue > 0 ? parseFloat(bmiValue.toFixed(1)) : null;
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { category: "Underweight", color: "text-blue-600", bg: "bg-blue-500", desc: "You are below the healthy weight range. Consider consulting a nutritionist." };
    if (bmiValue < 25) return { category: "Normal weight", color: "text-emerald-500", bg: "bg-emerald-500", desc: "You are within the healthy weight range for your height. Keep it up!" };
    if (bmiValue < 30) return { category: "Overweight", color: "text-orange-500", bg: "bg-orange-500", desc: "You are slightly above the healthy range. Regular exercise and a balanced diet can help." };
    return { category: "Obese", color: "text-red-500", bg: "bg-red-500", desc: "You are significantly above the healthy range. It is recommended to consult a healthcare provider." };
  };

  const getIdealWeight = () => {
    let minW = 0, maxW = 0;
    if (unit === "metric") {
      const h = parseFloat(height) / 100;
      if (!isNaN(h) && h > 0) { minW = 18.5 * h * h; maxW = 24.9 * h * h; }
    } else {
      const ft = parseFloat(feet) || 0;
      const inc = parseFloat(inches) || 0;
      const totalInches = ft * 12 + inc;
      if (totalInches > 0) { minW = (18.5 * totalInches * totalInches) / 703; maxW = (24.9 * totalInches * totalInches) / 703; }
    }
    return minW > 0 ? { min: minW.toFixed(1), max: maxW.toFixed(1), unit: unit === "metric" ? "kg" : "lbs" } : null;
  };

  const ideal = getIdealWeight();

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const ft = parseFloat(feet) || 0;
    const inc = parseFloat(inches) || 0;
    const totalInches = ft * 12 + inc;
    const hasValidInputs = unit === "metric" ? (w > 2 && h > 50) : (w > 2 && totalInches > 20);
    if (!hasValidInputs) { setDebouncedBmi(null); setDebouncedCat(null); setIsCalculating(false); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const result = calculateBMI();
      if (result) { setDebouncedBmi(result); setDebouncedCat(getBMICategory(result)); }
      else { setDebouncedBmi(null); setDebouncedCat(null); }
      setIsCalculating(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [weight, height, feet, inches, unit]);

  const resetAll = () => { setWeight(""); setHeight(""); setFeet(""); setInches(""); };

  return (
    <ToolLayout toolId="bmi-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={resetAll} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Clear Values
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Units</h3>
            <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-xl">
              <button onClick={() => setUnit("metric")} className={`py-2 text-xs font-bold rounded-lg transition-all ${unit === "metric" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Metric (kg/cm)</button>
              <button onClick={() => setUnit("imperial")} className={`py-2 text-xs font-bold rounded-lg transition-all ${unit === "imperial" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Imperial (lb/in)</button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl mx-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Weight ({unit === "metric" ? "kg" : "lb"})</label>
                  <div className="relative group">
                    <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0.0" className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold" />
                    <Weight className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest px-1">Height</label>
                  {unit === "metric" ? (
                    <div className="relative group">
                      <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="cm" className="w-full pl-10 pr-12 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold" />
                      <Ruler className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">cm</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative group">
                        <input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="ft" className="w-full pl-3 pr-8 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ft</span>
                      </div>
                      <div className="relative group">
                        <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="in" className="w-full pl-3 pr-8 py-3 bg-muted border border-border rounded-xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all text-sm font-bold" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">in</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isCalculating ? (
            <div className="bg-card rounded-[2.5rem] border border-border p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <Activity className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Calculating BMI...</h3>
              </div>
            </div>
          ) : debouncedBmi && debouncedCat ? (
            <div className="space-y-6">
              <div className="bg-card rounded-[2.5rem] border border-border shadow-xl shadow-primary/5 overflow-hidden">
                <div className="p-8 md:p-12 text-center bg-gradient-to-br from-slate-50/50 via-transparent to-transparent flex flex-col items-center relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600/20 via-primary/40 to-blue-600/20"></div>
                  <span className="text-[11px] font-black text-primary uppercase tracking-[0.25em] mb-8 block">Your Result</span>
                  <div className="relative mb-10">
                    <div className="text-8xl md:text-9xl font-black text-foreground tracking-tighter leading-none">{debouncedBmi}</div>
                    <div className={`mt-6 px-8 py-2.5 rounded-full text-primary-foreground font-black text-sm uppercase tracking-widest shadow-lg shadow-current/20 ${debouncedCat.bg}`}>{debouncedCat.category}</div>
                  </div>
                  <p className="text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed text-lg">{debouncedCat.desc}</p>
                  <div className="mt-10 flex items-center justify-center gap-3 px-6 py-2.5 bg-muted rounded-2xl border border-border text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Standard Health Scales Verified</span>
                  </div>
                </div>
                <div className="px-8 md:px-12 pb-12">
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-primary w-[18.5%] border-r border-white/20" title="Underweight" />
                    <div className="h-full bg-emerald-400 w-[6.5%] border-r border-white/20" title="Healthy" />
                    <div className="h-full bg-orange-400 w-[5%] border-r border-white/20" title="Overweight" />
                    <div className="h-full bg-red-400 flex-1" title="Obese" />
                    <div className="absolute top-0 bottom-0 w-1.5 bg-foreground border-x border-white shadow-xl z-10" style={{ left: `${Math.min(Math.max(((debouncedBmi - 10) / 30) * 100, 0), 100)}%` }} />
                  </div>
                  <div className="mt-4 flex justify-between text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                    <span>10.0</span><span className="text-primary">18.5</span><span className="text-emerald-500">25.0</span><span className="text-orange-500">30.0</span><span className="text-red-500">40.0+</span>
                  </div>
                </div>
              </div>
              {ideal && (
                <div className="bg-card rounded-[2rem] border border-border p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-inner"><Scale className="w-8 h-8" /></div>
                    <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Ideal Weight Range</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">The weight range for a healthy BMI</p>
                    </div>
                  </div>
                  <div className="bg-emerald-500 px-10 py-6 rounded-3xl text-center text-primary-foreground shadow-xl border-b-4 border-emerald-600">
                    <div className="text-3xl font-black leading-none mb-1 tabular-nums">{ideal.min} - {ideal.max}</div>
                    <div className="text-[10px] font-bold opacity-80 uppercase tracking-widest ml-1">{ideal.unit} Range</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-card rounded-[2.5rem] border-2 border-dashed border-border">
              <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center mb-6"><Weight className="w-10 h-10 text-primary" /></div>
              <h3 className="text-2xl font-black text-foreground mb-2 uppercase tracking-tight">Ready to Calculate</h3>
              <p className="text-muted-foreground text-center max-w-sm">Enter your weight and height to visualize your Body Mass Index and healthy targets.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
