"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

interface AdjustSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hueShift: number;
  temperature: number;
  tint: number;
  gamma: number;
  sepia: number;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

function applyColorAdjustments(
  sourceData: ImageData,
  canvas: HTMLCanvasElement,
  settings: AdjustSettings
): void {
  const ctx = canvas.getContext("2d")!;
  const w = sourceData.width;
  const h = sourceData.height;

  canvas.width = w;
  canvas.height = h;

  const imageData = new ImageData(new Uint8ClampedArray(sourceData.data), w, h);
  const data = imageData.data;

  const contrastFactor =
    settings.contrast !== 0
      ? (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast))
      : 1;

  const gammaCorrection = settings.gamma !== 1.0 ? 1 / settings.gamma : 1;
  const sepiaAmount = settings.sepia / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    if (settings.brightness !== 0) {
      const adj = settings.brightness * 2.55;
      r += adj;
      g += adj;
      b += adj;
    }

    if (settings.contrast !== 0) {
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
    }

    if (settings.saturation !== 0 || settings.hueShift !== 0) {
      const [hue, sat, lig] = rgbToHsl(
        Math.max(0, Math.min(255, r)),
        Math.max(0, Math.min(255, g)),
        Math.max(0, Math.min(255, b))
      );

      let newHue = hue;
      if (settings.hueShift !== 0) {
        newHue = (hue + settings.hueShift / 360) % 1;
        if (newHue < 0) newHue += 1;
      }

      let newSat = sat;
      if (settings.saturation !== 0) {
        const satAdj = settings.saturation / 100;
        newSat = satAdj > 0 ? sat + (1 - sat) * satAdj : sat * (1 + satAdj);
        newSat = Math.max(0, Math.min(1, newSat));
      }

      [r, g, b] = hslToRgb(newHue, newSat, lig);
    }

    if (settings.temperature !== 0) {
      const t = settings.temperature / 50;
      r += 30 * t;
      b -= 30 * t;
    }

    if (settings.tint !== 0) {
      const t = settings.tint / 50;
      g += 30 * t;
    }

    if (settings.gamma !== 1.0) {
      r = Math.pow(Math.max(0, Math.min(255, r)) / 255, gammaCorrection) * 255;
      g = Math.pow(Math.max(0, Math.min(255, g)) / 255, gammaCorrection) * 255;
      b = Math.pow(Math.max(0, Math.min(255, b)) / 255, gammaCorrection) * 255;
    }

    if (settings.sepia > 0) {
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;
      r = r + (sr - r) * sepiaAmount;
      g = g + (sg - g) * sepiaAmount;
      b = b + (sb - b) * sepiaAmount;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  ctx.putImageData(imageData, 0, 0);
}

export default function AdjustColors() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfJsDoc, setPdfJsDoc] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [settings, setSettings] = useState<AdjustSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    hueShift: 0,
    temperature: 0,
    tint: 0,
    gamma: 1.0,
    sepia: 0,
  });
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
    applyColorAdjustments(baselineCopy, previewCanvasRef.current, settings);
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

      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const renderCanvas = document.createElement("canvas");
        const renderCtx = renderCanvas.getContext("2d")!;
        renderCanvas.width = viewport.width;
        renderCanvas.height = viewport.height;

        await page.render({ canvasContext: renderCtx, viewport }).promise;

        const baseData = renderCtx.getImageData(0, 0, renderCanvas.width, renderCanvas.height);
        const outputCanvas = document.createElement("canvas");
        applyColorAdjustments(baseData, outputCanvas, settings);

        const pngBlob = await new Promise<Blob | null>((resolve) =>
          outputCanvas.toBlob(resolve, "image/png")
        );

        if (pngBlob) {
          const pngBytes = await pngBlob.arrayBuffer();
          const pngImage = await newPdfDoc.embedPng(pngBytes);
          const origViewport = page.getViewport({ scale: 1 });
          const newPage = newPdfDoc.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
          });
        }
      }

      const bytes = await newPdfDoc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `adjusted-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to apply color adjustments.");
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      hueShift: 0,
      temperature: 0,
      tint: 0,
      gamma: 1.0,
      sepia: 0,
    });
  };

  const slider = (label: string, key: keyof AdjustSettings, min: number, max: number, step: number, suffix: string = "") => (
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
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8 text-foreground">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Adjust Colors</h1>
          <p className="text-sm text-muted-foreground">
            Fine-tune brightness, contrast, saturation and more.
          </p>
        </div>
      </div>

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
              {slider("Brightness", "brightness", -50, 50, 1)}
              {slider("Contrast", "contrast", -50, 50, 1)}
              {slider("Saturation", "saturation", -100, 100, 1)}
              {slider("Hue Shift", "hueShift", -180, 180, 1, "°")}
              {slider("Temperature", "temperature", -50, 50, 1)}
              {slider("Tint", "tint", -50, 50, 1)}
              {slider("Gamma", "gamma", 0.1, 3.0, 0.1)}
              {slider("Sepia", "sepia", 0, 100, 1)}

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
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Apply Adjustments
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
    </div>
  );
}
