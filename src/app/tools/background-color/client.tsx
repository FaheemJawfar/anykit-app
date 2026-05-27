"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument, rgb, PDFName } from "pdf-lib";

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 1, g: 1, b: 1 };
}

export default function BackgroundColor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [color, setColor] = useState("#ffffff");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      setPdfDoc(doc);
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const changeBackground = async () => {
    if (!pdfDoc || !file) return;
    setLoading(true);
    setError(null);

    try {
      const newPdfDoc = await PDFDocument.create();
      const { r, g, b } = hexToRgb(color);

      for (let i = 0; i < pdfDoc.getPageCount(); i++) {
        const [originalPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
        const { width, height } = originalPage.getSize();
        const newPage = newPdfDoc.addPage([width, height]);

        newPage.drawRectangle({
          x: 0,
          y: 0,
          width,
          height,
          color: rgb(r, g, b),
        });

        const hasContents = originalPage.node.has(PDFName.of("Contents"));
        if (hasContents) {
          const embeddedPage = await newPdfDoc.embedPage(originalPage);
          newPage.drawPage(embeddedPage, { x: 0, y: 0, width, height });
        }
      }

      const bytes = await newPdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);

      setFile(null);
      setPdfDoc(null);
    } catch (e: any) {
      setError(e.message || "Failed to change background color.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="background-color">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="relative group h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                accept="application/pdf"
              />
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <FileUp className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg">Upload PDF</h3>
                <p className="text-sm text-muted-foreground mt-1">Click or drag PDF here</p>
              </div>
            </div>

            {file && (
              <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card/60 border border-border/40">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{formatSize(file.size)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Background Color</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Select a color to fill the background behind all content on every page.
            </p>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-12 rounded-xl border border-border/40 cursor-pointer"
                />
                <span className="text-sm font-mono text-muted-foreground">{color}</span>
              </div>
            </div>

            <Button
              onClick={changeBackground}
              disabled={!file || !pdfDoc || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Palette className="w-5 h-5 mr-2" />
                  Change Background
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

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
    </ToolLayout>
  );
}
