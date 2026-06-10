"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Upload, Trash2, Image as ImageIcon, Zap, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type ColorblindType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const matrices: Record<ColorblindType, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
};

const typeLabels: Record<ColorblindType, string> = {
  protanopia: "Red-Blind (Protanopia)", deuteranopia: "Green-Blind (Deuteranopia)",
  tritanopia: "Blue-Blind (Tritanopia)", achromatopsia: "Monochromacy",
};

export default function ColorblindSimulator() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ColorblindType>("protanopia");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const src = ev.target?.result as string; setUploadedImage(src); setSimulatedImage(null); };
    reader.readAsDataURL(file);
  };

  const simulate = () => {
    if (!uploadedImage) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current; if (!canvas) return;
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data; const m = matrices[activeType];
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = r * m[0] + g * m[1] + b * m[2];
        data[i + 1] = r * m[3] + g * m[4] + b * m[5];
        data[i + 2] = r * m[6] + g * m[7] + b * m[8];
      }
      ctx.putImageData(imageData, 0, 0);
      setSimulatedImage(canvas.toDataURL('image/png'));
    };
    img.src = uploadedImage;
  };

  const clear = () => { setUploadedImage(null); setSimulatedImage(null); };

  return (
    <ToolLayout toolId="colorblind-simulator">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!uploadedImage ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload an image</p><p className="text-sm text-muted-foreground">Click or drag and drop to simulate color blindness</p></div>
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Browse Files</Button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3"><ImageIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original</span></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={clear}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <CardContent className="p-8 flex items-center justify-center min-h-[300px] bg-muted/10">
                  <div className="relative group"><img src={uploadedImage} alt="Original" className="max-w-full h-auto rounded-xl shadow-2xl" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                </CardContent>
              </Card>
              {simulatedImage && (
                <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><Eye className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{typeLabels[activeType]}</span></div>
                  <CardContent className="p-8 flex items-center justify-center min-h-[300px] bg-muted/10">
                    <div className="relative group"><img src={simulatedImage} alt="Simulated" className="max-w-full h-auto rounded-xl shadow-2xl" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                  </CardContent>
                </Card>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={simulate} disabled={!uploadedImage} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><Eye className="w-5 h-5 mr-2" /> Simulate</Button>
              <Button onClick={clear} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><EyeOff className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vision Type</span></div>
            <CardContent className="p-6 space-y-2">
              {(["protanopia", "deuteranopia", "tritanopia", "achromatopsia"] as ColorblindType[]).map((t) => (
                <button key={t} onClick={() => setActiveType(t)} className={cn("w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border", activeType === t ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-muted/30 text-foreground border-border hover:bg-muted/50")}>
                  <span className="capitalize">{t}</span><span className="block text-xs opacity-70 font-medium mt-0.5">{typeLabels[t]}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
