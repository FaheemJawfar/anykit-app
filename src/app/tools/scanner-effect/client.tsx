"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScanLine, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface ScanSettings {
  grayscale: boolean;
  border: boolean;
  rotate: number;
  rotateVariance: number;
  brightness: number;
  contrast: number;
  blur: number;
  noise: number;
  yellowish: number;
  resolution: number;
}

function applyScannerEffect(
  sourceData: ImageData,
  canvas: HTMLCanvasElement,
  settings: ScanSettings,
  rotationAngle: number,
  scale: number = 1
): void {
  const ctx = canvas.getContext("2d")!;
  const w = sourceData.width;
  const h = sourceData.height;

  const scaledBlur = settings.blur * scale;
  const scaledNoise = settings.noise * scale;

  const workCanvas = document.createElement("canvas");
  workCanvas.width = w;
  workCanvas.height = h;
  const workCtx = workCanvas.getContext("2d")!;

  if (scaledBlur > 0) {
    workCtx.filter = `blur(${scaledBlur}px)`;
  }

  workCtx.putImageData(sourceData, 0, 0);
  if (scaledBlur > 0) {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.filter = `blur(${scaledBlur}px)`;
    tempCtx.drawImage(workCanvas, 0, 0);
    workCtx.filter = "none";
    workCtx.clearRect(0, 0, w, h);
    workCtx.drawImage(tempCanvas, 0, 0);
  }

  const imageData = workCtx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const contrastFactor =
    settings.contrast !== 0
      ? (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast))
      : 1;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (settings.grayscale) {
      const grey = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      r = grey;
      g = grey;
      b = grey;
    }

    if (settings.brightness !== 0) {
      r += settings.brightness;
      g += settings.brightness;
      b += settings.brightness;
    }

    if (settings.contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    if (settings.yellowish > 0) {
      const intensity = settings.yellowish / 50;
      r += 20 * intensity;
      g += 12 * intensity;
      b -= 15 * intensity;
    }

    if (scaledNoise > 0) {
      const n = (Math.random() - 0.5) * scaledNoise;
      r += n;
      g += n;
      b += n;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  workCtx.putImageData(imageData, 0, 0);

  if (settings.border) {
    const borderSize = Math.max(w, h) * 0.02;
    const gradient1 = workCtx.createLinearGradient(0, 0, borderSize, 0);
    gradient1.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient1.addColorStop(1, "rgba(0,0,0,0)");
    workCtx.fillStyle = gradient1;
    workCtx.fillRect(0, 0, borderSize, h);

    const gradient2 = workCtx.createLinearGradient(w, 0, w - borderSize, 0);
    gradient2.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient2.addColorStop(1, "rgba(0,0,0,0)");
    workCtx.fillStyle = gradient2;
    workCtx.fillRect(w - borderSize, 0, borderSize, h);

    const gradient3 = workCtx.createLinearGradient(0, 0, 0, borderSize);
    gradient3.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient3.addColorStop(1, "rgba(0,0,0,0)");
    workCtx.fillStyle = gradient3;
    workCtx.fillRect(0, 0, w, borderSize);

    const gradient4 = workCtx.createLinearGradient(0, h, 0, h - borderSize);
    gradient4.addColorStop(0, "rgba(0,0,0,0.3)");
    gradient4.addColorStop(1, "rgba(0,0,0,0)");
    workCtx.fillStyle = gradient4;
    workCtx.fillRect(0, h - borderSize, w, borderSize);
  }

  if (rotationAngle !== 0) {
    const rad = (rotationAngle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const newW = Math.ceil(w * cos + h * sin);
    const newH = Math.ceil(w * sin + h * cos);

    canvas.width = newW;
    canvas.height = newH;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, newW, newH);
    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(rad);
    ctx.drawImage(workCanvas, -w / 2, -h / 2);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  } else {
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(workCanvas, 0, 0);
  }
}

export default function ScannerEffect() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfJsDoc, setPdfJsDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [settings, setSettings] = useState<ScanSettings>({
    grayscale: false,
    border: false,
    rotate: 0,
    rotateVariance: 0,
    brightness: 0,
    contrast: 0,
    blur: 0,
    noise: 10,
    yellowish: 0,
    resolution: 150,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const baselineDataRef = useRef<ImageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);

    try {
      const buffer = await f.arrayBuffer();
      const doc = await pdfjs.getDocument({ data: buffer }).promise;
      setPdfJsDoc(doc);

      const page = await doc.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: ctx, viewport }).promise;

      baselineDataRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
      updatePreview();
    } catch (e: any) {
      setError(e.message || "Failed to load PDF.");
    }
  };

  const updatePreview = useCallback(() => {
    if (!baselineDataRef.current || !previewCanvasRef.current) return;
    const baselineCopy = new ImageData(
      new Uint8ClampedArray(baselineDataRef.current.data),
      baselineDataRef.current.width,
      baselineDataRef.current.height
    );
    applyScannerEffect(baselineCopy, previewCanvasRef.current, settings, settings.rotate);
  }, [settings]);

  useEffect(() => {
    updatePreview();
  }, [settings, updatePreview]);

  const apply = async () => {
    if (!file || !pdfJsDoc) return;
    setLoading(true);
    setError(null);

    try {
      const newPdfDoc = await PDFDocument.create();
      const dpiScale = settings.resolution / 72;

      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: dpiScale });
        const renderCanvas = document.createElement("canvas");
        const renderCtx = renderCanvas.getContext("2d")!;
        renderCanvas.width = viewport.width;
        renderCanvas.height = viewport.height;

        await page.render({ canvasContext: renderCtx, viewport }).promise;

        const baseData = renderCtx.getImageData(0, 0, renderCanvas.width, renderCanvas.height);
        const baselineCopy = new ImageData(
          new Uint8ClampedArray(baseData.data),
          baseData.width,
          baseData.height
        );

        const outputCanvas = document.createElement("canvas");
        const pageRotation =
          settings.rotate +
          (settings.rotateVariance > 0 ? (Math.random() - 0.5) * 2 * settings.rotateVariance : 0);

        applyScannerEffect(baselineCopy, outputCanvas, settings, pageRotation, dpiScale);

        const jpegBlob = await new Promise<Blob | null>((resolve) =>
          outputCanvas.toBlob(resolve, "image/jpeg", 0.85)
        );

        if (jpegBlob) {
          const jpegBytes = await jpegBlob.arrayBuffer();
          const jpegImage = await newPdfDoc.embedJpg(jpegBytes);
          const newPage = newPdfDoc.addPage([outputCanvas.width, outputCanvas.height]);
          newPage.drawImage(jpegImage, {
            x: 0,
            y: 0,
            width: outputCanvas.width,
            height: outputCanvas.height,
          });
        }
      }

      const bytes = await newPdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scanned-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to apply scanner effect.");
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      grayscale: false,
      border: false,
      rotate: 0,
      rotateVariance: 0,
      brightness: 0,
      contrast: 0,
      blur: 0,
      noise: 10,
      yellowish: 0,
      resolution: 150,
    });
  };

  const slider = (label: string, key: keyof ScanSettings, min: number, max: number, step: number, suffix: string = "") => (
    <div className="space-y-1">
      <div className="flex justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <span className="text-xs text-muted-foreground">{settings[key]}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={settings[key] as number}
        onChange={(e) => {
          setSettings((s) => ({ ...s, [key]: Number(e.target.value) }));
        }}
        className="w-full"
      />
    </div>
  );

  return (
    <ToolLayout toolId="scanner-effect">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className="relative group h-32 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer border-border/60 hover:border-primary/40 hover:bg-primary/5"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
                accept="application/pdf"
              />
              <FileUp className="w-6 h-6 text-primary mb-2" />
              <p className="text-sm font-medium">Upload PDF</p>
            </div>

            {file && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-card/60 border border-border/40">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm truncate">{file.name}</p>
              </div>
            )}

            <div className="space-y-3">
              {slider("Rotation", "rotate", -5, 5, 0.5, "°")}
              {slider("Rotation Variance", "rotateVariance", 0, 3, 0.1, "°")}
              {slider("Brightness", "brightness", -50, 50, 1)}
              {slider("Contrast", "contrast", -50, 50, 1)}
              {slider("Blur", "blur", 0, 5, 0.1, "px")}
              {slider("Noise", "noise", 0, 50, 1)}
              {slider("Yellowish", "yellowish", 0, 50, 1)}
              {slider("Resolution", "resolution", 72, 300, 1, " DPI")}

              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.grayscale}
                    onChange={(e) => setSettings((s) => ({ ...s, grayscale: e.target.checked }))}
                    className="rounded"
                  />
                  Grayscale
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.border}
                    onChange={(e) => setSettings((s) => ({ ...s, border: e.target.checked }))}
                    className="rounded"
                  />
                  Border
                </label>
              </div>

              <Button variant="outline" onClick={resetSettings} className="w-full rounded-xl">
                Reset Settings
              </Button>
            </div>

            <Button
              onClick={apply}
              disabled={!file || loading}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ScanLine className="w-5 h-5 mr-2" />
                  Apply Scanner Effect
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8">
            <h3 className="font-bold mb-4">Preview</h3>
            <div className="rounded-2xl border border-border/40 bg-black/5 overflow-hidden">
              <canvas
                ref={previewCanvasRef}
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Preview updates as you adjust settings.
            </p>
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
