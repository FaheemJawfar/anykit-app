"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PenTool, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";

export default function SignPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [sigImage, setSigImage] = useState<File | null>(null);
  const [position, setPosition] = useState<string>("bottom-right");
  const [size, setSize] = useState<number>(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
  };

  const handleSig = async (f: File) => {
    if (!f.type.startsWith("image/")) return;
    setSigImage(f);
  };

  const sign = async () => {
    if (!file || !sigImage) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);

      const sigBytes = await sigImage.arrayBuffer();
      let embeddedImage;
      if (sigImage.type === "image/png") {
        embeddedImage = await doc.embedPng(sigBytes);
      } else {
        embeddedImage = await doc.embedJpg(sigBytes);
      }

      const { width: imgW, height: imgH } = embeddedImage.size();
      const scale = size / 100;

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const w = imgW * scale;
        const h = imgH * scale;

        let x = 0, y = 0;
        const margin = 20;

        switch (position) {
          case "top-left":
            x = margin;
            y = height - h - margin;
            break;
          case "top-right":
            x = width - w - margin;
            y = height - h - margin;
            break;
          case "bottom-left":
            x = margin;
            y = margin;
            break;
          case "bottom-right":
            x = width - w - margin;
            y = margin;
            break;
          case "center":
            x = (width - w) / 2;
            y = (height - h) / 2;
            break;
        }

        page.drawImage(embeddedImage, { x, y, width: w, height: h });
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signed-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to sign PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <PenTool className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Sign PDF</h1>
          <p className="text-sm text-muted-foreground">
            Stamp a signature image on every page of your PDF.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div>
              <h3 className="font-bold mb-4">1. Upload PDF</h3>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleFile(f);
                }}
                className="relative group h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                  accept="application/pdf"
                />
                <FileUp className="w-6 h-6 text-primary mb-2" />
                <p className="text-sm font-medium">Click or drag PDF</p>
              </div>
              {file && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/40">
                  <FileText className="w-4 h-4 text-primary" />
                  <p className="text-sm truncate">{file.name}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-4">2. Upload Signature</h3>
              <div
                onClick={() => sigInputRef.current?.click()}
                className="relative group h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
              >
                <input
                  type="file"
                  ref={sigInputRef}
                  onChange={(e) => e.target.files?.[0] && handleSig(e.target.files[0])}
                  className="hidden"
                  accept="image/png,image/jpeg,image/jpg"
                />
                <PenTool className="w-6 h-6 text-primary mb-2" />
                <p className="text-sm font-medium">PNG or JPG signature</p>
              </div>
              {sigImage && (
                <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-card/60 border border-border/40">
                  <PenTool className="w-4 h-4 text-primary" />
                  <p className="text-sm truncate">{sigImage.name}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <h3 className="font-bold">3. Position & Size</h3>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {["top-left", "top-right", "center", "bottom-left", "bottom-right"].map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={`p-2 rounded-xl text-xs font-medium transition-all ${
                      position === pos
                        ? "bg-primary text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Size ({size}%)</Label>
              <input
                type="range"
                min={5}
                max={50}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <Button
              onClick={sign}
              disabled={!file || !sigImage || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <PenTool className="w-5 h-5 mr-2" />
                  Sign PDF
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
            <h3 className="font-bold text-destructive">Signing Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
