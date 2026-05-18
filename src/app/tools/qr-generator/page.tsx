"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { QRCodeSVG } from "qrcode.react";
import { 
  Download, 
  QrCode, 
  Settings2, 
  Palette, 
  Type, 
  RefreshCcw,
  Share2,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function QrGenerator() {
  const [text, setText] = useState("https://anykit.app");
  const [size, setSize] = useState([320]);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQrCode = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = size[0];
      canvas.height = size[0];
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `anykit-qr-${Date.now()}.png`;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  const presets = [
    { fg: "#000000", bg: "#ffffff", name: "Classic" },
    { fg: "#4f46e5", bg: "#ffffff", name: "Indigo" },
    { fg: "#ffffff", bg: "#0f172a", name: "Dark" },
    { fg: "#059669", bg: "#f0fdf4", name: "Emerald" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <QrCode className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">QR Code Generator</h1>
          <p className="text-sm text-muted-foreground">
            Create custom, high-resolution QR codes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input and Basic Config */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Content</Label>
                </div>
                <div className="relative group">
                  <Input
                    placeholder="Enter URL or text..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-14 px-4 rounded-2xl bg-muted/30 border-2 border-transparent focus:border-primary/20 transition-all text-lg"
                  />
                  {text && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-background"
                      onClick={() => setText("")}
                    >
                      <RefreshCcw className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Size ({size[0]}px)</Label>
                  </div>
                  <Slider
                    min={128}
                    max={1024}
                    step={32}
                    value={size}
                    onValueChange={setSize}
                    className="py-4"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Precision</Label>
                  </div>
                  <div className="flex gap-1 p-1 bg-muted/30 rounded-xl">
                    {(["L", "M", "Q", "H"] as const).map((l) => (
                      <Button
                        key={l}
                        variant="ghost"
                        className={cn(
                          "flex-1 h-9 rounded-lg text-xs font-bold transition-all",
                          level === l ? "bg-background text-primary shadow-sm" : "text-muted-foreground"
                        )}
                        onClick={() => setLevel(l)}
                      >
                        {l}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/30 backdrop-blur-sm rounded-3xl">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Style & Color</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">Foreground</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl cursor-pointer bg-background"
                    />
                    <Input
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="flex-1 font-mono uppercase h-12 rounded-xl bg-muted/30 border-transparent"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-xs font-semibold text-muted-foreground ml-1">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl cursor-pointer bg-background"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="flex-1 font-mono uppercase h-12 rounded-xl bg-muted/30 border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {presets.map((p) => (
                  <button
                    key={p.name}
                    className={cn(
                      "group flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all",
                      fgColor === p.fg && bgColor === p.bg 
                        ? "bg-primary/10 border-primary/20 text-primary" 
                        : "bg-muted/30 border-transparent hover:border-border"
                    )}
                    onClick={() => {
                      setFgColor(p.fg);
                      setBgColor(p.bg);
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border border-border/50" 
                      style={{ background: `linear-gradient(135deg, ${p.fg} 50%, ${p.bg} 50%)` }} 
                    />
                    <span className="text-xs font-bold">{p.name}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-5 sticky top-24">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Live Preview</h3>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                  Rendering 1:1
                </div>
              </div>

              <div 
                ref={qrRef}
                className="aspect-square w-full rounded-[2rem] flex items-center justify-center shadow-inner relative overflow-hidden group/qr"
                style={{ backgroundColor: bgColor }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.02)_100%)]" />
                {text ? (
                  <QRCodeSVG
                    value={text}
                    size={size[0] > 400 ? 400 : size[0]} // Cap visual preview size
                    fgColor={fgColor}
                    bgColor={bgColor}
                    level={level}
                    includeMargin={true}
                    className="relative z-10 transition-transform duration-500 group-hover/qr:scale-[1.02]"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <QrCode className="w-16 h-16 opacity-20" />
                    <p className="text-sm font-medium">Waiting for content...</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Button 
                  disabled={!text}
                  onClick={downloadQrCode}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download High-Res PNG
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" disabled={!text} className="h-12 rounded-xl border-border/50">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="outline" disabled={!text} className="h-12 rounded-xl border-border/50">
                    <Maximize2 className="w-4 h-4 mr-2" />
                    Full View
                  </Button>
                </div>
              </div>

              <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                Supports all standard QR readers. Higher precision (H) is recommended for complex data or small prints.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

