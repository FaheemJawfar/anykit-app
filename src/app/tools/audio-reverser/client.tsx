"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Undo2,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Zap,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

export default function AudioReverser() {
  const [file, setFile] = useState<File | null>(null);
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

  const handleReverse = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const ext = file.name.substring(file.name.lastIndexOf(".")) || ".mp3";
      const inputName = "input" + ext;
      const outputName = "reversed" + ext;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec(["-i", inputName, "-af", "areverse", outputName]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: file.type || "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);

      setResult({ url, size: blob.size, time: (performance.now() - start) / 1000 });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reversal failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  return (
    <ToolLayout toolId="audio-reverser">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar */}
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Settings
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This tool reverses the temporal sequence of your audio samples. Perfect for creating sound effects or finding hidden messages.
                </p>
              </div>

              <div className="pt-6 border-t border-border/40 space-y-4">
                <Button
                  onClick={handleReverse}
                  disabled={!file || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Undo2 className="w-5 h-5 mr-2" />
                  Reverse Audio
                </Button>
                <Button
                  variant="ghost"
                  onClick={reset}
                  className="w-full rounded-xl font-bold h-10"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">How It Works</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Reversing audio reorders digital samples from last to first, playing time backwards without affecting pitch or quality.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-600">Privacy</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              All processing happens locally in your browser. Your audio never leaves your device.
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="lg:col-span-8 order-first flex flex-col gap-6">
          {!file && !result && (
            <Card
              className={cn(
                "border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden min-h-[320px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-primary/30 hover:shadow-primary/10",
                processing && "opacity-50 pointer-events-none"
              )}
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

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Reversing audio...</p>
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
                  <p className="text-2xl font-black">Reversed!</p>
                  <p className="text-sm text-muted-foreground">
                    {file?.name} · {formatFileSize(result.size)} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      const base = file?.name.split(".")[0] || "audio";
                      const ext = file?.name.substring(file.name.lastIndexOf(".")) || ".mp3";
                      a.download = `${base}_reversed${ext}`;
                      a.click();
                    }}
                    className="flex-1 h-14 rounded-2xl text-lg font-bold bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="h-14 rounded-2xl font-bold px-6"
                  >
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
