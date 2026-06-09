"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Dices, Copy, CheckCircle2, RefreshCw } from "lucide-react";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState<string>("1");
  const [max, setMax] = useState<string>("100");
  const [count, setCount] = useState<string>("1");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const generateNumbers = () => {
    const minNum = parseInt(min) || 0;
    const maxNum = parseInt(max) || 100;
    const numCount = parseInt(count) || 1;
    if (minNum >= maxNum) { alert("Minimum must be less than maximum"); return; }
    const range = maxNum - minNum + 1;
    if (!allowDuplicates && numCount > range) { alert(`Cannot generate ${numCount} unique numbers in range ${minNum}-${maxNum}`); return; }
    const generated: number[] = [];
    const used = new Set<number>();
    for (let i = 0; i < numCount; i++) {
      let num: number;
      if (allowDuplicates) { num = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; }
      else { do { num = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum; } while (used.has(num)); used.add(num); }
      generated.push(num);
    }
    setNumbers(generated);
  };

  const copyNumbers = () => { navigator.clipboard.writeText(numbers.join(", ")); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <ToolLayout toolId="random-number-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={generateNumbers} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl">
              <Dices className="w-5 h-5 mr-2" /> Generate Numbers
            </Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">From</label><input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">To</label><input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
              </div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">How many?</label><input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card" /></div>
              <label className="flex items-center cursor-pointer group gap-3">
                <input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} className="w-5 h-5 text-primary border-border rounded focus:ring-primary cursor-pointer" />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">Allow repeat numbers</span>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {numbers.length > 0 ? (
            <div className="bg-card rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="p-6 border-b border-border flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/50">
                <div><h3 className="text-xl font-black text-foreground">Results</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{numbers.length} numbers generated</p></div>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button onClick={copyNumbers} variant="outline" className="flex-1 md:flex-none font-bold uppercase tracking-widest text-xs">{copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}{copied ? "Copied!" : "Copy All"}</Button>
                  <Button onClick={() => setNumbers([])} variant="outline" className="flex-1 md:flex-none hover:bg-red-50 hover:text-red-500 font-bold uppercase tracking-widest text-xs"><RefreshCw className="w-4 h-4 mr-2" /> Clear</Button>
                </div>
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-4 justify-center">
                  {numbers.map((num, index) => (
                    <div key={index} className="flex items-center justify-center min-w-[5rem] h-20 px-4 bg-gradient-to-br from-primary to-blue-700 text-primary-foreground text-xl md:text-2xl font-black rounded-2xl shadow-lg border-4 border-white">{num}</div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 bg-card rounded-[3rem] border-2 border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4"><Dices className="w-8 h-8 text-primary" /></div>
              <h3 className="text-xl font-black text-foreground mb-2">Let&apos;s pick some numbers</h3>
              <p className="text-muted-foreground text-center max-w-sm">Set your range and count in the sidebar, then click generate to get your random numbers.</p>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
