"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Split,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  RefreshCw,
  Clock,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize, formatTime } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

export default function AudioSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [segmentDuration, setSegmentDuration] = useState(60);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<
    { url: string; name: string; size: number }[]
  >([]);

  const { ffmpeg, loaded, fetchFile, setOnProgress } = useFFmpeg();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setResults([]);
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
    setResults([]);
  };

  const handleSplit = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResults([]);

    try {
      const ext = file.name.substring(file.name.lastIndexOf(".")) || ".mp3";
      const inputName = "input" + ext;
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setOnProgress((p) => setProgress(p));

      // Use segment muxer to split by duration
      const outputPattern = `segment_%03d${ext}`;
      await ffmpeg.exec([
        "-i",
        inputName,
        "-f",
        "segment",
        "-segment_time",
        segmentDuration.toString(),
        "-c",
        "copy",
        outputPattern,
      ]);

      // List output files
      const dir = await ffmpeg.listDir("/");
      const segmentFiles = dir
        .filter((f) => f.name.startsWith("segment_") && f.name.endsWith(ext))
        .sort((a, b) => a.name.localeCompare(b.name));

      const outs: { url: string; name: string; size: number }[] = [];
      for (const seg of segmentFiles) {
        const data = await ffmpeg.readFile(seg.name);
        const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
          type: file.type || "audio/mpeg",
        });
        outs.push({
          url: URL.createObjectURL(blob),
          name: seg.name,
          size: blob.size,
        });
        await ffmpeg.deleteFile(seg.name);
      }

      setResults(outs);
      await ffmpeg.deleteFile(inputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Split failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  const presets = [
    { value: 30, label: "30s" },
    { value: 60, label: "1m" },
    { value: 300, label: "5m" },
    { value: 600, label: "10m" },
  ];

  return (
    <ToolLayout toolId="audio-splitter">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Segment Duration
                </Label>
                <div className="text-center">
                  <span className="text-3xl font-black">{formatTime(segmentDuration)}</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={600}
                  step={10}
                  value={segmentDuration}
                  onChange={(e) => setSegmentDuration(parseInt(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setSegmentDuration(p.value)}
                      className={cn(
                        "p-2 rounded-xl border-2 text-[10px] font-black uppercase transition-all",
                        segmentDuration === p.value
                          ? "bg-primary border-primary text-primary-foreground shadow-md"
                          : "bg-card border-border hover:border-primary/20 text-foreground"
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleSplit}
                  disabled={!file || processing || !loaded}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Split className="w-5 h-5 mr-2" />
                  Split Audio
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
              <Clock className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">How It Works</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Splits are made at exact time boundaries without re-encoding, so each segment keeps the original quality.
            </p>
          </div>
        </div>

        <div className="lg:col-span-8 order-first flex flex-col gap-6">
          {!file && results.length === 0 && (
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

          {file && results.length === 0 && (
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
                  <p className="font-bold text-lg">Splitting...</p>
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

          {results.length > 0 && (
            <div className="space-y-4">
              <Card className="border-emerald-500/30 shadow-2xl shadow-emerald-500/10 bg-gradient-to-br from-emerald-500/10 to-primary/5 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-10 flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-2xl font-black">Split Complete!</p>
                    <p className="text-sm text-muted-foreground">{results.length} segments created</p>
                  </div>
                  <Button variant="outline" onClick={reset} className="h-12 rounded-2xl font-bold px-6">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Split Another
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                {results.map((r, i) => (
                  <Card
                    key={r.name}
                    className="border-border/40 bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">Segment {i + 1}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                          {formatFileSize(r.size)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          const a = document.createElement("a");
                          a.href = r.url;
                          a.download = r.name;
                          a.click();
                        }}
                        className="rounded-xl h-9"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        DL
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
