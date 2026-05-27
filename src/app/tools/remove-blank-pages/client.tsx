"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileMinus, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface BlankPage {
  index: number;
  thumbnail: string;
  selected: boolean;
}

export default function RemoveBlankPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [blankPages, setBlankPages] = useState<BlankPage[]>([]);
  const [sensitivity, setSensitivity] = useState(80);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
    setBlankPages([]);

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

  const isPageBlank = async (page: pdfjs.PDFPageProxy, maxNonWhitePercent: number): Promise<boolean> => {
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const totalPixels = data.length / 4;

    let nonWhitePixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness < 240) nonWhitePixels++;
    }

    const nonWhitePercent = (nonWhitePixels / totalPixels) * 100;
    return nonWhitePercent <= maxNonWhitePercent;
  };

  const generateThumbnail = async (page: pdfjs.PDFPageProxy): Promise<string> => {
    const viewport = page.getViewport({ scale: 0.3 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;
    return canvas.toDataURL("image/jpeg", 0.6);
  };

  const detectBlankPages = async () => {
    if (!file || !pdfDoc) return;
    setLoading(true);
    setError(null);

    try {
      const maxNonWhitePercent = 5 - (sensitivity / 100) * 4.9;
      const buffer = await file.arrayBuffer();
      const pdfJsDoc = await pdfjs.getDocument({ data: buffer }).promise;
      const detected: BlankPage[] = [];

      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        if (await isPageBlank(page, maxNonWhitePercent)) {
          const thumbnail = await generateThumbnail(page);
          detected.push({ index: i - 1, thumbnail, selected: true });
        }
      }

      if (detected.length === 0) {
        setError("No blank pages detected in this PDF.");
      }

      setBlankPages(detected);
    } catch (e: any) {
      setError(e.message || "Failed to detect blank pages.");
    } finally {
      setLoading(false);
    }
  };

  const togglePage = (index: number) => {
    setBlankPages((prev) =>
      prev.map((p) => (p.index === index ? { ...p, selected: !p.selected } : p))
    );
  };

  const removeSelected = async () => {
    if (!pdfDoc || !file) return;
    const selected = blankPages.filter((p) => p.selected);
    if (selected.length === 0) {
      setError("No pages selected for removal.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const newPdf = await PDFDocument.create();
      const pages = pdfDoc.getPages();
      const selectedIndices = new Set(selected.map((p) => p.index));

      for (let i = 0; i < pages.length; i++) {
        if (!selectedIndices.has(i)) {
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
          newPdf.addPage(copiedPage);
        }
      }

      const bytes = await newPdf.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);

      setBlankPages([]);
      setFile(null);
      setPdfDoc(null);
    } catch (e: any) {
      setError(e.message || "Failed to remove blank pages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="remove-blank-pages">

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
              <FileMinus className="w-5 h-5 text-primary" />
              <h3 className="font-bold">Detection Settings</h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Label className="text-sm font-medium">Sensitivity</Label>
                <span className="text-sm text-muted-foreground">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher sensitivity detects more pages as blank.
              </p>
            </div>

            <Button
              onClick={detectBlankPages}
              disabled={!file || !pdfDoc || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading && blankPages.length === 0 ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <FileMinus className="w-5 h-5 mr-2" />
                  Detect Blank Pages
                </>
              )}
            </Button>

            {blankPages.length > 0 && (
              <>
                <p className="text-sm text-muted-foreground">
                  Found {blankPages.length} blank page(s). Click to toggle selection.
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {blankPages.map((page) => (
                    <div
                      key={page.index}
                      onClick={() => togglePage(page.index)}
                      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        page.selected
                          ? "border-red-500"
                          : "border-transparent opacity-50"
                      }`}
                    >
                      <img
                        src={page.thumbnail}
                        alt={`Page ${page.index + 1}`}
                        className="w-full h-auto"
                      />
                      <div className="absolute top-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                        {page.index + 1}
                      </div>
                      {page.selected && (
                        <div className="absolute top-1 right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  onClick={removeSelected}
                  disabled={loading}
                  variant="destructive"
                  className="w-full h-14 rounded-2xl text-base font-bold"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <FileMinus className="w-5 h-5 mr-2" />
                      Remove Selected
                    </>
                  )}
                </Button>
              </>
            )}
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
