"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Pipette, Upload, Trash2, Image as ImageIcon } from "lucide-react";

interface ExtractedColor { hex: string; rgb: { r: number; g: number; b: number }; }

export default function ColorExtractor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const rgbToHex = (r: number, g: number, b: number) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string; setUploadedImage(src); setExtractedColors([]);
      const img = new Image();
      img.onload = () => { const canvas = canvasRef.current; if (!canvas) return; canvas.width = img.width; canvas.height = img.height; const ctx = canvas.getContext('2d'); if (ctx) ctx.drawImage(img, 0, 0); };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!eyedropperActive || !canvasRef.current || !imgRef.current) return;
    const img = imgRef.current; const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left; const y = e.clientY - rect.top;
    const scaleX = canvasRef.current.width / img.width; const scaleY = canvasRef.current.height / img.height;
    const ctx = canvasRef.current.getContext('2d'); if (!ctx) return;
    const pixelData = ctx.getImageData(Math.floor(x * scaleX), Math.floor(y * scaleY), 1, 1).data;
    const hex = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
    if (!extractedColors.some(c => c.hex === hex)) setExtractedColors(prev => [...prev, { hex, rgb: { r: pixelData[0], g: pixelData[1], b: pixelData[2] } }]);
  };

  const clear = () => { setUploadedImage(null); setExtractedColors([]); };

  return (
    <ToolLayout toolId="color-extractor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={() => setEyedropperActive(!eyedropperActive)} disabled={!uploadedImage} className={`w-full h-12 shadow-lg font-bold uppercase tracking-widest text-xs rounded-xl ${eyedropperActive ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary/90'} text-primary-foreground`}><Pipette className="w-5 h-5 mr-2" />{eyedropperActive ? "Eyedropper On" : "Eyedropper"}</Button>
            <Button onClick={clear} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
          {extractedColors.length > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Palette ({extractedColors.length})</h3>
              <div className="grid grid-cols-4 gap-2">{extractedColors.map((c, i) => (<div key={i} className="aspect-square rounded-xl border border-border cursor-pointer" style={{ backgroundColor: c.hex }} title={c.hex} />))}</div>
            </div>
          )}
        </div>
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8">
            <h3 className="text-lg font-black text-foreground mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-primary" /></div>Upload Image</h3>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <p className="text-muted-foreground font-medium">Click to upload an image</p>
            </div>
            {uploadedImage && (
              <div className="mt-6 relative">
                <img ref={imgRef} src={uploadedImage} alt="Upload" onClick={handleImageClick} className={`w-full rounded-xl border border-border ${eyedropperActive ? 'cursor-crosshair' : 'cursor-default'}`} />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
