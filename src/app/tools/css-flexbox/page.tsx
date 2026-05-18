"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Columns, 
  Copy, 
  Check, 
  Trash2, 
  Settings2, 
  Zap, 
  Info,
  Code,
  Layout,
  ArrowRight,
  ArrowDown,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  GripVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CSSFlexboxGenerator() {
  const [config, setConfig] = useState({
    direction: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    itemCount: 4
  });
  const [copied, setCopied] = useState(false);

  const items = Array.from({ length: config.itemCount });

  const cssCode = `.flex-container {
  display: flex;
  flex-direction: ${config.direction};
  justify-content: ${config.justifyContent};
  align-items: ${config.alignItems};
  flex-wrap: ${config.flexWrap};
  gap: ${config.gap}px;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const OptionGroup = ({ label, value, options, onChange }: { label: string, value: string, options: { id: string, label: string, icon?: any }[], onChange: (v: string) => void }) => (
    <div className="space-y-3">
      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {options.map((opt) => (
          <Button
            key={opt.id}
            variant={value === opt.id ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(opt.id)}
            className={cn(
              "h-10 rounded-xl font-bold text-[9px] uppercase transition-all",
              value === opt.id ? "shadow-lg shadow-primary/20" : "border-border/40 hover:bg-primary/5"
            )}
          >
            {opt.icon && <opt.icon className="w-3 h-3 mr-2" />}
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Layout className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">CSS Flexbox Generator</h1>
          <p className="text-sm text-muted-foreground">
            A visual playground for building and testing flexible layout containers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <OptionGroup 
                  label="Flex Direction" 
                  value={config.direction} 
                  onChange={(v) => setConfig({...config, direction: v})}
                  options={[
                    { id: "row", label: "Row", icon: ArrowRight },
                    { id: "column", label: "Column", icon: ArrowDown },
                    { id: "row-reverse", label: "Row Rev", icon: ArrowRight },
                    { id: "column-reverse", label: "Col Rev", icon: ArrowDown }
                  ]}
                />

                <OptionGroup 
                  label="Justify Content" 
                  value={config.justifyContent} 
                  onChange={(v) => setConfig({...config, justifyContent: v})}
                  options={[
                    { id: "flex-start", label: "Start" },
                    { id: "center", label: "Center" },
                    { id: "flex-end", label: "End" },
                    { id: "space-between", label: "Between" },
                    { id: "space-around", label: "Around" },
                    { id: "space-evenly", label: "Evenly" }
                  ]}
                />

                <OptionGroup 
                  label="Align Items" 
                  value={config.alignItems} 
                  onChange={(v) => setConfig({...config, alignItems: v})}
                  options={[
                    { id: "flex-start", label: "Start" },
                    { id: "center", label: "Center" },
                    { id: "flex-end", label: "End" },
                    { id: "stretch", label: "Stretch" },
                    { id: "baseline", label: "Baseline" }
                  ]}
                />

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Gap Intensity</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.gap}px</span>
                  </div>
                  <Slider value={[config.gap]} min={0} max={64} step={1} onValueChange={([v]) => setConfig({...config, gap: v})} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Item Count</Label>
                    <span className="text-xs font-mono font-bold text-primary">{config.itemCount}</span>
                  </div>
                  <Slider value={[config.itemCount]} min={1} max={12} step={1} onValueChange={([v]) => setConfig({...config, itemCount: v})} />
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => setConfig({ direction: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 16, itemCount: 4 })}
                className="w-full h-12 rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Container
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col min-h-[450px] relative">
            <div className="absolute top-8 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-border/20">
                Visual Playground
              </div>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12 overflow-auto">
              <div 
                style={{
                  display: 'flex',
                  flexDirection: config.direction as any,
                  justifyContent: config.justifyContent,
                  alignItems: config.alignItems,
                  flexWrap: config.flexWrap as any,
                  gap: `${config.gap}px`,
                  width: '100%',
                  minHeight: '300px'
                }}
                className="bg-muted/30 rounded-3xl p-8 border border-border/20 shadow-inner"
              >
                {items.map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-primary/10 border border-primary/20 rounded-2xl flex flex-col items-center justify-center p-6 text-primary shadow-sm animate-in zoom-in-95 h-20 min-w-[80px]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <GripVertical className="w-4 h-4 mb-1 opacity-20" />
                    <span className="text-xs font-black">{i + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">CSS Flex Properties</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className={cn(
                  "rounded-xl font-bold px-4 hover:bg-primary/10 transition-all",
                  copied && "text-green-500 hover:text-green-500"
                )}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied" : "Copy Code"}
              </Button>
            </div>
            <CardContent className="p-0 flex-1 relative bg-primary/[0.01]">
              <pre className="p-8 font-mono text-[11px] leading-loose text-foreground/80 overflow-auto selection:bg-primary/20">
                {cssCode}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
