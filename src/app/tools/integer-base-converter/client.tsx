"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Hash, 
  Copy, 
  Check, 
  Trash2,
  RefreshCw,
  Zap,
  Binary,
  Calculator,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function IntegerBaseConverter() {
  const [values, setValues] = useState({
    decimal: "42",
    hex: "2a",
    binary: "101010",
    octal: "52"
  });
  const [copied, setCopied] = useState<string | null>(null);

  const updateValues = (val: string, base: number) => {
    if (!val) {
      setValues({ decimal: "", hex: "", binary: "", octal: "" });
      return;
    }

    try {
      const num = BigInt(`0${base === 16 ? 'x' : base === 2 ? 'b' : base === 8 ? 'o' : ''}${val}`);
      setValues({
        decimal: num.toString(10),
        hex: num.toString(16),
        binary: num.toString(2),
        octal: num.toString(8)
      });
    } catch (e) {
      // Keep the current input value but don't update others if invalid
      const key = base === 10 ? 'decimal' : base === 16 ? 'hex' : base === 2 ? 'binary' : 'octal';
      setValues(prev => ({ ...prev, [key]: val }));
    }
  };

  const copy = (val: string, id: string) => {
    navigator.clipboard.writeText(val);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setValues({ decimal: "", hex: "", binary: "", octal: "" });
  };

  const BaseInput = ({ label, value, base, id, icon: Icon }: { label: string, value: string, base: number, id: string, icon: any }) => (
    <div className="space-y-3 group">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label} (Base {base})</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => copy(value, id)}
          className="h-6 px-2 text-[10px] font-bold uppercase tracking-wider hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied === id ? <Check className="w-3 h-3 mr-1 text-green-500" /> : <Copy className="w-3 h-3 mr-1" />}
          {copied === id ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="relative">
        <Input 
          value={value}
          onChange={(e) => updateValues(e.target.value, base)}
          className="h-16 px-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-xl focus:ring-primary/20 transition-all"
          placeholder={`Enter ${label.toLowerCase()}...`}
        />
      </div>
    </div>
  );

  return (
    <ToolLayout toolId="integer-base-converter">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Converter Grid */}
        <div className="lg:col-span-8">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <BaseInput label="Decimal" value={values.decimal} base={10} id="decimal" icon={Calculator} />
              <BaseInput label="Hexadecimal" value={values.hex} base={16} id="hex" icon={Hash} />
              <BaseInput label="Binary" value={values.binary} base={2} id="binary" icon={Binary} />
              <BaseInput label="Octal" value={values.octal} base={8} id="octal" icon={RefreshCw} />
            </CardContent>
            <div className="px-8 py-4 bg-muted/30 border-t border-border/40 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <Zap className="w-3 h-3 text-primary" />
                Live Bidirectional Sync
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clear}
                className="h-8 rounded-xl font-bold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </Card>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Quick Reference</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border/40">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Prefixes</p>
                  <ul className="text-xs font-mono space-y-1">
                    <li>Hex: <span className="text-primary font-bold">0x</span> (0-9, a-f)</li>
                    <li>Binary: <span className="text-primary font-bold">0b</span> (0-1)</li>
                    <li>Octal: <span className="text-primary font-bold">0o</span> (0-7)</li>
                  </ul>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    This converter uses <strong>BigInt</strong> to handle extremely large integers without losing precision.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
