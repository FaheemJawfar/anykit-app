"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Crop, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function CropPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<{ width: number; height: number } | null>(null);
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
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
      const page = doc.getPage(0);
      const { width, height } = page.getSize();
      setPageSize({ width, height });
    } catch {
      setPageSize(null);
    }
  };

  const crop = async () => {
    if (!file || !pageSize) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        if (!Number.isFinite(width) || !Number.isFinite(height)) continue;

        const left = Math.min(Math.max(0, margins.left), width / 2);
        const right = Math.min(Math.max(0, margins.right), width / 2);
        const top = Math.min(Math.max(0, margins.top), height / 2);
        const bottom = Math.min(Math.max(0, margins.bottom), height / 2);

        const newW = Math.max(1, width - left - right);
        const newH = Math.max(1, height - top - bottom);

        page.setCropBox(left, bottom, newW, newH);
        page.setMediaBox(left, bottom, newW, newH);
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cropped-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to crop PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="crop-pdf">

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
                  {pageSize && (
                    <p className="text-xs text-muted-foreground">
                      {pageSize.width.toFixed(1)} x {pageSize.height.toFixed(1)} pts
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <h3 className="font-bold">Crop Margins (points)</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "top", label: "Top" },
                { key: "right", label: "Right" },
                { key: "bottom", label: "Bottom" },
                { key: "left", label: "Left" },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label className="text-sm font-medium">{label}</Label>
                  <input
                    type="number"
                    min={0}
                    value={margins[key as keyof typeof margins]}
                    onChange={(e) =>
                      setMargins((prev) => ({
                        ...prev,
                        [key]: Math.max(0, Number(e.target.value) || 0),
                      }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            {pageSize && (
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Original</span>
                  <span className="font-medium">
                    {pageSize.width.toFixed(0)} x {pageSize.height.toFixed(0)} pts
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">New</span>
                  <span className="font-medium">
                    {(pageSize.width - margins.left - margins.right).toFixed(0)} x{" "}
                    {(pageSize.height - margins.top - margins.bottom).toFixed(0)} pts
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={crop}
              disabled={!file || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Cropping...
                </>
              ) : (
                <>
                  <Crop className="w-5 h-5 mr-2" />
                  Crop PDF
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
            <h3 className="font-bold text-destructive">Crop Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
