"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Crop as CropIcon, Download, Trash2, Image as ImageIcon, AlertTriangle } from "lucide-react";

export default function ImageCropper() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(null); setCroppedImage(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      const img = new Image();
      img.onload = () => { setOriginalDimensions({ width: img.width, height: img.height }); setCrop({ x: 0, y: 0, width: Math.min(100, img.width), height: Math.min(100, img.height) }); };
      img.src = src; setOriginalImage(src);
    };
    reader.readAsDataURL(file);
  };

  const doCrop = () => {
    if (!originalImage || !imgRef.current) return; setError(null);
    const img = imgRef.current;
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    const canvas = document.createElement('canvas');
    canvas.width = crop.width * scaleX; canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    ctx.drawImage(img, crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY, 0, 0, canvas.width, canvas.height);
    setCroppedImage(canvas.toDataURL('image/png'));
  };

  const download = () => { if (!croppedImage) return; const a = document.createElement('a'); a.href = croppedImage; a.download = 'cropped.png'; a.click(); };
  const clear = () => { setOriginalImage(null); setCroppedImage(null); setError(null); };

  return (
    <ToolLayout toolId="image-cropper">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={doCrop} disabled={!originalImage} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><CropIcon className="w-5 h-5 mr-2" /> Crop</Button>
            <Button onClick={download} disabled={!croppedImage} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download</Button>
            <Button onClick={clear} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Crop Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">X</label><input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Y</label><input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Width</label><input type="number" value={crop.width} onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
              <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Height</label><input type="number" value={crop.height} onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })} className="w-full px-3 py-2 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground" /></div>
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
            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
            {originalImage && (
              <div className="mt-6 space-y-6">
                <div><p className="text-sm font-black text-muted-foreground mb-2">Original</p><img ref={imgRef} src={originalImage} alt="Original" className="w-full rounded-xl border border-border" /></div>
                {croppedImage && (<div><p className="text-sm font-black text-muted-foreground mb-2">Cropped</p><img src={croppedImage} alt="Cropped" className="w-full rounded-xl border border-border" /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
