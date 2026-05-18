"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Thermometer, 
  Copy, 
  Check, 
  Trash2,
  Zap,
  Info,
  RefreshCw,
  ArrowRightLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TemperatureConverter() {
  const [celsius, setCelsius] = useState("0");
  const [fahrenheit, setFahrenheit] = useState("32");
  const [kelvin, setKelvin] = useState("273.15");
  const [copied, setCopied] = useState<string | null>(null);

  const updateFromCelsius = (val: string) => {
    setCelsius(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setFahrenheit(((num * 9) / 5 + 32).toFixed(2).replace(/\.00$/, ""));
      setKelvin((num + 273.15).toFixed(2).replace(/\.00$/, ""));
    } else {
      setFahrenheit("");
      setKelvin("");
    }
  };

  const updateFromFahrenheit = (val: string) => {
    setFahrenheit(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = ((num - 32) * 5) / 9;
      setCelsius(c.toFixed(2).replace(/\.00$/, ""));
      setKelvin((c + 273.15).toFixed(2).replace(/\.00$/, ""));
    } else {
      setCelsius("");
      setKelvin("");
    }
  };

  const updateFromKelvin = (val: string) => {
    setKelvin(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      const c = num - 273.15;
      setCelsius(c.toFixed(2).replace(/\.00$/, ""));
      setFahrenheit(((c * 9) / 5 + 32).toFixed(2).replace(/\.00$/, ""));
    } else {
      setCelsius("");
      setFahrenheit("");
    }
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setCelsius("");
    setFahrenheit("");
    setKelvin("");
  };

  const TempInput = ({ label, value, onChange, id, symbol }: { label: string, value: string, onChange: (v: string) => void, id: string, symbol: string }) => (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label} ({symbol})</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copy(value, id)}
          disabled={!value}
          className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied === id ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="relative">
        <Input 
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-2xl font-bold focus:ring-primary/20 transition-all text-center"
          placeholder="0"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-primary font-black text-xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
          {symbol}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Thermometer className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Temperature Converter</h1>
          <p className="text-sm text-muted-foreground">
            Instantly convert temperatures between Celsius, Fahrenheit, and Kelvin scales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TempInput label="Celsius" value={celsius} onChange={updateFromCelsius} id="c" symbol="°C" />
                <TempInput label="Fahrenheit" value={fahrenheit} onChange={updateFromFahrenheit} id="f" symbol="°F" />
                <TempInput label="Kelvin" value={kelvin} onChange={updateFromKelvin} id="k" symbol="K" />
              </div>

              <div className="pt-8 border-t border-border/40 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  <Zap className="w-3 h-3 text-primary" />
                  Real-time Bidirectional Conversion
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clear}
                  className="h-8 rounded-xl font-bold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Values
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border/40 bg-card/40 rounded-3xl overflow-hidden p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Conversion Formulas</h3>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between p-2 rounded-xl bg-muted/30">
                <span>C to F</span> <span>(°C × 9/5) + 32</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-muted/30">
                <span>F to C</span> <span>(°F − 32) × 5/9</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-muted/30">
                <span>C to K</span> <span>°C + 273.15</span>
              </div>
            </div>
          </Card>

          <Card className="border-border/40 bg-muted/30 rounded-3xl overflow-hidden p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-background flex items-center justify-center text-muted-foreground/30 shadow-inner shrink-0">
              <Thermometer className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm">Did you know?</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Absolute zero is <strong>0 Kelvin</strong> (−273.15 °C or −459.67 °F). It is the lowest possible temperature where nothing could be colder and no heat energy remains in a substance.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
