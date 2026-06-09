"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Minimize2, Download, Trash2, Image as ImageIcon, AlertTriangle } from "lucide-react";

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(null); setOriginalSize(file.size); setCompressedImage(null); setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (ev) => setOriginalImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const compress = () => {
    if (!originalImage) return; setError(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); if (!ctx) return; ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) { setCompressedImage(URL.createObjectURL(blob)); setCompressedSize(blob.size); }
        else setError('Compression failed');
      }, format, quality / 100);
    };
    img.src = originalImage;
  };

  const download = () => { if (!compressedImage) return; const a = document.createElement('a'); a.href = compressedImage; const ext = format.split('/')[1]; a.download = `compressed.${ext}`; a.click(); };
  const clear = () => { setOriginalImage(null); setCompressedImage(null); setOriginalSize(0); setCompressedSize(0); setError(null); };

  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <ToolLayout toolId="image-compressor">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 lg:order-last space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <Button onClick={compress} disabled={!originalImage} className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl"><Minimize2 className="w-5 h-5 mr-2" /> Compress</Button>
            <Button onClick={download} disabled={!compressedImage} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Download className="w-4 h-4 mr-2" /> Download</Button>
            <Button onClick={clear} variant="outline" className="w-full h-12 border-border hover:bg-accent text-muted-foreground hover:text-foreground font-bold uppercase tracking-widest text-xs"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
          </div>
          <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Settings</h3>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Quality ({quality}%)</label><input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-primary" /></div>
            <div><label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Format</label><select value={format} onChange={(e) => setFormat(e.target.value as any)} className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:border-primary focus:outline-none text-sm font-bold text-foreground"><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></div>
          </div>
          {originalSize > 0 && compressedSize > 0 && (
            <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wide">Stats</h3>
              <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Original</span><span className="font-bold">{formatSize(originalSize)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Compressed</span><span className="font-bold">{formatSize(compressedSize)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Saved</span><span className="font-bold text-primary">{Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))}%</span></div></div>
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
            {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-2"><AlertTriangle className="w-5 h-5" />{error}</div>}
            {originalImage && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><p className="text-sm font-black text-muted-foreground mb-2">Original</p><img src={originalImage} alt="Original" className="w-full rounded-xl border border-border" /></div>
                {compressedImage && (<div><p className="text-sm font-black text-muted-foreground mb-2">Compressed</p><img src={compressedImage} alt="Compressed" className="w-full rounded-xl border border-border" /></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
