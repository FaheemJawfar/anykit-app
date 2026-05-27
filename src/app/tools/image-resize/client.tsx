"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Upload, 
  Download, 
  Image as ImageIcon, 
  Maximize2, 
  Lock, 
  Unlock, 
  RefreshCw, 
  FileImage,
  Layers,
  Settings2,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function ImageResize() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(String(img.width));
          setHeight(String(img.height));
          setImage(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (!image) return;
    setIsResizing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const newWidth = parseInt(width) || img.width;
      const newHeight = parseInt(height) || img.height;

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        const resizedImage = canvas.toDataURL("image/png", 1.0);
        setImage(resizedImage);
      }
      setIsResizing(false);
    };
    img.src = image;
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `anykit-resized-${Date.now()}.png`;
    link.click();
  };

  const handleWidthChange = (value: string) => {
    setWidth(value);
    const numValue = parseInt(value);
    if (maintainAspect && originalDimensions.width > 0 && !isNaN(numValue)) {
      const aspectRatio = originalDimensions.height / originalDimensions.width;
      const newHeight = Math.round(numValue * aspectRatio);
      setHeight(String(newHeight));
    }
  };

  const handleHeightChange = (value: string) => {
    setHeight(value);
    const numValue = parseInt(value);
    if (maintainAspect && originalDimensions.height > 0 && !isNaN(numValue)) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(numValue * aspectRatio);
      setWidth(String(newWidth));
    }
  };

  const reset = () => {
    setImage(null);
    setWidth("");
    setHeight("");
    setOriginalDimensions({ width: 0, height: 0 });
  };

  return (
    <ToolLayout toolId="image-resize">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          {!image ? (
            <Card 
              className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm rounded-[2.5rem] h-[500px] flex flex-col items-center justify-center space-y-6 transition-all hover:border-primary/20 hover:bg-primary/[0.02] cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-bold">Upload an image</p>
                <p className="text-sm text-muted-foreground">Click or drag and drop to start resizing</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              <Button className="rounded-2xl px-8 h-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                Browse Files
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden overflow-y-auto">
                <div className="px-8 py-6 border-b border-border/40 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Canvas Preview</span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500" onClick={reset}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-12 flex items-center justify-center min-h-[500px] bg-muted/10 pattern-dots">
                  <div className="relative group">
                    <img src={image} alt="Preview" className="max-w-full h-auto rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]" />
                    <div className="absolute inset-0 rounded-xl border border-black/5 pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Adjustments</span>
            </div>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Width (px)</Label>
                  <Input 
                    type="number" value={width} onChange={(e) => handleWidthChange(e.target.value)}
                    className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono" 
                    disabled={!image}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Height (px)</Label>
                  <Input 
                    type="number" value={height} onChange={(e) => handleHeightChange(e.target.value)}
                    className="h-12 px-4 rounded-xl bg-muted/30 border-transparent focus:border-primary/20 text-lg font-mono" 
                    disabled={!image}
                  />
                </div>
              </div>

              <div 
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl transition-colors cursor-pointer group border border-transparent",
                  maintainAspect ? "bg-primary/5 border-primary/10 text-primary" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                )}
                onClick={() => setMaintainAspect(!maintainAspect)}
              >
                <div className="flex items-center gap-3">
                  {maintainAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span className="text-xs font-bold">Lock Aspect Ratio</span>
                </div>
                <Checkbox checked={maintainAspect} className="pointer-events-none" />
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={handleResize} disabled={!image || isResizing}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {isResizing ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Resize Image"}
                </Button>
                <Button 
                  variant="outline" onClick={handleDownload} disabled={!image}
                  className="w-full h-12 rounded-xl border-border/50 font-bold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border/40 bg-muted/30 flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Metadata</span>
            </div>
            <CardContent className="p-6 space-y-4">
              {image ? (
                <div className="space-y-2">
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Format</span>
                    <span className="text-[10px] font-mono font-bold">PNG</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-muted/30">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">Original Size</span>
                    <span className="text-[10px] font-mono font-bold">{originalDimensions.width} × {originalDimensions.height}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-[10px] font-bold uppercase text-primary/70">Target Size</span>
                    <span className="text-[10px] font-mono font-bold text-primary">{width} × {height}</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-20">
                  <FileImage className="w-10 h-10" />
                  <p className="text-xs font-medium">No image metadata</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
