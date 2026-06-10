"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crop as CropIcon, Download, Trash2, Image as ImageIcon, Upload, AlertCircle, Settings2, Maximize2, Layers } from "lucide-react";

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!originalImage ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload an image</p><p className="text-sm text-muted-foreground">Click or drag and drop to start cropping</p></div>
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
                <CardContent className="p-8 flex items-center justify-center min-h-[400px] bg-muted/10">
                  <div className="relative group"><img ref={imgRef} src={originalImage} alt="Original" className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                </CardContent>
              </Card>
              {croppedImage && (
                <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><CropIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cropped Result</span></div>
                  <CardContent className="p-8 flex items-center justify-center min-h-[300px] bg-muted/10">
                    <div className="relative group"><img src={croppedImage} alt="Cropped" className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {error && (<div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Crop Settings</span></div>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">X (px)</Label>
                  <Input type="number" value={crop.x} onChange={(e) => setCrop({ ...crop, x: Number(e.target.value) })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono font-bold" disabled={!originalImage} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Y (px)</Label>
                  <Input type="number" value={crop.y} onChange={(e) => setCrop({ ...crop, y: Number(e.target.value) })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono font-bold" disabled={!originalImage} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Width (px)</Label>
                  <Input type="number" value={crop.width} onChange={(e) => setCrop({ ...crop, width: Number(e.target.value) })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono font-bold" disabled={!originalImage} />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Height (px)</Label>
                  <Input type="number" value={crop.height} onChange={(e) => setCrop({ ...crop, height: Number(e.target.value) })} className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono font-bold" disabled={!originalImage} />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Button onClick={doCrop} disabled={!originalImage} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"><CropIcon className="w-5 h-5 mr-2" /> Crop</Button>
                <Button onClick={download} disabled={!croppedImage} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold"><Download className="w-4 h-4 mr-2" /> Download</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Metadata</span></div>
            <CardContent className="p-6 space-y-3">
              {originalDimensions.width > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Original</span><span className="text-xs font-mono font-bold">{originalDimensions.width} × {originalDimensions.height}</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-primary/5 border border-primary/10"><span className="text-[10px] font-bold uppercase text-primary/70">Crop</span><span className="text-xs font-mono font-bold text-primary">{crop.width} × {crop.height}</span></div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-20"><Maximize2 className="w-10 h-10" /><p className="text-xs font-medium">No image loaded</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
