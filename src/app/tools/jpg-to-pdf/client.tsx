"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ImagePlus,
  Trash2,
  Zap,
  FileUp,
  RefreshCw,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  X,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PDFDocument, PageSizes } from "pdf-lib";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

export default function ImagesToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateId = () => Math.random().toString(36).slice(2, 9);

  const addImages = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(f.type)
    );
    if (imageFiles.length === 0) {
      setError("Please upload JPG, PNG, or WebP images.");
      return;
    }
    setError(null);
    const entries = imageFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...entries]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.preview);
      return filtered;
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  };

  const convert = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const img of images) {
        const bytes = await img.file.arrayBuffer();
        let embeddedImage;
        if (img.file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(bytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(bytes);
        }

        const { width, height } = embeddedImage.scale(1);
        const pageWidth = PageSizes.A4[0];
        const pageHeight = PageSizes.A4[1];
        const scale = Math.min(pageWidth / width, pageHeight / height);
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `images-${images.length}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to create PDF.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setError(null);
  };

  return (
    <ToolLayout toolId="jpg-to-pdf">

      <div className="space-y-6">
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addImages(Array.from(e.dataTransfer.files));
              }}
              className="relative group h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && addImages(Array.from(e.target.files))}
                className="hidden"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Add Images</h3>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP supported</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {images.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">{images.length} image{images.length !== 1 ? "s" : ""}</span>
              <Button variant="ghost" size="sm" onClick={clear} className="text-destructive hover:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear all
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  className="group relative aspect-square rounded-2xl border border-border/40 overflow-hidden bg-muted/30"
                >
                  <img
                    src={img.preview}
                    alt={img.file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveImage(index, -1)}
                        disabled={index === 0}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => moveImage(index, 1)}
                        disabled={index === images.length - 1}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4 text-black" />
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="w-8 h-8 rounded-full bg-destructive/90 flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={convert}
              disabled={loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Creating PDF...
                </>
              ) : (
                <>
                  <ImagePlus className="w-5 h-5 mr-2" />
                  Convert to PDF
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-3xl border-2 border-destructive/30 bg-destructive/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-destructive text-white flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-destructive">Error</h3>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Privacy Note</h3>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed italic">
            All image processing happens in your browser. Your files are never uploaded to a server.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
