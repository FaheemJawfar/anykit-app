"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  LayoutGrid, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  Settings2, 
  Zap, 
  Info,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CSSGridGenerator() {
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [columnGap, setColumnGap] = useState(10);
  const [rowGap, setRowGap] = useState(10);
  const [copied, setCopied] = useState(false);

  const gridItems = Array.from({ length: columns * rows });

  const cssCode = `.grid-container {
  display: grid;
  grid-template-columns: repeat(${columns}, 1fr);
  grid-template-rows: repeat(${rows}, 1fr);
  grid-column-gap: ${columnGap}px;
  grid-row-gap: ${rowGap}px;
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout toolId="css-grid">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Grid Structure</span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Columns</Label>
                    <span className="text-xs font-mono font-bold text-primary">{columns}</span>
                  </div>
                  <Slider value={[columns]} min={1} max={12} step={1} onValueChange={([v]) => setColumns(v)} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Rows</Label>
                    <span className="text-xs font-mono font-bold text-primary">{rows}</span>
                  </div>
                  <Slider value={[rows]} min={1} max={12} step={1} onValueChange={([v]) => setRows(v)} />
                </div>

                <div className="space-y-4 pt-4 border-t border-border/40">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Column Gap (px)</Label>
                    <span className="text-xs font-mono font-bold text-primary">{columnGap}px</span>
                  </div>
                  <Slider value={[columnGap]} min={0} max={50} step={1} onValueChange={([v]) => setColumnGap(v)} />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Row Gap (px)</Label>
                    <span className="text-xs font-mono font-bold text-primary">{rowGap}px</span>
                  </div>
                  <Slider value={[rowGap]} min={0} max={50} step={1} onValueChange={([v]) => setRowGap(v)} />
                </div>
              </div>

              <Button 
                variant="ghost" 
                onClick={() => { setColumns(3); setRows(3); setColumnGap(10); setRowGap(10); }}
                className="w-full h-12 rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Reset Grid
              </Button>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Grid Fact</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              CSS Grid is the most powerful layout system available in CSS. It handles both columns and rows, unlike Flexbox which is largely one-dimensional.
            </p>
          </div>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col min-h-[450px] relative">
            <div className="absolute top-8 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-border/20">
                Visual Preview
              </div>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12 overflow-auto">
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`,
                  columnGap: `${columnGap}px`,
                  rowGap: `${rowGap}px`,
                  width: '100%',
                  minHeight: '300px'
                }}
                className="bg-muted/30 rounded-xl p-4 border border-border/20 shadow-inner"
              >
                {gridItems.map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-[10px] font-bold text-primary min-h-[50px] animate-in zoom-in-95"
                    style={{ animationDelay: `${i * 10}ms` }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">CSS Code</span>
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
    </ToolLayout>
  );
}
