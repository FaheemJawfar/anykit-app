"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Barcode as BarcodeIcon, Download, Settings, Palette } from "lucide-react";

export default function BarcodeGenerator() {
  const [content, setContent] = useState("");
  const [barcodeOptions, setBarcodeOptions] = useState({ width: 2, height: 100, format: "CODE128" as string, displayValue: true, margin: 10, fontSize: 20, lineColor: "#000000", background: "#ffffff" });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (content && canvasRef.current) {
      try {
        const JsBarcode = require("jsbarcode");
        JsBarcode(canvasRef.current, content, { ...barcodeOptions, renderer: "canvas" });
      } catch (e) { console.error("Barcode generation failed:", e); }
    }
  }, [content, barcodeOptions]);

  const handleDownload = () => {
    if (!content || !canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `barcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const lineColors = [{ value: "#000000" }, { value: "#1e40af" }, { value: "#b91c1c" }, { value: "#15803d" }, { value: "#6b21a8" }, { value: "#334155" }];
  const bgColors = [{ value: "#ffffff" }, { value: "#f8fafc" }, { value: "#f0f9ff" }, { value: "#fef2f2" }, { value: "#fff7ed" }, { value: "#f0fdf4" }];

  return (
    <ToolLayout toolId="barcode-generator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={handleDownload} disabled={!content} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Download className="w-5 h-5 mr-2" /> Download Barcode</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Barcode Options</h3>
            <div className="space-y-4">
              <div className="flex items-end gap-3">
                <div className="flex-1"><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Format</label>
                  <select value={barcodeOptions.format} onChange={(e) => setBarcodeOptions({ ...barcodeOptions, format: e.target.value })} className="w-full px-3 py-2.5 border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold bg-card">
                    <option value="CODE128">CODE128</option><option value="EAN13">EAN-13</option><option value="UPC">UPC</option><option value="CODE39">CODE39</option><option value="ITF14">ITF-14</option><option value="MSI">MSI</option><option value="pharmacode">Pharmacode</option>
                  </select>
                </div>
                <div className="h-[42px] flex items-center"><label className="flex items-center cursor-pointer gap-2 px-3 py-2 border border-border rounded-xl hover:bg-muted transition-colors"><input type="checkbox" checked={barcodeOptions.displayValue} onChange={(e) => setBarcodeOptions({ ...barcodeOptions, displayValue: e.target.checked })} className="w-4 h-4 text-primary rounded focus:ring-primary border-border" /><span className="text-xs font-bold text-foreground">Text</span></label></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2"><Settings className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-bold text-foreground">Dimensions</span></div>
                <div><label className="block text-xs font-bold text-foreground mb-1">Width: {barcodeOptions.width}</label><input type="range" min="1" max="4" step="0.1" value={barcodeOptions.width} onChange={(e) => setBarcodeOptions({ ...barcodeOptions, width: Number(e.target.value) })} className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" /></div>
                <div><label className="block text-xs font-bold text-foreground mb-1">Height: {barcodeOptions.height}px</label><input type="range" min="50" max="200" step="5" value={barcodeOptions.height} onChange={(e) => setBarcodeOptions({ ...barcodeOptions, height: Number(e.target.value) })} className="w-full h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary" /></div>
              </div>
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-2"><Palette className="w-4 h-4 text-muted-foreground" /><span className="text-sm font-bold text-foreground">Colors</span></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Line Color</label><div className="flex items-center gap-2"><div className="w-6 h-6 rounded border border-border shadow-sm" style={{ backgroundColor: barcodeOptions.lineColor }}></div><div className="flex-1 flex gap-1 flex-wrap">{lineColors.map((c) => (<button key={c.value} onClick={() => setBarcodeOptions({ ...barcodeOptions, lineColor: c.value })} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c.value }} />))}</div></div></div>
                <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Background</label><div className="flex items-center gap-2"><div className="w-6 h-6 rounded border border-border shadow-sm" style={{ backgroundColor: barcodeOptions.background }}></div><div className="flex-1 flex gap-1 flex-wrap">{bgColors.map((c) => (<button key={c.value} onClick={() => setBarcodeOptions({ ...barcodeOptions, background: c.value })} className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: c.value }} />))}</div></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <div className="bg-card rounded-2xl shadow-sm p-6 border border-border">
                <h2 className="text-lg font-black text-foreground mb-4">Content</h2>
                <div className="space-y-2">
                  <input type="text" className="w-full px-4 py-3 border border-border rounded-xl focus:border-primary focus:outline-none transition-all text-sm font-bold bg-card" placeholder="Enter text or numbers" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="lg:sticky lg:top-8 lg:h-fit">
              <div className="relative rounded-[3rem] overflow-hidden shadow-xl shadow-primary/10 min-h-[400px] bg-gradient-to-br from-primary to-blue-700">
                <div className="relative z-10 p-8 md:p-12 flex flex-col items-center justify-center text-center text-primary-foreground h-full min-h-[400px]">
                  {content ? (
                    <div className="bg-card p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-black/20 text-foreground w-full max-w-sm flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-6 w-full"><div className="p-2 bg-primary/10 rounded-full"><BarcodeIcon className="w-5 h-5 text-primary" /></div><span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Barcode Preview</span></div>
                      <div className="flex justify-center items-center overflow-hidden w-full bg-card rounded-lg p-4" style={{ backgroundColor: barcodeOptions.background }}>
                        <canvas ref={canvasRef} />
                      </div>
                      <div className="mt-6 w-full bg-muted rounded-xl py-3 px-4 text-xs font-medium text-muted-foreground flex items-center justify-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>Ready to scan</div>
                    </div>
                  ) : (
                    <div className="text-center text-primary-foreground/80">
                      <div className="w-24 h-24 bg-card/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20"><BarcodeIcon className="w-12 h-12 text-primary-foreground" /></div>
                      <h3 className="text-2xl font-black mb-2">Barcode Generator</h3>
                      <p className="text-primary-100 font-medium max-w-xs mx-auto">Enter content on the left to see your barcode appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
