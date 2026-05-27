"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Barcode, 
  Copy, 
  Check, 
  Zap,
  Download,
  Type,
  Settings2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import JsBarcode from "jsbarcode";

const FORMATS = [
  { value: "CODE128", label: "Code 128 (Universal)" },
  { value: "EAN13", label: "EAN-13 (Retail)" },
  { value: "EAN8", label: "EAN-8 (Small Retail)" },
  { value: "UPC", label: "UPC (North America)" },
  { value: "CODE39", label: "Code 39 (Industrial)" },
  { value: "ITF14", label: "ITF-14 (Shipping)" },
  { value: "MSI", label: "MSI (Inventory)" },
  { value: "pharmacode", label: "Pharmacode" },
];

export default function BarcodeStudio() {
  const [value, setValue] = useState("ANYKIT-2026");
  const [format, setFormat] = useState("CODE128");
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(80);
  const [showText, setShowText] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !value.trim()) return;
    setError(null);
    try {
      JsBarcode(svgRef.current, value, {
        format,
        width,
        height,
        displayValue: showText,
        fontSize: 14,
        lineColor: "#000",
        background: "#fff",
        margin: 10,
      });
    } catch (e: any) {
      setError(e.message || "Invalid barcode data for selected format.");
    }
  }, [value, format, width, height, showText]);

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `barcode-${value}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout toolId="barcode-studio">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Config Side */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Data Value</Label>
                <div className="relative">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                  <Input 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter barcode data..."
                    className="h-14 pl-12 pr-6 rounded-2xl bg-muted/30 border-border/40 font-mono text-sm font-bold focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Format</Label>
                <div className="grid grid-cols-1 gap-2">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border text-left transition-all text-xs font-bold",
                        format === f.value
                          ? "bg-primary/5 border-primary/20 text-primary"
                          : "bg-muted/10 border-border/10 text-muted-foreground hover:bg-muted/20"
                      )}
                    >
                      {f.label}
                      {format === f.value && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Width</Label>
                  <Input 
                    type="number"
                    min={1}
                    max={4}
                    value={width}
                    onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-center"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Height</Label>
                  <Input 
                    type="number"
                    min={30}
                    max={150}
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value) || 80)}
                    className="h-12 rounded-xl bg-muted/30 border-border/40 font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/10">
                <span className="text-xs font-bold">Show Label Text</span>
                <button
                  onClick={() => setShowText(!showText)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    showText ? "bg-primary" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow-sm",
                    showText ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="lg:col-span-7">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-8 py-6 border-b border-border/40 bg-primary/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Preview</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadSVG}
                disabled={!!error || !value}
                className="rounded-xl font-bold px-4 hover:bg-primary/10 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download SVG
              </Button>
            </div>
            <CardContent className="p-12 flex-1 flex items-center justify-center bg-white">
              <div className="w-full max-w-md">
                <svg ref={svgRef} className="w-full h-auto" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
