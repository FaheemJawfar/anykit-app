"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  History, 
  Copy, 
  Check, 
  Trash2,
  ArrowRightLeft,
  Zap,
  Info,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RomanNumeralConverter() {
  const [number, setNumber] = useState("2026");
  const [roman, setRoman] = useState("MMXXVI");
  const [copied, setCopied] = useState<string | null>(null);

  const toRoman = (num: number): string => {
    const map: [number, string][] = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let result = "";
    for (const [val, symbol] of map) {
      while (num >= val) {
        result += symbol;
        num -= val;
      }
    }
    return result;
  };

  const fromRoman = (str: string): number => {
    const map: Record<string, number> = {
      M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1
    };
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      const current = map[str[i].toUpperCase()];
      const next = map[str[i + 1]?.toUpperCase()];
      if (next && current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }
    return result;
  };

  const handleNumberChange = (val: string) => {
    setNumber(val);
    const num = parseInt(val);
    if (!isNaN(num) && num > 0 && num < 4000) {
      setRoman(toRoman(num));
    } else {
      setRoman("");
    }
  };

  const handleRomanChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^MDCLXVI]/g, "");
    setRoman(clean);
    if (clean) {
      const num = fromRoman(clean);
      setNumber(num.toString());
    } else {
      setNumber("");
    }
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout toolId="roman-numeral-converter">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-12">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-12 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Arabic Integer</Label>
                  <div className="relative">
                    <Input 
                      type="number"
                      value={number}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      className="h-20 px-8 rounded-2xl bg-muted/30 border-border/40 font-bold text-4xl focus:ring-primary/20 text-center"
                      placeholder="e.g. 2026"
                      min="1"
                      max="3999"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copy(number, 'num')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === 'num' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-lg border border-primary/20">
                    <ArrowRightLeft className="w-6 h-6 rotate-90 lg:rotate-0" />
                  </div>
                </div>

                <div className="space-y-4 text-center">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Roman Numeral</Label>
                  <div className="relative group">
                    <Input 
                      value={roman}
                      onChange={(e) => handleRomanChange(e.target.value)}
                      className="h-20 px-8 rounded-2xl bg-primary/5 border-primary/20 font-serif font-bold text-4xl text-primary focus:ring-primary/20 text-center tracking-widest"
                      placeholder="e.g. MMXXVI"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => copy(roman, 'roman')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === 'roman' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Standard Notation (1 - 3999)</span>
                </div>
                <div className="flex gap-2">
                  {[10, 50, 100, 500, 1000].map((val) => (
                    <Button
                      key={val}
                      variant="outline"
                      size="sm"
                      onClick={() => handleNumberChange(val.toString())}
                      className="rounded-xl font-bold h-9 px-4 border-border/40 hover:bg-primary/5 hover:text-primary"
                    >
                      {val}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Symbol Meanings</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs font-mono">
              <div className="flex justify-between"><span>I</span> <span>1</span></div>
              <div className="flex justify-between"><span>V</span> <span>5</span></div>
              <div className="flex justify-between"><span>X</span> <span>10</span></div>
              <div className="flex justify-between"><span>L</span> <span>50</span></div>
              <div className="flex justify-between"><span>C</span> <span>100</span></div>
              <div className="flex justify-between"><span>D</span> <span>500</span></div>
              <div className="flex justify-between"><span>M</span> <span>1000</span></div>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-3xl bg-muted/30 border border-border/40 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner">
              <Info className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm">Historical Context</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Roman numerals were the standard numbering system in Ancient Rome and remained in use throughout Europe well into the Late Middle Ages. They use combinations of letters from the Latin alphabet to signify values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
