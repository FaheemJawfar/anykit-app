"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Weight, Activity, Target, Flame, Zap, Leaf, Dumbbell, Users, Timer, TrendingUp, TrendingDown, Ruler, Calendar, Utensils, RotateCcw } from "lucide-react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Goal = "lose" | "maintain" | "gain";
type Unit = "metric" | "imperial";

export default function CalorieCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [feet, setFeet] = useState<string>("");
  const [inches, setInches] = useState<string>("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");
  const [isCalculating, setIsCalculating] = useState(false);
  const [debouncedResults, setDebouncedResults] = useState<{ bmr: number; tdee: number; target: number; description: string } | null>(null);

  const calculateBMR = (): number => {
    let w = 0, h = 0; const a = parseFloat(age);
    if (unit === "metric") { w = parseFloat(weight); h = parseFloat(height); }
    else { w = parseFloat(weight) * 0.453592; const ft = parseFloat(feet) || 0; const inc = parseFloat(inches) || 0; h = (ft * 12 + inc) * 2.54; }
    if (!w || !h || !a) return 0;
    return gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
  };

  useEffect(() => {
    const bmrValue = calculateBMR();
    if (bmrValue === 0) { setDebouncedResults(null); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const activityMultipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, "very-active": 1.9 };
      const tdeeValue = bmrValue * activityMultipliers[activityLevel];
      let targetValue = tdeeValue; let desc = "Maintain current weight";
      if (goal === "lose") { targetValue = tdeeValue - 500; desc = "500 calorie deficit"; }
      else if (goal === "gain") { targetValue = tdeeValue + 500; desc = "500 calorie surplus"; }
      setDebouncedResults({ bmr: bmrValue, tdee: tdeeValue, target: targetValue, description: desc });
      setIsCalculating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [age, weight, height, feet, inches, gender, activityLevel, goal, unit]);

  const getMacros = (cals: number) => ({ protein: { grams: Math.round((cals * 0.3) / 4), cal: Math.round(cals * 0.3), pct: 30 }, carbs: { grams: Math.round((cals * 0.4) / 4), cal: Math.round(cals * 0.4), pct: 40 }, fats: { grams: Math.round((cals * 0.3) / 9), cal: Math.round(cals * 0.3), pct: 30 } });
  const macros = debouncedResults ? getMacros(debouncedResults.target) : null;

  const handleReset = () => { setAge(""); setWeight(""); setHeight(""); setFeet(""); setInches(""); setActivityLevel("moderate"); setGoal("maintain"); setDebouncedResults(null); };

  const activityOptions = [
    { value: "sedentary", label: "Sedentary", desc: "Office job" },
    { value: "light", label: "Light", desc: "1-3 days/wk" },
    { value: "moderate", label: "Moderate", desc: "3-5 days/wk" },
    { value: "active", label: "Active", desc: "6-7 days/wk" },
    { value: "very-active", label: "Very Active", desc: "Physical job" }
  ];

  return (
    <ToolLayout toolId="calorie-calculator">
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
              <button onClick={() => setUnit("metric")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${unit === "metric" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Metric</button>
              <button onClick={() => setUnit("imperial")} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${unit === "imperial" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>Imperial</button>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Formula</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">We use the <strong>Mifflin-St Jeor</strong> equation, widely considered the most accurate formula for calculating energy needs in healthy adults.</p>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="mb-8">
              <div className="flex p-1.5 bg-muted rounded-2xl">
                {["male", "female"].map((g) => (
                  <button key={g} onClick={() => setGender(g as Gender)} className={`flex-1 py-3 text-sm font-bold uppercase tracking-wide rounded-xl transition-all flex items-center justify-center gap-2 ${gender === g ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><Users className="w-4 h-4" />{g}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Age</label>
                <div className="relative"><input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-foreground" /><Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" /></div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                <div className="relative"><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={unit === "metric" ? "70" : "154"} className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-foreground" /><Weight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" /></div>
              </div>
              {unit === "metric" ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Height (cm)</label>
                  <div className="relative"><input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="175" className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-foreground" /><Ruler className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" /></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Feet</label><input type="number" value={feet} onChange={(e) => setFeet(e.target.value)} placeholder="5" className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-foreground" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Inches</label><input type="number" value={inches} onChange={(e) => setInches(e.target.value)} placeholder="9" className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-foreground" /></div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Activity Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {activityOptions.map((opt) => (
                    <button key={opt.value} onClick={() => setActivityLevel(opt.value as ActivityLevel)} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${activityLevel === opt.value ? "bg-primary/5 border-primary text-primary" : "bg-card border-border text-muted-foreground hover:bg-accent"}`}><span className="text-sm font-bold">{opt.label}</span><span className="text-[10px] font-semibold opacity-70">{opt.desc}</span></button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Goal</label>
                <div className="grid grid-cols-1 gap-2">
                  {[{ id: "lose", label: "Lose Weight", icon: <TrendingDown className="w-4 h-4" />, activeClass: "bg-emerald-500 text-primary-foreground border-emerald-500 shadow-lg shadow-emerald-500/20" }, { id: "maintain", label: "Maintain Weight", icon: <Activity className="w-4 h-4" />, activeClass: "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" }, { id: "gain", label: "Gain Weight", icon: <TrendingUp className="w-4 h-4" />, activeClass: "bg-indigo-500 text-primary-foreground border-indigo-500 shadow-lg shadow-indigo-500/20" }].map((g) => (
                    <button key={g.id} onClick={() => setGoal(g.id as Goal)} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all ${goal === g.id ? g.activeClass : "bg-card border-border text-muted-foreground hover:bg-accent"}`}>{g.icon}<span className="text-sm font-bold">{g.label}</span></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {debouncedResults && (
            <div className="space-y-6">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-200 ${isCalculating ? "opacity-50" : "opacity-100"}`}>
                <div className="bg-card border border-border rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-16 -mt-32 blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div><p className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-1">Daily Target</p><h3 className="text-xl font-bold text-foreground">{debouncedResults.description}</h3></div>
                      <div className="p-3 bg-orange-50 rounded-2xl border border-orange-100"><Target className="w-6 h-6 text-orange-600" /></div>
                    </div>
                    <div><span className="text-5xl lg:text-7xl font-black tracking-tight text-foreground">{Math.round(debouncedResults.target)}</span><span className="ml-2 text-xl font-bold text-muted-foreground">kcal</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-card border border-border rounded-[2.5rem] p-6 lg:p-8 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Maintenance (TDEE)</p><h4 className="text-3xl font-black text-foreground">{Math.round(debouncedResults.tdee)} <span className="text-base text-muted-foreground font-bold">kcal</span></h4></div>
                    <div className="p-3 bg-muted rounded-2xl"><Activity className="w-6 h-6 text-muted-foreground" /></div>
                  </div>
                  <div className="bg-card border border-border rounded-[2.5rem] p-6 lg:p-8 flex items-center justify-between">
                    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Basal Rate (BMR)</p><h4 className="text-3xl font-black text-foreground">{Math.round(debouncedResults.bmr)} <span className="text-base text-muted-foreground font-bold">kcal</span></h4></div>
                    <div className="p-3 bg-muted rounded-2xl"><Zap className="w-6 h-6 text-muted-foreground" /></div>
                  </div>
                </div>
              </div>
              {macros && (
                <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="px-8 py-6 bg-muted border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-foreground flex items-center gap-2"><Utensils className="w-5 h-5 text-primary" />Daily Nutrition</h3>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Balanced Diet</span>
                  </div>
                  <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-20 h-20 rounded-full border-[6px] border-border flex items-center justify-center text-xl font-black text-primary">{macros.protein.pct}%</div>
                        <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protein</p><p className="text-3xl font-black text-foreground">{macros.protein.grams}g</p><p className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full mt-1 inline-block">{macros.protein.cal} kcal</p></div>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-20 h-20 rounded-full border-[6px] border-emerald-100 flex items-center justify-center text-xl font-black text-emerald-600">{macros.carbs.pct}%</div>
                        <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Carbs</p><p className="text-3xl font-black text-foreground">{macros.carbs.grams}g</p><p className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full mt-1 inline-block">{macros.carbs.cal} kcal</p></div>
                      </div>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-20 h-20 rounded-full border-[6px] border-orange-100 flex items-center justify-center text-xl font-black text-orange-600">{macros.fats.pct}%</div>
                        <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Fats</p><p className="text-3xl font-black text-foreground">{macros.fats.grams}g</p><p className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full mt-1 inline-block">{macros.fats.cal} kcal</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
