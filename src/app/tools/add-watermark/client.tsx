"use client";

import { ToolLayout } from "@/components/tool-layout";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Stamp, FileUp, FileText, RefreshCw, AlertCircle } from "lucide-react";
import { PDFDocument, rgb, degrees } from "pdf-lib";

export default function AddWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.4);
  const [fontSize, setFontSize] = useState(48);
  const [color, setColor] = useState("#999999");
  const [position, setPosition] = useState<string>("center");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    if (f.type !== "application/pdf") return;
    setFile(f);
    setError(null);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0.6, g: 0.6, b: 0.6 };
  };

  const createTextImage = async (watermarkText: string, textColor: string, textSize: number) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to create canvas context");

    const dpr = 2;
    const hexResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(textColor);
    const colorR = hexResult ? parseInt(hexResult[1], 16) : 153;
    const colorG = hexResult ? parseInt(hexResult[2], 16) : 153;
    const colorB = hexResult ? parseInt(hexResult[3], 16) : 153;

    const fontStr = `bold ${textSize * dpr}px Arial, sans-serif`;
    ctx.font = fontStr;
    const metrics = ctx.measureText(watermarkText);

    canvas.width = Math.ceil(metrics.width) + 4;
    canvas.height = Math.ceil(textSize * dpr * 1.4);

    ctx.font = fontStr;
    ctx.fillStyle = `rgb(${colorR}, ${colorG}, ${colorB})`;
    ctx.textBaseline = "middle";
    ctx.fillText(watermarkText, 2, canvas.height / 2);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
        "image/png"
      );
    });
    return new Uint8Array(await blob.arrayBuffer());
  };

  const apply = async () => {
    if (!file || !text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const imageBytes = await createTextImage(text, color, fontSize);
      const image = await doc.embedPng(imageBytes);

      const imgWidth = image.width / 2;
      const imgHeight = image.height / 2;

      // Position ratios (0-1) and rotation
      let posX = 0.5, posY = 0.5, angle = -45;
      switch (position) {
        case "center": posX = 0.5; posY = 0.5; angle = -45; break;
        case "top-left": posX = 0.15; posY = 0.85; angle = 0; break;
        case "top-right": posX = 0.85; posY = 0.85; angle = 0; break;
        case "bottom-left": posX = 0.15; posY = 0.15; angle = 0; break;
        case "bottom-right": posX = 0.85; posY = 0.15; angle = 0; break;
        case "tile": posX = 0.5; posY = 0.5; angle = -30; break;
      }

      const pages = doc.getPages();
      for (const page of pages) {
        const { width, height } = page.getSize();

        if (position === "tile") {
          const spacing = 200;
          const tileSize = fontSize;
          const tileImageBytes = await createTextImage(text, color, tileSize);
          const tileImg = await doc.embedPng(tileImageBytes);
          const tW = tileImg.width / 2;
          const tH = tileImg.height / 2;
          const rad = (angle * Math.PI) / 180;
          const halfW = tW / 2;
          const halfH = tH / 2;

          for (let tx = 0; tx < width; tx += spacing) {
            for (let ty = 0; ty < height; ty += spacing) {
              page.drawImage(tileImg, {
                x: tx - Math.cos(rad) * halfW + Math.sin(rad) * halfH,
                y: ty - Math.sin(rad) * halfW - Math.cos(rad) * halfH,
                width: tW,
                height: tH,
                opacity,
                rotate: degrees(angle),
              });
            }
          }
          continue;
        }

        const cx = posX * width;
        const cy = posY * height;
        const rad = (angle * Math.PI) / 180;
        const halfW = imgWidth / 2;
        const halfH = imgHeight / 2;

        page.drawImage(image, {
          x: cx - Math.cos(rad) * halfW + Math.sin(rad) * halfH,
          y: cy - Math.sin(rad) * halfW - Math.cos(rad) * halfH,
          width: imgWidth,
          height: imgHeight,
          opacity,
          rotate: degrees(angle),
        });
      }

      const bytes = await doc.save();
      const blob = new Blob([bytes.slice()], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `watermarked-${file.name}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e.message || "Failed to add watermark.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout toolId="add-watermark">

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
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <h3 className="font-bold">Watermark Settings</h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Text</Label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border/40 bg-card/60 text-sm"
                placeholder="CONFIDENTIAL"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {["center", "top-left", "top-right", "bottom-left", "bottom-right", "tile"].map((pos) => (
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">Font Size ({fontSize}px)</Label>
              <input
                type="range"
                min={12}
                max={120}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Opacity ({Math.round(opacity * 100)}%)</Label>
              <input
                type="range"
                min={5}
                max={100}
                value={opacity * 100}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl border border-border/40 cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">{color}</span>
              </div>
            </div>

            <Button
              onClick={apply}
              disabled={!file || loading || !text}
              className="w-full h-14 rounded-2xl text-base font-bold"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <Stamp className="w-5 h-5 mr-2" />
                  Add Watermark
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
            <h3 className="font-bold text-destructive">Watermark Failed</h3>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
