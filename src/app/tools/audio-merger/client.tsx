"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  GitMerge,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Disc,
  RefreshCw,
  GripVertical,
  Plus,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize, mimeMap, codecMap } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

const formats = [
  { value: "mp3", label: "MP3", desc: "Universal" },
  { value: "wav", label: "WAV", desc: "Lossless" },
  { value: "aac", label: "AAC", desc: "Apple" },
  { value: "flac", label: "FLAC", desc: "Studio" },
  { value: "ogg", label: "OGG", desc: "Open Source" },
];

export default function AudioMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState("mp3");
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
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("audio/"));
    if (valid.length < incoming.length) {
      setError("Some non-audio files were skipped.");
    }
    if (valid.length > 0) {
      setFiles((prev) => [...prev, ...valid]);
      setResult(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    const newFiles = [...files];
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2 || !ffmpeg || !loaded) {
      setError("Please add at least 2 audio files.");
      return;
    }
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const inputNames: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const ext = files[i].name.substring(files[i].name.lastIndexOf(".")) || ".mp3";
        const name = `input_${i}${ext}`;
        await ffmpeg.writeFile(name, await fetchFile(files[i]));
        inputNames.push(name);
      }

      const outputName = `merged.${format}`;
      const inputArgs: string[] = [];
      inputNames.forEach((n) => {
        inputArgs.push("-i", n);
      });

      const codecArgs = codecMap[format] || codecMap["mp3"];
      const filterComplex =
        inputNames.map((_, i) => `[${i}:a]`).join("") +
        `concat=n=${inputNames.length}:v=0:a=1[out]`;

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec([
        ...inputArgs,
        "-filter_complex",
        filterComplex,
        "-map",
        "[out]",
        ...codecArgs,
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: mimeMap[format] || "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);

      setResult({ url, size: blob.size, time: (performance.now() - start) / 1000 });

      for (const n of inputNames) await ffmpeg.deleteFile(n);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merge failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <ToolLayout toolId="audio-merger">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Output Format
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFormat(f.value)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                        format === f.value
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Disc className="w-4 h-4" />
                        <span className="text-xs font-black uppercase tracking-tight">{f.label}</span>
                      </div>
                      <span className="text-[10px] font-bold opacity-70">{f.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleMerge}
                  disabled={files.length < 2 || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <GitMerge className="w-5 h-5 mr-2" />
                  Merge {files.length} Tracks
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full rounded-xl font-bold h-10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 order-first flex flex-col gap-6">
          {files.length === 0 && !result && (
            <Card
              className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden min-h-[320px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-primary/30 hover:shadow-primary/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Drop audio files here</p>
                <p className="text-sm text-muted-foreground">or click to browse — add multiple tracks</p>
              </div>
            </Card>
          )}

          {error && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {files.length > 0 && !result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Your Tracks</p>
                <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {formatFileSize(totalSize)} Total
                </span>
              </div>

              <div className="space-y-2">
                {files.map((f, i) => (
                  <Card
                    key={`${f.name}-${i}`}
                    className="border-border/40 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{f.name}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          {formatFileSize(f.size)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={i === 0}
                          onClick={() => moveFile(i, -1)}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={i === files.length - 1}
                          onClick={() => moveFile(i, 1)}
                          className="h-8 w-8 p-0 rounded-lg"
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(i)}
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-12 rounded-2xl border-dashed border-2 font-bold text-xs uppercase tracking-wider"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Tracks
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Merging audio...</p>
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

          {result && (
            <Card className="border-emerald-500/30 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-500/10 to-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 flex flex-col items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-2xl font-black">Merged!</p>
                  <p className="text-sm text-muted-foreground">
                    {files.length} tracks → {format.toUpperCase()} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      a.download = `merged_audio.${format}`;
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
