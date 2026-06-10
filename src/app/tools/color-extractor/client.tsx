"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pipette, Upload, Trash2, Image as ImageIcon, Copy, CheckCircle2, Palette, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExtractedColor { hex: string; rgb: { r: number; g: number; b: number }; }

export default function ColorExtractor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [eyedropperActive, setEyedropperActive] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
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

  const copyHex = async (hex: string) => { try { await navigator.clipboard.writeText(hex); setCopiedHex(hex); setTimeout(() => setCopiedHex(null), 1500); } catch {} };
  const clear = () => { setUploadedImage(null); setExtractedColors([]); };

  return (
    <ToolLayout toolId="color-extractor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!uploadedImage ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload an image</p><p className="text-sm text-muted-foreground">Click or drag and drop to extract colors</p></div>
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">Browse Files</Button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            </Card>
          ) : (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3"><ImageIcon className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image Preview</span></div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={clear}><Trash2 className="w-4 h-4" /></Button>
              </div>
              <CardContent className="p-8 flex items-center justify-center min-h-[400px] bg-muted/10">
                <div className="relative group">
                  <img ref={imgRef} src={uploadedImage} alt="Upload" onClick={handleImageClick} className={cn("max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500", eyedropperActive ? 'cursor-crosshair' : 'cursor-default')} />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Actions</span></div>
            <CardContent className="p-8 space-y-4">
              <Button onClick={() => setEyedropperActive(!eyedropperActive)} disabled={!uploadedImage} className={cn("w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-[0.98]", eyedropperActive ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-primary hover:bg-primary/90 shadow-primary/20')}>
                <Pipette className="w-5 h-5 mr-2" />{eyedropperActive ? "Eyedropper On" : "Pick Colors"}
              </Button>
              <Button onClick={clear} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold text-muted-foreground"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Palette ({extractedColors.length})</span></div>
            <CardContent className="p-6">
              {extractedColors.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {extractedColors.map((c, i) => (
                    <button key={i} onClick={() => copyHex(c.hex)} className="group aspect-square rounded-2xl border border-border hover:border-primary/30 transition-all relative overflow-hidden" style={{ backgroundColor: c.hex }}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                        {copiedHex === c.hex ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Copy className="w-5 h-5 text-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-20"><Palette className="w-10 h-10" /><p className="text-xs font-medium">Click image to pick colors</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
