"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Zap, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

const PRESETS = {
  light: { scale: 2.0, quality: 0.85 },
  balanced: { scale: 1.5, quality: 0.65 },
  aggressive: { scale: 1.2, quality: 0.45 },
  extreme: { scale: 1.0, quality: 0.25 },
};

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"structure" | "rasterize">("structure");
  const [level, setLevel] = useState<keyof typeof PRESETS>("balanced");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ before: number; after: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setResult(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const compress = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      let bytes: Uint8Array;

      if (mode === "structure") {
        const doc = await PDFDocument.load(buffer);
        doc.setTitle("");
        doc.setAuthor("");
        doc.setSubject("");
        doc.setKeywords([]);
        doc.setCreator("");
        doc.setProducer("");
        bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false });
      } else {
        const settings = PRESETS[level];
        const pdfJsDoc = await pdfjs.getDocument({ data: buffer }).promise;
        const newPdfDoc = await PDFDocument.create();

        for (let i = 1; i <= pdfJsDoc.numPages; i++) {
          const page = await pdfJsDoc.getPage(i);
          const viewport = page.getViewport({ scale: settings.scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) throw new Error("Failed to create canvas context");
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          const jpegBlob = await new Promise<Blob>((resolve, reject) =>
            canvas.toBlob(
              (blob) => (blob ? resolve(blob) : reject(new Error("Failed to create JPEG"))),
              "image/jpeg",
              settings.quality
            )
          );

          const jpegBytes = await jpegBlob.arrayBuffer();
          const jpegImage = await newPdfDoc.embedJpg(jpegBytes);
          const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height,
          });
        }

        bytes = await newPdfDoc.save();
      }

      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `compressed-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);

      setResult({ before: buffer.byteLength, after: bytes.length });
    } catch (e: any) {
      setError(e.message || "Failed to compress PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="compress-pdf">

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
              <Zap className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Compression</h3>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Mode</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setMode("structure")}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    mode === "structure"
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Structure
                </button>
                <button
                  onClick={() => setMode("rasterize")}
                  className={`p-2 rounded-xl text-xs font-medium transition-all ${
                    mode === "rasterize"
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  Rasterize
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {mode === "structure"
                  ? "Removes metadata and optimizes structure. Keeps text selectable. Best for text-based PDFs."
                  : "Renders pages to JPEG. Best for scanned or image-heavy PDFs."}
              </p>
            </div>

            {mode === "rasterize" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quality</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["light", "balanced", "aggressive", "extreme"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`p-2 rounded-xl text-xs font-medium transition-all ${
                        level === l
                          ? "bg-primary text-white"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {level === "light" && "Scale 2x, Quality 85% — Minimal loss"}
                  {level === "balanced" && "Scale 1.5x, Quality 65% — Good balance"}
                  {level === "aggressive" && "Scale 1.2x, Quality 45% — Smaller file"}
                  {level === "extreme" && "Scale 1x, Quality 25% — Maximum compression"}
                </p>
              </div>
            )}

            {result && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Before</span>
                  <span className="font-medium">{formatSize(result.before)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">After</span>
                  <span className="font-medium">{formatSize(result.after)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-primary/10">
                  <span className="text-primary font-bold">Saved</span>
                  <span className="text-primary font-bold">
                    {((1 - result.after / result.before) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={compress}
              disabled={!file || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Compress PDF
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
            <h3 className="font-bold text-destructive">Compression Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
