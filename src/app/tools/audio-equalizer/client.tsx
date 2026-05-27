"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  SlidersHorizontal,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Waves,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

interface EQSband {
  freq: number;
  gain: number;
  label: string;
}

export default function AudioEqualizer() {
  const [file, setFile] = useState<File | null>(null);
  const [bands, setBands] = useState<EQSband[]>([
    { freq: 100, gain: 0, label: "Sub" },
    { freq: 250, gain: 0, label: "Bass" },
    { freq: 500, gain: 0, label: "Low-Mid" },
    { freq: 1000, gain: 0, label: "Mid" },
    { freq: 2000, gain: 0, label: "High-Mid" },
    { freq: 4000, gain: 0, label: "Presence" },
    { freq: 8000, gain: 0, label: "Treble" },
    { freq: 16000, gain: 0, label: "Air" },
  ]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    size: number;
    time: number;
  } | null>(null);

  const { ffmpeg, loaded, fetchFile, setOnProgress } = useFFmpeg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setProgress(0);
    setBands([
      { freq: 100, gain: 0, label: "Sub" },
      { freq: 250, gain: 0, label: "Bass" },
      { freq: 500, gain: 0, label: "Low-Mid" },
      { freq: 1000, gain: 0, label: "Mid" },
      { freq: 2000, gain: 0, label: "High-Mid" },
      { freq: 4000, gain: 0, label: "Presence" },
      { freq: 8000, gain: 0, label: "Treble" },
      { freq: 16000, gain: 0, label: "Air" },
    ]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      setError("Please upload a valid audio file.");
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  };

  const updateBand = (index: number, gain: number) => {
    setBands((prev) => prev.map((b, i) => (i === index ? { ...b, gain } : b)));
  };

  const handleProcess = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const ext = file.name.substring(file.name.lastIndexOf(".")) || ".mp3";
      const inputName = "input" + ext;
      const outputName = "eq" + ext;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      // Build equalizer filter string
      const eqFilters = bands
        .filter((b) => b.gain !== 0)
        .map((b) => `equalizer=f=${b.freq}:width_type=o:width=1:g=${b.gain}`)
        .join(",");

      setOnProgress((p) => setProgress(p));
      if (eqFilters) {
        await ffmpeg.exec(["-i", inputName, "-af", eqFilters, outputName]);
      } else {
        // No changes, just copy
        await ffmpeg.exec(["-i", inputName, "-c", "copy", outputName]);
      }

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: file.type || "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);

      setResult({ url, size: blob.size, time: (performance.now() - start) / 1000 });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  const presets = [
    {
      name: "Vocal Boost",
      values: [0, -2, 2, 4, 3, 2, 1, 0],
    },
    {
      name: "Bass Boost",
      values: [6, 8, 4, 0, -2, -2, 0, 0],
    },
    {
      name: "Flat",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
    },
  ];

  return (
    <ToolLayout toolId="audio-equalizer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Quick Presets
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() =>
                        setBands((prev) =>
                          prev.map((b, i) => ({ ...b, gain: preset.values[i] || 0 }))
                        )
                      }
                      className="p-3 rounded-xl border-2 border-border bg-card hover:border-primary/20 text-xs font-black uppercase tracking-tight transition-all text-left"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleProcess}
                  disabled={!file || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Apply EQ
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
              <Waves className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">8-Band EQ</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Adjust each band independently. Positive values boost, negative values cut. All changes are applied with smooth octave-wide curves.
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
                accept="audio/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] || null)}
              />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Drop audio file here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </Card>
          )}

          {file && !result && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Music className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} · {file.type.split("/")[1]?.toUpperCase() || "AUDIO"}
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

          {file && !result && !processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {bands.map((band, i) => (
                    <div key={band.freq} className="flex flex-col items-center gap-2">
                      <div className="h-32 w-full flex items-end justify-center bg-muted rounded-xl p-1">
                        <input
                          type="range"
                          min={-12}
                          max={12}
                          step={1}
                          value={band.gain}
                          onChange={(e) => updateBand(i, parseInt(e.target.value))}
                          className="h-[120px] w-2 appearance-none cursor-pointer accent-primary"
                          style={{ writingMode: "vertical-lr" }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase tracking-wider",
                          band.gain !== 0 ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {band.gain > 0 ? "+" : ""}
                        {band.gain}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                        {band.label}
                      </span>
                      <span className="text-[8px] text-muted-foreground">{band.freq}Hz</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Applying EQ...</p>
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
                  <p className="text-2xl font-black">EQ Applied!</p>
                  <p className="text-sm text-muted-foreground">{result.time.toFixed(1)}s</p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      const base = file?.name.split(".")[0] || "audio";
                      const ext = file?.name.substring(file.name.lastIndexOf(".")) || ".mp3";
                      a.download = `${base}_eq${ext}`;
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
