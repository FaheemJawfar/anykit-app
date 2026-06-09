"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Banknote, Users, Percent, RotateCcw, Receipt, DollarSign, Smile, Utensils, Coins } from "lucide-react";

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState<string>("");
  const [tipPercentage, setTipPercentage] = useState<string>("18");
  const [customTip, setCustomTip] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleTipSelect = (val: string) => { setTipPercentage(val); setCustomTip(""); };
  const handleCustomTipChange = (val: string) => { setCustomTip(val); setTipPercentage(""); };

  const handleReset = () => {
    setBillAmount(""); setTipPercentage("18"); setCustomTip(""); setNumberOfPeople(1); setResult(null);
  };

  useEffect(() => {
    if (!billAmount) { setResult(null); return; }
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const bill = parseFloat(billAmount);
      const tip = customTip ? parseFloat(customTip) : parseFloat(tipPercentage);
      const people = numberOfPeople;
      if (!isNaN(bill) && !isNaN(tip) && bill > 0 && people > 0) {
        const tipAmount = (bill * tip) / 100;
        const totalAmount = bill + tipAmount;
        setResult({ bill, tipPercent: tip, tipAmount, totalAmount, tipPerPerson: tipAmount / people, totalPerPerson: totalAmount / people, people });
      } else { setResult(null); }
      setIsCalculating(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [billAmount, tipPercentage, customTip, numberOfPeople]);

  return (
    <ToolLayout toolId="tip-calculator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleReset} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Calculator
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Tipping Tips</h3>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted border border-border">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0"><Smile className="w-4 h-4 text-emerald-600" /></div>
              <div><h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Standard Service</h4><p className="text-xs text-muted-foreground mt-1">15% - 20% is standard for good service in most US restaurants.</p></div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-muted border border-border">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0"><Utensils className="w-4 h-4 text-amber-600" /></div>
              <div><h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Large Groups</h4><p className="text-xs text-muted-foreground mt-1">Gratuity (usually 18%) is often included for groups of 6+.</p></div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-10 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100"><Banknote className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Total Bill</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">The amount on your receipt</p></div>
                </div>
                <div className="relative">
                  <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} placeholder="0.00" className="w-full pl-6 pr-12 py-5 bg-muted border border-border rounded-2xl text-2xl font-black text-foreground outline-none focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted-foreground" />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-bold"><DollarSign className="w-5 h-5" /></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-primary border border-border"><Users className="w-5 h-5" /></div>
                  <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Split</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">How many people?</p></div>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))} className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-accent active:scale-95 transition-all text-muted-foreground"><span className="text-2xl font-black">-</span></button>
                  <div className="flex-1 bg-muted border border-border h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-foreground">{numberOfPeople}</div>
                  <button onClick={() => setNumberOfPeople(numberOfPeople + 1)} className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center hover:bg-accent active:scale-95 transition-all text-muted-foreground"><span className="text-2xl font-black">+</span></button>
                </div>
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100"><Percent className="w-5 h-5" /></div>
                <div><h3 className="text-sm font-black text-foreground uppercase tracking-tight">Add a Tip</h3><p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Choose a percentage</p></div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {["5", "10", "15", "18", "20"].map((tip) => (
                  <button key={tip} onClick={() => handleTipSelect(tip)} className={`py-4 rounded-xl font-black text-sm transition-all border ${tipPercentage === tip && !customTip ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105" : "bg-card text-muted-foreground border-border hover:border-border hover:bg-accent"}`}>{tip}%</button>
                ))}
                <div className="relative col-span-1">
                  <input type="number" value={customTip} onChange={(e) => handleCustomTipChange(e.target.value)} placeholder="Custom" className={`w-full h-full min-h-[56px] px-2 text-center bg-card border rounded-xl font-black text-sm outline-none transition-all placeholder:font-medium placeholder:text-muted-foreground ${customTip ? "border-primary ring-2 ring-primary/10 text-primary" : "border-border focus:border-primary focus:ring-2 focus:ring-primary/5 text-muted-foreground"}`} />
                </div>
              </div>
            </div>
          </div>

          {isCalculating ? (
            <div className="bg-card rounded-[2.5rem] border border-border p-16 text-center shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin"></div>
                <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Calculating...</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-[2.5rem] p-8 relative overflow-hidden shadow-sm">
                  <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                    <div className="flex items-start justify-between">
                      <div><p className="text-black font-bold text-xs uppercase tracking-widest mb-1">Each Person Pays</p><h3 className="text-xl font-bold text-foreground flex items-center gap-2"><Users className="w-4 h-4 text-primary" />{result.people > 1 ? `Split between ${result.people}` : "Individual Total"}</h3></div>
                      <div className="p-3 bg-muted rounded-2xl border border-border"><Receipt className="w-6 h-6 text-primary" /></div>
                    </div>
                    <span className="text-5xl lg:text-6xl font-black tracking-tight text-foreground">${result.totalPerPerson.toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-[2.5rem] p-8 overflow-hidden shadow-sm">
                  <div className="flex flex-col h-full justify-between gap-8">
                    <div className="flex items-start justify-between">
                      <div><p className="text-black font-bold text-xs uppercase tracking-widest mb-1">The Tip</p><h3 className="text-xl font-bold text-foreground">@ {result.tipPercent}%</h3></div>
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100"><Coins className="w-6 h-6 text-emerald-600" /></div>
                    </div>
                    <span className="text-5xl lg:text-6xl font-black tracking-tight text-foreground">${result.tipAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border rounded-3xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center divide-x divide-border">
                  <div><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Subtotal</p><p className="text-xl font-black text-foreground">${result.bill.toFixed(2)}</p></div>
                  <div><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Total Tip</p><p className="text-xl font-black text-emerald-600">+${result.tipAmount.toFixed(2)}</p></div>
                  <div><p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Final Total</p><p className="text-xl font-black text-indigo-600">${result.totalAmount.toFixed(2)}</p></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 bg-muted rounded-[2rem] flex items-center justify-center mb-6"><Receipt className="w-10 h-10 text-muted-foreground" /></div>
              <p className="text-muted-foreground font-medium">Enter bill details to see breakdown</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
