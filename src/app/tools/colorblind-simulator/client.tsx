"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Eye, Upload, Trash2, Image as ImageIcon } from "lucide-react";

type ColorblindType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const matrices: Record<ColorblindType, number[]> = {
  protanopia: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  tritanopia: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={simulate} disabled={!uploadedImage} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Eye className="w-5 h-5 mr-2" /> Simulate</Button>
            <Button onClick={clear} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Vision Type</h3>
            <div className="space-y-2">
              {(["protanopia", "deuteranopia", "tritanopia", "achromatopsia"] as ColorblindType[]).map((t) => (
                <button key={t} onClick={() => setActiveType(t)} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeType === t ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-foreground hover:bg-primary/5 hover:border-primary/30 border border-border"}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-primary" /></div>Upload Image</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <p className="text-muted-foreground font-medium">Click to upload an image</p>
            </div>
            <canvas ref={canvasRef} className="hidden" />
            {uploadedImage && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="text-sm font-black text-muted-foreground mb-2">Original</p><img src={uploadedImage} alt="Original" className="w-full rounded-xl border border-border" /></div>
                {simulatedImage && (<div><p className="text-sm font-black text-muted-foreground mb-2">{activeType}</p><img src={simulatedImage} alt="Simulated" className="w-full rounded-xl border border-border" /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
