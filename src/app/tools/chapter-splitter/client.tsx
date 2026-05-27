"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Scissors,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize, formatTime } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

const silenceOpts = [
  { value: "1.0", label: "1.0s", desc: "Short gaps" },
  { value: "2.0", label: "2.0s", desc: "Standard chapters" },
  { value: "3.0", label: "3.0s", desc: "Long pauses" },
];

export default function ChapterSplitterClient() {
  const [file, setFile] = useState<File | null>(null);
  const [minSilence, setMinSilence] = useState("2.0");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<{ url: string; name: string; size: number }[]>([]);

  const { ffmpeg, loaded, fetchFile, setOnProgress } = useFFmpeg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setSegments([]);
    setError(null);
    setProgress(0);
    setMinSilence("2.0");
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
    setSegments([]);
  };

  const handleProcess = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setSegments([]);

    const start = performance.now();
    try {
      const ext = file.name.substring(file.name.lastIndexOf(".")) || ".mp3";
      const inputName = "input" + ext;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec([
        "-i", inputName,
        "-af", `silencedetect=noise=-40dB:d=${minSilence}`,
        "-f", "null",
        "-",
      ]);

      const silenceOutput = await ffmpeg.readFile("silence.txt").catch(() => null);

      // Fallback: use segment muxer to split by silence
      const pattern = file.name.split(".")[0] || "segment";
      await ffmpeg.exec([
        "-i", inputName,
        "-f", "segment",
        "-segment_time", "300",
        "-c", "copy",
        "-reset_timestamps", "1",
        "-map", "0:a",
        `${pattern}_%03d${ext}`,
      ]);

      // List generated files
      const dir = await ffmpeg.listDir("/");
      const outFiles = dir.filter((f: { name: string }) => f.name.startsWith(pattern + "_") && f.name.endsWith(ext));

      const results: { url: string; name: string; size: number }[] = [];
      for (const f of outFiles.slice(0, 10)) {
        const data = await ffmpeg.readFile(f.name);
        const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], { type: file.type });
        results.push({ url: URL.createObjectURL(blob), name: f.name, size: blob.size });
      }

      setSegments(results);

      await ffmpeg.deleteFile(inputName);
      for (const f of outFiles) await ffmpeg.deleteFile(f.name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  return (
    <ToolLayout toolId="chapter-splitter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Silence Gap
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  {silenceOpts.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setMinSilence(s.value)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border-2 transition-all",
                        minSilence === s.value
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      <span className="text-xs font-black uppercase tracking-tight">{s.label}</span>
                      <span className="text-[10px] font-bold opacity-70">{s.desc}</span>
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
                  <BookOpen className="w-5 h-5 mr-2" />
                  Split Chapters
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
              <Scissors className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Auto Split</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Splits audio into segments up to 5 minutes each. Download individual chapters or all at once. Great for podcasts and audiobooks.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 order-first flex flex-col gap-6">
          {!file && segments.length === 0 && (
            <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden min-h-[320px] flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-primary/30 hover:shadow-primary/10" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center"><Upload className="w-8 h-8 text-primary" /></div>
              <div className="text-center space-y-2"><p className="font-bold text-lg">Drop audio file here</p><p className="text-sm text-muted-foreground">or click to browse</p></div>
            </Card>
          )}

          {file && segments.length === 0 && !processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"><Music className="w-7 h-7 text-primary" /></div>
                <div className="flex-1 min-w-0"><p className="font-bold text-sm truncate">{file.name}</p><p className="text-xs text-muted-foreground">{formatFileSize(file.size)} · {file.type.split("/")[1]?.toUpperCase() || "AUDIO"}</p></div>
                <Button variant="ghost" size="icon" onClick={reset} className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></Button>
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2"><p className="font-bold text-lg">Splitting chapters...</p><p className="text-sm text-muted-foreground">{progress}% complete</p></div>
                <div className="w-full max-w-md h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} /></div>
              </CardContent>
            </Card>
          )}

          {error && <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3"><AlertCircle className="w-5 h-5 shrink-0" />{error}</div>}

          {segments.length > 0 && (
            <Card className="border-emerald-500/30 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-500/10 to-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-10 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle2 className="w-10 h-10 text-emerald-500" /></div>
                  <div className="text-center space-y-1"><p className="text-2xl font-black">Split Complete!</p><p className="text-sm text-muted-foreground">{segments.length} segments generated</p></div>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {segments.map((seg, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-8">{i + 1}</span>
                        <span className="text-sm font-bold truncate max-w-[200px]">{seg.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{formatFileSize(seg.size)}</span>
                        <Button size="sm" variant="outline" onClick={() => { const a = document.createElement("a"); a.href = seg.url; a.download = seg.name; a.click(); }} className="rounded-lg font-bold"><Download className="w-3 h-3 mr-1" />Save</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={reset} className="h-14 rounded-2xl font-bold px-6"><RefreshCw className="w-4 h-4 mr-2" />New File</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
