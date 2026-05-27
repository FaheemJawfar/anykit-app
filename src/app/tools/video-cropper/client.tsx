"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Crop,
  Upload,
  Download,
  Video,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Move,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

export default function VideoCropperClient() {
  const [file, setFile] = useState<File | null>(null);
  const [videoDims, setVideoDims] = useState<{ width: number; height: number } | null>(null);
  const [preset, setPreset] = useState("custom");
  const [cropW, setCropW] = useState(1920);
  const [cropH, setCropH] = useState(1080);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    originalSize: number;
    outputSize: number;
    time: number;
  } | null>(null);

  const { ffmpeg, loaded, fetchFile, setOnProgress } = useFFmpeg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setVideoDims(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setPreset("custom");
    setCropW(1920);
    setCropH(1080);
    setOffsetX(0);
    setOffsetY(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const probeDimensions = (f: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.playsInline = true;
      video.muted = true;
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
        URL.revokeObjectURL(video.src);
      };
      video.onerror = () => {
        reject(new Error("Could not read video dimensions"));
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(f);
    });
  };

  const handleFile = async (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please upload a valid video file.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
    try {
      const dims = await probeDimensions(f);
      setVideoDims(dims);
    } catch {
      setVideoDims(null);
    }
  };

  const presets = [
    { value: "custom", label: "Custom", desc: "Manual input" },
    { value: "center1080", label: "Center 1080p", desc: "Clamp to video" },
    { value: "center720", label: "Center 720p", desc: "Clamp to video" },
    { value: "square", label: "Square", desc: "Center crop" },
  ];

  const even = (n: number) => (n % 2 === 0 ? n : n - 1);

  const applyPreset = (p: string) => {
    setPreset(p);
    const vw = videoDims?.width ?? 1920;
    const vh = videoDims?.height ?? 1080;
    switch (p) {
      case "center1080": {
        const w = even(Math.min(1920, vw));
        const h = even(Math.min(1080, vh));
        setCropW(w);
        setCropH(h);
        setOffsetX(Math.round((vw - w) / 2));
        setOffsetY(Math.round((vh - h) / 2));
        break;
      }
      case "center720": {
        const w = even(Math.min(1280, vw));
        const h = even(Math.min(720, vh));
        setCropW(w);
        setCropH(h);
        setOffsetX(Math.round((vw - w) / 2));
        setOffsetY(Math.round((vh - h) / 2));
        break;
      }
      case "square": {
        const s = even(Math.min(vw, vh));
        setCropW(s);
        setCropH(s);
        setOffsetX(Math.round((vw - s) / 2));
        setOffsetY(Math.round((vh - s) / 2));
        break;
      }
      default:
        break;
    }
  };

  const handleCrop = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const vw = videoDims?.width ?? 9999;
      const vh = videoDims?.height ?? 9999;
      const w = even(Math.min(cropW, vw));
      const h = even(Math.min(cropH, vh));
      const x = Math.max(0, Math.min(offsetX, vw - w));
      const y = Math.max(0, Math.min(offsetY, vh - h));

      if (w === vw && h === vh) {
        throw new Error("Crop dimensions equal video size — nothing to crop. Adjust width or height.");
      }

      const inputExt = file.name.substring(file.name.lastIndexOf(".")) || ".mp4";
      const inputName = "input" + inputExt;
      const outputName = "cropped" + inputExt;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const vf = `crop=${w}:${h}:${x}:${y}`;

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec([
        "-i", inputName,
        "-vf", vf,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
        "-c:a", "copy",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: file.type,
      });
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        originalSize: file.size,
        outputSize: blob.size,
        time: (performance.now() - start) / 1000,
      });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cropping failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  return (
    <ToolLayout toolId="video-cropper">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Preset
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => applyPreset(p.value)}
                      disabled={!file}
                      className={cn(
                        "p-2.5 rounded-xl border-2 transition-all text-center text-sm font-black",
                        !file && "opacity-40 cursor-not-allowed",
                        preset === p.value
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      {p.label}
                      <span className="text-[10px] opacity-70 block font-bold">{p.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {preset !== "square" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-2">
                      Width (px)
                    </Label>
                    <input
                      type="number"
                      min={1}
                      value={cropW}
                      onChange={(e) => { setPreset("custom"); setCropW(Math.max(1, parseInt(e.target.value) || 1)); }}
                      className="w-full bg-muted border-2 border-border rounded-xl px-3 py-2 text-sm font-black focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-2">
                      Height (px)
                    </Label>
                    <input
                      type="number"
                      min={1}
                      value={cropH}
                      onChange={(e) => { setPreset("custom"); setCropH(Math.max(1, parseInt(e.target.value) || 1)); }}
                      className="w-full bg-muted border-2 border-border rounded-xl px-3 py-2 text-sm font-black focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-2">
                        X Offset
                      </Label>
                      <input
                        type="number"
                        value={offsetX}
                        onChange={(e) => { setPreset("custom"); setOffsetX(parseInt(e.target.value) || 0); }}
                        className="w-full bg-muted border-2 border-border rounded-xl px-3 py-2 text-sm font-black focus:border-primary transition-all outline-none"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 block mb-2">
                        Y Offset
                      </Label>
                      <input
                        type="number"
                        value={offsetY}
                        onChange={(e) => { setPreset("custom"); setOffsetY(parseInt(e.target.value) || 0); }}
                        className="w-full bg-muted border-2 border-border rounded-xl px-3 py-2 text-sm font-black focus:border-primary transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleCrop}
                  disabled={!file || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Crop className="w-5 h-5 mr-2" />
                  Crop Video
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full rounded-xl font-bold h-10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Precision</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use negative offsets to auto-center. Leave width/height at 0 with Remove Bars preset to auto-detect letterbox areas.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 order-first flex flex-col gap-6">
          {!file && !result && (
            <Card
              className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden min-h-[320px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-primary/30 hover:shadow-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Drop video file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </Card>
          )}

          {file && !result && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Video className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} · {file.type.split("/")[1]?.toUpperCase() || "VIDEO"}
                  </p>
                </div>
                {!processing && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={reset}
                    className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Cropping video...</p>
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </div>
                <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {result && (
            <Card className="border-emerald-500/30 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-500/10 to-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-2xl font-black">Cropped!</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(result.originalSize)} → {formatFileSize(result.outputSize)} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      const base = file?.name.split(".")[0] || "video";
                      const ext = file?.name.substring(file.name.lastIndexOf(".")) || ".mp4";
                      a.download = `${base}_cropped${ext}`;
                      a.click();
                    }}
                    className="flex-1 h-14 rounded-2xl text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" onClick={reset} className="h-14 rounded-2xl font-bold px-6">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
