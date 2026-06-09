"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Divide, Plus, Minus, X, Equal, RotateCcw, Info, HelpCircle, Target, CheckCircle2, Lightbulb, Calculator, Binary } from "lucide-react";

type Operation = "add" | "subtract" | "multiply" | "divide";

export default function FractionCalculator() {
  const [num1, setNum1] = useState<string>("");
  const [den1, setDen1] = useState<string>("");
  const [num2, setNum2] = useState<string>("");
  const [den2, setDen2] = useState<string>("");
  const [operation, setOperation] = useState<Operation>("add");

  const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

  const simplify = (numerator: number, denominator: number) => {
    const divisor = gcd(numerator, denominator);
    return { num: numerator / divisor, den: denominator / divisor, divisor };
  };

  const calculate = () => {
    if (!num1 || !den1 || !num2 || !den2) return null;
    const n1 = parseInt(num1), d1 = parseInt(den1), n2 = parseInt(num2), d2 = parseInt(den2);
    if (isNaN(n1) || isNaN(d1) || isNaN(n2) || isNaN(d2)) return null;
    if (d1 === 0 || d2 === 0) return null;
    let resultNum = 0, resultDen = 1;
    switch (operation) {
      case "add": resultNum = n1 * d2 + n2 * d1; resultDen = d1 * d2; break;
      case "subtract": resultNum = n1 * d2 - n2 * d1; resultDen = d1 * d2; break;
      case "multiply": resultNum = n1 * n2; resultDen = d1 * d2; break;
      case "divide": resultNum = n1 * d2; resultDen = d1 * n2; break;
    }
    if (resultDen === 0) return null;
    const simplified = simplify(resultNum, resultDen);
    return { simplified, decimal: simplified.num / simplified.den, original: { num: resultNum, den: resultDen } };
  };

  const result = calculate();

  const handleReset = () => { setNum1(""); setDen1(""); setNum2(""); setDen2(""); setOperation("add"); };

  const operations = [
    { id: "add", label: "Add", icon: <Plus className="w-5 h-5" />, activeClass: "bg-emerald-500 text-primary-foreground shadow-lg shadow-emerald-500/20" },
    { id: "subtract", label: "Subtract", icon: <Minus className="w-5 h-5" />, activeClass: "bg-red-500 text-primary-foreground shadow-lg shadow-red-500/20" },
    { id: "multiply", label: "Multiply", icon: <X className="w-5 h-5" />, activeClass: "bg-primary text-primary-foreground shadow-lg shadow-primary/20" },
    { id: "divide", label: "Divide", icon: <Divide className="w-5 h-5" />, activeClass: "bg-purple-500 text-primary-foreground shadow-lg shadow-purple-500/20" },
  ];

  return (
    <ToolLayout toolId="fraction-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Calculator
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">How it Works</h3>
            <div className="flex gap-3 text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-xl border border-border">
              <Plus className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /><span>Multiply denominators for a common base in addition or subtraction.</span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground leading-relaxed bg-card p-3 rounded-xl border border-border">
              <Divide className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" /><span>Flip the second fraction to perform division.</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="flex justify-center mb-10">
              <div className="flex p-1.5 bg-muted rounded-2xl overflow-x-auto max-w-full">
                {operations.map((op) => (
                  <button key={op.id} onClick={() => setOperation(op.id as Operation)} className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${operation === op.id ? op.activeClass : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{op.icon}{op.label}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center gap-4">
                <input type="number" value={num1} onChange={(e) => setNum1(e.target.value)} placeholder="1" className="w-28 h-24 text-center text-5xl font-black bg-muted border-2 border-border rounded-3xl focus:border-primary focus:bg-card outline-none transition-all shadow-inner text-foreground placeholder:text-muted-foreground" />
                <div className="w-24 h-2 bg-muted rounded-full" />
                <input type="number" value={den1} onChange={(e) => setDen1(e.target.value)} placeholder="2" className="w-28 h-24 text-center text-5xl font-black bg-muted border-2 border-border rounded-3xl focus:border-primary focus:bg-card outline-none transition-all shadow-inner text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 border border-border text-muted-foreground shadow-sm text-3xl font-bold">
                  {operation === "add" && <Plus className="w-10 h-10" />}
                  {operation === "subtract" && <Minus className="w-10 h-10" />}
                  {operation === "multiply" && <X className="w-10 h-10" />}
                  {operation === "divide" && <Divide className="w-10 h-10" />}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <input type="number" value={num2} onChange={(e) => setNum2(e.target.value)} placeholder="1" className="w-28 h-24 text-center text-5xl font-black bg-muted border-2 border-border rounded-3xl focus:border-primary focus:bg-card outline-none transition-all shadow-inner text-foreground placeholder:text-muted-foreground" />
                <div className="w-24 h-2 bg-muted rounded-full" />
                <input type="number" value={den2} onChange={(e) => setDen2(e.target.value)} placeholder="3" className="w-28 h-24 text-center text-5xl font-black bg-muted border-2 border-border rounded-3xl focus:border-primary focus:bg-card outline-none transition-all shadow-inner text-foreground placeholder:text-muted-foreground" />
              </div>
              <div className="hidden xl:block"><Equal className="w-12 h-12 text-muted-foreground" /></div>
              {result ? (
                <div className="flex flex-col items-center gap-4 bg-primary p-8 rounded-[2.5rem] shadow-xl shadow-primary/30 min-w-[180px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><Target className="w-24 h-24 text-primary-foreground" /></div>
                  <span className="text-6xl font-black text-primary-foreground relative z-10">{result.simplified.num}</span>
                  <div className="w-full h-2 bg-card/30 rounded-full relative z-10" />
                  <span className="text-6xl font-black text-primary-foreground relative z-10">{result.simplified.den}</span>
                </div>
              ) : (
                <div className="w-40 h-64 bg-muted border-2 border-dashed border-border rounded-[2.5rem] flex items-center justify-center"><span className="text-muted-foreground font-bold text-xl opacity-50">?</span></div>
              )}
            </div>
          </div>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-50 rounded-2xl"><Binary className="w-6 h-6 text-indigo-500" /></div>
                  <h3 className="text-lg font-bold text-foreground">As a Decimal</h3>
                </div>
                <div className="text-5xl font-black text-foreground tracking-tight">{result.decimal.toLocaleString(undefined, { maximumFractionDigits: 6 })}</div>
                <p className="text-sm text-muted-foreground font-medium mt-2">Standard numerical representation</p>
              </div>
              <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-50 rounded-2xl"><Lightbulb className="w-6 h-6 text-amber-500" /></div>
                  <h3 className="text-lg font-bold text-foreground">The Math</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl border border-border">
                    <Calculator className="w-5 h-5 text-muted-foreground mt-1" />
                    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Unsimplified</p><p className="font-mono font-bold text-foreground text-lg">{result.original.num} / {result.original.den}</p></div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-muted rounded-2xl border border-border">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                    <div><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Simplified</p><p className="text-sm text-muted-foreground font-medium leading-relaxed">{result.original.num !== result.simplified.num ? <>Reduced by dividing both values by their GCD of <span className="font-bold text-foreground">{result.simplified.divisor}</span>.</> : "The fraction is already in its simplest form."}</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><Info className="w-5 h-5 text-primary" />How to Simplify</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">Divide both top and bottom by their largest common factor. This keeps the ratio the same while making the numbers smaller.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><HelpCircle className="w-5 h-5 text-purple-500" />Where to Use</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">Essential for recipes, woodworking, and early algebra where precise fraction models are preferred over decimals.</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-[2.5rem] shadow-sm space-y-4">
              <h3 className="font-bold text-foreground flex items-center gap-2"><Target className="w-5 h-5 text-emerald-500" />Precision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">Fractions represent exact ratios. 1/3 is perfectly precise, whereas 0.333... is always an approximation.</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
