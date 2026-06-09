"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Download, Trash2, Image as ImageIcon, AlertTriangle } from "lucide-react";

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'image/bmp' | 'image/gif'>('image/webp');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(null); setConvertedImage(null);
    const reader = new FileReader();
    reader.onload = (ev) => setOriginalImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!originalImage) return; setError(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => { if (blob) setConvertedImage(URL.createObjectURL(blob)); else setError('Conversion failed'); }, outputFormat);
    };
    img.src = originalImage;
  };

  const download = () => { if (!convertedImage) return; const a = document.createElement('a'); a.href = convertedImage; const ext = outputFormat.split('/')[1]; a.download = `converted.${ext}`; a.click(); };
  const clear = () => { setOriginalImage(null); setConvertedImage(null); setError(null); };

  return (
    <ToolLayout toolId="image-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={convert} disabled={!originalImage} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><ArrowRightLeft className="w-5 h-5 mr-2" /> Convert</Button>
            <Button onClick={download} disabled={!convertedImage} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download</Button>
            <Button onClick={clear} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Output Format</h3>
            <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value as any)} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option><option value="image/bmp">BMP</option><option value="image/gif">GIF</option></select>
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
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="text-sm font-black text-muted-foreground mb-2">Original</p><img src={originalImage} alt="Original" className="w-full rounded-xl border border-border" /></div>
                {convertedImage && (<div><p className="text-sm font-black text-muted-foreground mb-2">Converted</p><img src={convertedImage} alt="Converted" className="w-full rounded-xl border border-border" /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
