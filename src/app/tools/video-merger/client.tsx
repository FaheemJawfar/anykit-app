"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Layers,
  Upload,
  Download,
  Video,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Zap,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

interface VideoFile {
  id: string;
  file: File;
}

export default function VideoMergerClient() {
  const [files, setFiles] = useState<VideoFile[]>([]);
  const [format, setFormat] = useState("mp4");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    url: string;
    totalSize: number;
    mergedSize: number;
    time: number;
  } | null>(null);

  const { ffmpeg, loaded, fetchFile, setOnProgress } = useFFmpeg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setFormat("mp4");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError(null);
    const added: VideoFile[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const f = newFiles[i];
      if (!f.type.startsWith("video/")) {
        setError(`"${f.name}" is not a valid video file.`);
        continue;
      }
      added.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 9)}`,
        file: f,
      });
    }
    setFiles((prev) => [...prev, ...added]);
    setResult(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...files];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setFiles(next);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const next = [...files];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setFiles(next);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2 || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    const inputNames: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i].file;
        const ext = f.name.substring(f.name.lastIndexOf(".")) || ".mp4";
        const name = `input_${i}${ext}`;
        inputNames.push(name);
        await ffmpeg.writeFile(name, await fetchFile(f));
      }

      const outputName = `merged.${format}`;

      const filterInputs = inputNames.map((_, i) => `[${i}:v:0][${i}:a:0]`).join("");
      const filterComplex = `${filterInputs}concat=n=${inputNames.length}:v=1:a=1[outv][outa]`;

      const formatCodecs: Record<string, { vcodec: string; acodec: string; extra: string[] }> = {
        mp4: { vcodec: "libx264", acodec: "aac", extra: ["-preset", "ultrafast", "-crf", "26"] },
        mkv: { vcodec: "libx264", acodec: "aac", extra: ["-preset", "ultrafast", "-crf", "26"] },
        mov: { vcodec: "libx264", acodec: "aac", extra: ["-preset", "ultrafast", "-crf", "26"] },
        avi: { vcodec: "libx264", acodec: "aac", extra: ["-preset", "ultrafast", "-crf", "26"] },
        webm: { vcodec: "libvpx", acodec: "libvorbis", extra: ["-crf", "10", "-b:v", "1M", "-cpu-used", "4"] },
        wmv: { vcodec: "wmv2", acodec: "wmav2", extra: ["-q:v", "6"] },
      };

      const codec = formatCodecs[format] || formatCodecs.mp4;

      const args: string[] = [];
      for (const name of inputNames) {
        args.push("-i", name);
      }
      args.push(
        "-filter_complex", filterComplex,
        "-map", "[outv]",
        "-map", "[outa]",
        "-c:v", codec.vcodec,
        ...codec.extra,
        "-c:a", codec.acodec,
        outputName
      );

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec(args);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: `video/${format}`,
      });
      const url = URL.createObjectURL(blob);

      const totalSize = files.reduce((sum, f) => sum + f.file.size, 0);

      setResult({
        url,
        totalSize,
        mergedSize: blob.size,
        time: (performance.now() - start) / 1000,
      });

      for (const name of inputNames) {
        await ffmpeg.deleteFile(name);
      }
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Merging failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  const formats = [
    { id: "mp4", label: "MP4" },
    { id: "avi", label: "AVI" },
    { id: "mov", label: "MOV" },
    { id: "webm", label: "WebM" },
  ];

  return (
    <ToolLayout toolId="video-merger">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Output Format
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {formats.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFormat(f.id)}
                      className={cn(
                        "p-2.5 rounded-xl border-2 transition-all text-center text-sm font-black uppercase",
                        format === f.id
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      {f.label}
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
                  <Layers className="w-5 h-5 mr-2" />
                  Merge Videos
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full rounded-xl font-bold h-10">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Merge Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Use similar formats for best results. Videos are concatenated in the order shown. Max 1GB total.
            </p>
          </div>
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
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-bold text-lg">Drop video files here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </Card>
          )}

          {files.length > 0 && !result && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-6 space-y-3">
                {files.map((vf, index) => (
                  <div
                    key={vf.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border/40"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{vf.file.name}</p>
                      <p className="text-[10px] text-muted-foreground">{formatFileSize(vf.file.size)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-all"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === files.length - 1}
                        className="p-1.5 rounded-lg hover:bg-muted disabled:opacity-30 transition-all"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeFile(vf.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl font-bold h-10 border border-dashed border-border"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Add More Videos
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Merging videos...</p>
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
                  <p className="text-2xl font-black">Merged!</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(result.totalSize)} → {formatFileSize(result.mergedSize)} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      a.download = `merged.${format}`;
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
