"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Weight, RotateCcw, Activity, ArrowRight, ShieldCheck, Scale, FlaskConical, Info, Users } from "lucide-react";

type Gender = "male" | "female";
type Unit = "metric" | "imperial";

export default function IdealWeightCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<string>("");
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");

  const calculateIdealWeights = () => {
    let heightCm = 0;
    if (unit === "metric") { heightCm = parseFloat(height); }
    else {
      const ft = parseFloat(feet) || 0;
      const inc = parseFloat(inches) || 0;
      if (!feet && !inches) return null;
      heightCm = (ft * 12 + inc) * 2.54;
    }
    if (!heightCm || heightCm < 50 || heightCm > 300) return null;
    const heightInches = heightCm / 2.54;
    const baseHeight = 60;
    const increment = heightInches - baseHeight;
    const robinson = gender === "male" ? 52 + 1.9 * increment : 49 + 1.7 * increment;
    const miller = gender === "male" ? 56.2 + 1.41 * increment : 53.1 + 1.36 * increment;
    const devine = gender === "male" ? 50 + 2.3 * increment : 45.5 + 2.3 * increment;
    const hamwi = gender === "male" ? 48 + 2.7 * increment : 45.5 + 2.2 * increment;
    const heightM = heightCm / 100;
    const minWeight = 18.5 * heightM * heightM;
    const maxWeight = 24.9 * heightM * heightM;
    const conv = unit === "metric" ? 1 : 2.20462;
    return { robinson: robinson * conv, miller: miller * conv, devine: devine * conv, hamwi: hamwi * conv, bmiMin: minWeight * conv, bmiMax: maxWeight * conv };
  };

  const results = calculateIdealWeights();
  const weightUnit = unit === "metric" ? "kg" : "lbs";

  const handleReset = () => { setUnit("metric"); setGender("male"); setHeight(""); setFeet(""); setInches(""); };

  return (
    <ToolLayout toolId="ideal-weight-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Inputs
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Units</h3>
            <div className="flex p-1 bg-muted rounded-xl">
              {["metric", "imperial"].map((u) => (
                <button key={u} onClick={() => setUnit(u as Unit)} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${unit === u ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{u.charAt(0).toUpperCase() + u.slice(1)}</button>
              ))}
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">How it Works</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">We use four different medically recognized formulas (Robinson, Miller, Devine, Hamwi) to give you a broad perspective on your ideal weight, alongside the standard WHO BMI range.</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Gender</label>
                <div className="flex p-1.5 bg-muted rounded-2xl">
                  {["male", "female"].map((g) => (
                    <button key={g} onClick={() => setGender(g as Gender)} className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${gender === g ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Users className="w-4 h-4" />{g}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Height</label>
                {unit === "metric" ? (
                  <div className="relative">
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full pl-6 pr-16 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-black text-foreground" placeholder="170" />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground uppercase tracking-widest pointer-events-none">cm</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative"><input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} className="w-full pl-6 pr-12 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-black text-foreground" placeholder="5" /><span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground uppercase tracking-widest pointer-events-none">ft</span></div>
                    <div className="relative"><input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className="w-full pl-6 pr-12 py-4 bg-muted border border-border rounded-2xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-xl font-black text-foreground" placeholder="7" /><span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground uppercase tracking-widest pointer-events-none">in</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {results ? (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary to-teal-600 rounded-[2.5rem] p-10 text-primary-foreground shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Activity className="w-40 h-40" /></div>
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-card/10 backdrop-blur-md rounded-full w-fit text-xs font-bold uppercase tracking-widest border border-white/5"><ShieldCheck className="w-3.5 h-3.5" /> Healthy Range</div>
                  <div>
                    <h2 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-2">Your Recommended Range</h2>
                    <div className="text-5xl sm:text-7xl font-black tracking-tight flex flex-wrap items-baseline gap-4">
                      <span className="tabular-nums">{results.bmiMin.toFixed(1)}</span><ArrowRight className="w-8 h-8 opacity-50" /><span className="tabular-nums">{results.bmiMax.toFixed(1)}</span><span className="text-2xl font-bold opacity-70 font-mono">{weightUnit}</span>
                    </div>
                  </div>
                  <p className="text-sm opacity-60 leading-relaxed max-w-lg font-medium">Maintaining a weight within this range is associated with lower risks of heart disease, diabetes, and other weight-related conditions.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "robinson", label: "Robinson Formula", value: results.robinson, desc: "Often used for general health assessments." },
                  { id: "miller", label: "Miller Formula", value: results.miller, desc: "A variation that focuses on lean body mass." },
                  { id: "devine", label: "Devine Formula", value: results.devine, desc: "A long-standing standard used in medical settings." },
                  { id: "hamwi", label: "Hamwi Formula", value: results.hamwi, desc: "One of the first formulas used for nutritional health." },
                ].map((f) => (
                  <div key={f.id} className="bg-card border border-border rounded-[2rem] p-6 shadow-sm flex items-start gap-5">
                    <div className="p-3.5 bg-teal-50 rounded-2xl shrink-0"><FlaskConical className="w-6 h-6 text-teal-600" /></div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{f.label}</p>
                      <div className="text-3xl font-black text-foreground">{Math.round(f.value)} <span className="text-sm font-bold text-muted-foreground">{weightUnit}</span></div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 border-2 border-dashed border-border rounded-[2.5rem]">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center"><Scale className="w-12 h-12 text-muted-foreground" /></div>
              <div className="space-y-2 max-w-sm"><h3 className="text-xl font-bold text-foreground">Ready to Calculate</h3><p className="text-muted-foreground text-sm font-medium">Select your gender and input your height to view your recommended healthy weight.</p></div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><Info className="w-5 h-5 text-primary" />What is Ideal Weight?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Ideal Body Weight (IBW) formulas are used primarily in medical settings to estimate healthy mass and determine correct medication dosages.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-emerald-500" />A Note on Variance</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">These formulas are general benchmarks. They do not account for muscle mass, bone density, or individual body composition.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
