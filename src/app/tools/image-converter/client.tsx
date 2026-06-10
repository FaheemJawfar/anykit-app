"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Download, Trash2, Image as ImageIcon, Upload, AlertCircle, Settings2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'image/bmp' | 'image/gif'>('image/webp');
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setError(null); setConvertedImage(null);
    const reader = new FileReader();
    reader.onload = (ev) => setOriginalImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!originalImage) return;
    setIsConverting(true); setError(null);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas'); canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d'); if (!ctx) { setIsConverting(false); return; }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        setIsConverting(false);
        if (blob) setConvertedImage(URL.createObjectURL(blob));
        else setError('Conversion failed');
      }, outputFormat);
    };
    img.onerror = () => { setIsConverting(false); setError('Failed to load image'); };
    img.src = originalImage;
  };

  const download = () => { if (!convertedImage) return; const a = document.createElement('a'); a.href = convertedImage; const ext = outputFormat.split('/')[1]; a.download = `converted.${ext}`; a.click(); };
  const clear = () => { setOriginalImage(null); setConvertedImage(null); setError(null); };

  const formats: { value: typeof outputFormat; label: string }[] = [
    { value: 'image/jpeg', label: 'JPEG' }, { value: 'image/png', label: 'PNG' },
    { value: 'image/webp', label: 'WebP' }, { value: 'image/bmp', label: 'BMP' }, { value: 'image/gif', label: 'GIF' },
  ];

  return (
    <ToolLayout toolId="image-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!originalImage ? (
            <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Upload className="w-10 h-10" /></div>
              <div className="text-center space-y-2"><p className="text-xl font-bold">Upload an image</p><p className="text-sm text-muted-foreground">Click or drag and drop to convert format</p></div>
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
                <CardContent className="p-12 flex items-center justify-center min-h-[400px] bg-muted/10">
                  <div className="relative group"><img src={originalImage} alt="Original" className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                </CardContent>
              </Card>
              {convertedImage && (
                <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                  <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center gap-3"><ArrowRightLeft className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Converted</span></div>
                  <CardContent className="p-12 flex items-center justify-center min-h-[400px] bg-muted/10">
                    <div className="relative group"><img src={convertedImage} alt="Converted" className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" /><div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" /></div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {error && (<div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold"><AlertCircle className="w-5 h-5 flex-shrink-0" />{error}</div>)}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Settings2 className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Settings</span></div>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Output Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  {formats.map((f) => (<button key={f.value} onClick={() => setOutputFormat(f.value)} className={cn("px-3 py-2 rounded-xl text-xs font-bold border transition-all", outputFormat === f.value ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-muted/30 text-muted-foreground border-border hover:bg-muted/50")}>{f.label}</button>))}
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <Button onClick={convert} disabled={!originalImage || isConverting} className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                  {isConverting ? <ArrowRightLeft className="w-5 h-5 animate-spin" /> : <ArrowRightLeft className="w-5 h-5 mr-2" />}
                  {isConverting ? 'Converting...' : 'Convert'}
                </Button>
                <Button onClick={download} disabled={!convertedImage} variant="outline" className="w-full h-12 rounded-xl border-border/50 font-bold"><Download className="w-4 h-4 mr-2" /> Download</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Details</span></div>
            <CardContent className="p-6 space-y-3">
              {originalImage ? (
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30"><span className="text-[10px] font-bold uppercase text-muted-foreground">Input</span><span className="text-xs font-mono font-bold">Image</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-primary/5 border border-primary/10"><span className="text-[10px] font-bold uppercase text-primary/70">Output</span><span className="text-xs font-mono font-bold text-primary">{outputFormat.split('/')[1].toUpperCase()}</span></div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-20"><ImageIcon className="w-10 h-10" /><p className="text-xs font-medium">No image selected</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
