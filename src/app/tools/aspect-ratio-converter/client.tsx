"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  ScanLine,
  Upload,
  Download,
  Video,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

export default function AspectRatioConverterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [ratio, setRatio] = useState("9:16");
  const [mode, setMode] = useState<"pad" | "crop">("pad");
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
    setResult(null);
    setError(null);
    setProgress(0);
    setRatio("9:16");
    setMode("pad");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("video/")) {
      setError("Please upload a valid video file.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const getVideoDimensions = (f: File): Promise<{ width: number; height: number }> => {
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

  const ratios = [
    { value: "16:9", label: "16:9", desc: "YouTube, TV" },
    { value: "9:16", label: "9:16", desc: "Reels, TikTok" },
    { value: "1:1", label: "1:1", desc: "Instagram" },
    { value: "4:3", label: "4:3", desc: "Classic" },
    { value: "21:9", label: "21:9", desc: "Ultrawide" },
    { value: "3:2", label: "3:2", desc: "Photos" },
  ];

  const handleConvert = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const { width: vw, height: vh } = await getVideoDimensions(file);
      const a = vw / vh;
      const [rw, rh] = ratio.split(":").map(Number);
      const R = rw / rh;

      const inputExt = file.name.substring(file.name.lastIndexOf(".")) || ".mp4";
      const inputName = "input" + inputExt;
      const outputName = "output" + inputExt;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const even = (n: number) => (n % 2 === 0 ? n : n + 1);
      let vf: string;

      if (Math.abs(a - R) < 0.001) {
        // Already matching ratio — just copy stream
        vf = "";
      } else if (mode === "pad") {
        if (a > R) {
          // Video is wider: keep width, increase height
          const outW = even(vw);
          const outH = even(Math.ceil(vw / R));
          const padY = Math.round((outH - vh) / 2);
          vf = `pad=${outW}:${outH}:0:${padY}:black`;
        } else {
          // Video is taller: keep height, increase width
          const outH = even(vh);
          const outW = even(Math.ceil(vh * R));
          const padX = Math.round((outW - vw) / 2);
          vf = `pad=${outW}:${outH}:${padX}:0:black`;
        }
      } else {
        // Crop mode
        if (a > R) {
          // Video is wider: crop width
          const cropW = even(Math.floor(vh * R));
          const cropH = even(vh);
          const x = Math.round((vw - cropW) / 2);
          vf = `crop=${cropW}:${cropH}:${x}:0`;
        } else {
          // Video is taller: crop height
          const cropW = even(vw);
          const cropH = even(Math.floor(vw / R));
          const y = Math.round((vh - cropH) / 2);
          vf = `crop=${cropW}:${cropH}:0:${y}`;
        }
      }

      const args = ["-i", inputName];
      if (vf) {
        args.push("-vf", vf);
      } else {
        args.push("-c:v", "copy");
      }
      args.push("-c:a", "copy", "-movflags", "+faststart", outputName);

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec(args);

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
      setError(err instanceof Error ? err.message : "Conversion failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  return (
    <ToolLayout toolId="aspect-ratio-converter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Target Ratio
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {ratios.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRatio(r.value)}
                      className={cn(
                        "p-2.5 rounded-xl border-2 transition-all text-center text-sm font-black",
                        ratio === r.value
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      {r.label}
                      <span className="text-[10px] opacity-70 block font-bold">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Fit Mode
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("pad")}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center text-sm font-black",
                      mode === "pad"
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "bg-card border-border hover:border-primary/20 text-foreground"
                    )}
                  >
                    Pad (black bars)
                  </button>
                  <button
                    onClick={() => setMode("crop")}
                    className={cn(
                      "p-3 rounded-xl border-2 transition-all text-center text-sm font-black",
                      mode === "crop"
                        ? "bg-primary border-primary text-primary-foreground shadow-md"
                        : "bg-card border-border hover:border-primary/20 text-foreground"
                    )}
                  >
                    Crop (fill)
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleConvert}
                  disabled={!file || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <ScanLine className="w-5 h-5 mr-2" />
                  Convert Ratio
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
              <Smartphone className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Social Ready</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Pad mode preserves all content with letterboxing. Crop mode fills the frame by cutting edges. Both keep original quality.
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
                  <p className="font-bold text-lg">Converting ratio...</p>
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
                  <p className="text-2xl font-black">Resized!</p>
                  <p className="text-sm text-muted-foreground">
                    {ratio} · {mode === "pad" ? "Padded" : "Cropped"} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      const base = file?.name.split(".")[0] || "video";
                      const ext = file?.name.substring(file.name.lastIndexOf(".")) || ".mp4";
                      a.download = `${base}_${ratio.replace(":", "x")}${ext}`;
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
