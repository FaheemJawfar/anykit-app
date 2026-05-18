"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Ruler, 
  Weight, 
  Thermometer, 
  Database, 
  ArrowRightLeft, 
  Copy, 
  Check,
  Zap,
  Info,
  Scale
} from "lucide-react";
import { cn } from "@/lib/utils";

const conversions = {
  length: {
    label: "Length",
    icon: Ruler,
    base: "m",
    units: {
      m: { name: "Meters", factor: 1 },
      km: { name: "Kilometers", factor: 1000 },
      cm: { name: "Centimeters", factor: 0.01 },
      mm: { name: "Millimeters", factor: 0.001 },
      mi: { name: "Miles", factor: 1609.344 },
      yd: { name: "Yards", factor: 0.9144 },
      ft: { name: "Feet", factor: 0.3048 },
      in: { name: "Inches", factor: 0.0254 },
    },
  },
  weight: {
    label: "Weight",
    icon: Scale,
    base: "kg",
    units: {
      kg: { name: "Kilograms", factor: 1 },
      g: { name: "Grams", factor: 0.001 },
      mg: { name: "Milligrams", factor: 0.000001 },
      lb: { name: "Pounds", factor: 0.453592 },
      oz: { name: "Ounces", factor: 0.0283495 },
    },
  },
  temperature: {
    label: "Temperature",
    icon: Thermometer,
    base: "c",
    units: {
      c: { name: "Celsius", factor: 1 },
      f: { name: "Fahrenheit", factor: 1 },
      k: { name: "Kelvin", factor: 1 },
    },
  },
  data: {
    label: "Digital Data",
    icon: Database,
    base: "b",
    units: {
      b: { name: "Bytes", factor: 1 },
      kb: { name: "Kilobytes", factor: 1024 },
      mb: { name: "Megabytes", factor: 1048576 },
      gb: { name: "Gigabytes", factor: 1073741824 },
      tb: { name: "Terabytes", factor: 1099511627776 },
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof conversions>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");
  const [copied, setCopied] = useState<string | null>(null);

  const units = conversions[category].units;

  const performConversion = (val: string, from: string, to: string): string => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";

    if (category === "temperature") {
      if (from === to) return val;
      let celsius: number;
      if (from === "c") celsius = num;
      else if (from === "f") celsius = (num - 32) * (5 / 9);
      else celsius = num - 273.15;
      
      if (to === "c") return celsius.toFixed(4);
      else if (to === "f") return ((celsius * 9 / 5) + 32).toFixed(4);
      else return (celsius + 273.15).toFixed(4);
    }

    const fromFactor = (units as any)[from].factor;
    const toFactor = (units as any)[to].factor;
    const baseValue = num * fromFactor;
    const result = baseValue / toFactor;
    
    return result.toString().includes('.') ? result.toFixed(6).replace(/\.?0+$/, '') : result.toString();
  };

  const currentResult = performConversion(value, fromUnit, toUnit);

  const allConversions = useMemo(() => {
    return Object.entries(units).map(([key, unit]) => ({
      key,
      name: unit.name,
      value: performConversion(value, fromUnit, key)
    }));
  }, [value, fromUnit, units, category]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Ruler className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Unit Converter</h1>
          <p className="text-sm text-muted-foreground">
            Switch between different units for length, weight, temperature, and more.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 p-1.5 bg-muted/50 rounded-2xl border border-border/50 w-fit">
        {(Object.entries(conversions) as [keyof typeof conversions, any][]).map(([key, data]) => (
          <Button
            key={key}
            variant={category === key ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setCategory(key);
              const unitKeys = Object.keys(data.units);
              setFromUnit(unitKeys[0]);
              setToUnit(unitKeys[1]);
            }}
            className={cn(
              "rounded-xl font-bold px-6",
              category === key && "shadow-lg shadow-primary/20"
            )}
          >
            <data.icon className="w-4 h-4 mr-2" />
            {data.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">From</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number" value={value} onChange={(e) => setValue(e.target.value)}
                    className="h-16 px-6 rounded-2xl bg-muted/30 border-transparent focus:border-primary/20 text-2xl font-mono flex-1" 
                  />
                  <select 
                    value={fromUnit} onChange={(e) => setFromUnit(e.target.value)}
                    className="h-16 px-4 rounded-2xl bg-muted/50 border border-border/40 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {Object.entries(units).map(([key, unit]) => (
                      <option key={key} value={key}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/40" />
                </div>
                <Button 
                  variant="outline" size="icon" onClick={swapUnits}
                  className="relative w-10 h-10 rounded-full bg-background border-border/40 text-muted-foreground z-10 shadow-sm hover:text-primary hover:border-primary/20 transition-all"
                >
                  <ArrowRightLeft className="w-4 h-4 rotate-90" />
                </Button>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">To</Label>
                <div className="flex gap-2">
                  <div className="h-16 px-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center flex-1">
                    <span className="text-2xl font-mono font-bold text-primary truncate">{currentResult || "0"}</span>
                  </div>
                  <select 
                    value={toUnit} onChange={(e) => setToUnit(e.target.value)}
                    className="h-16 px-4 rounded-2xl bg-muted/50 border border-border/40 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {Object.entries(units).map(([key, unit]) => (
                      <option key={key} value={key}>{unit.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button 
                onClick={() => copy(currentResult, 'main')} disabled={!currentResult}
                className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {copied === 'main' ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                {copied === 'main' ? "Result Copied!" : "Copy Result"}
              </Button>
            </CardContent>
          </Card>

          <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Quick Tip</h3>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Calculations are performed instantly using precise conversion factors. Results are rounded to 6 decimal places for maximum accuracy.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-[2.5rem] overflow-hidden min-h-[500px]">
            <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Quick Conversion Grid</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                All {category} units
              </div>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allConversions.map((conv) => (
                  <div 
                    key={conv.key}
                    className="p-4 rounded-2xl bg-muted/20 border border-border/20 hover:border-primary/20 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground/60">{conv.name}</p>
                      <Button 
                        variant="ghost" size="icon" className="h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copy(conv.value, conv.key)}
                      >
                        {copied === conv.key ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <p className="text-lg font-mono font-bold truncate pr-8">{conv.value || "0"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

