"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Scissors,
  Upload,
  Download,
  Music,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Play,
  Pause,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useFFmpeg } from "@/hooks/use-ffmpeg";
import { formatFileSize, formatTime } from "@/lib/audio-utils";
import { cn } from "@/lib/utils";

export default function AudioTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
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
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const reset = () => {
    setFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    setCurrentTime(0);
    setStartTime(0);
    setEndTime(0);
    setIsPlaying(false);
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
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(f);
    setAudioUrl(URL.createObjectURL(f));
    setError(null);
    setResult(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      const d = audioRef.current.duration;
      setDuration(d);
      setEndTime(d);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const t = audioRef.current.currentTime;
      setCurrentTime(t);
      if (t >= endTime) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !file) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.currentTime >= endTime || audioRef.current.currentTime < startTime) {
        audioRef.current.currentTime = startTime;
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTrim = async () => {
    if (!file || !ffmpeg || !loaded) return;
    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    const start = performance.now();
    try {
      const ext = file.name.substring(file.name.lastIndexOf(".")) || ".mp3";
      const inputName = "input" + ext;
      const outputName = "trimmed" + ext;

      await ffmpeg.writeFile(inputName, await fetchFile(file));

      setOnProgress((p) => setProgress(p));
      await ffmpeg.exec([
        "-i",
        inputName,
        "-ss",
        startTime.toString(),
        "-t",
        (endTime - startTime).toString(),
        "-c",
        "copy",
        outputName,
      ]);

      const data = await ffmpeg.readFile(outputName);
      const blob = new Blob([new Uint8Array(data as unknown as ArrayBuffer)], {
        type: file.type || "audio/mpeg",
      });
      const url = URL.createObjectURL(blob);

      setResult({ url, size: blob.size, time: (performance.now() - start) / 1000 });

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile(outputName);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Trim failed");
    } finally {
      setProcessing(false);
      setOnProgress(null);
    }
  };

  const timelinePercent = (t: number) => (duration > 0 ? (t / duration) * 100 : 0);

  return (
    <ToolLayout toolId="audio-trimmer">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 order-last space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Start Point
                    </Label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {formatTime(startTime)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={startTime}
                    disabled={!duration}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setStartTime(Math.min(v, endTime - 0.1));
                      if (audioRef.current) audioRef.current.currentTime = v;
                    }}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      End Point
                    </Label>
                    <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {formatTime(endTime)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={endTime}
                    disabled={!duration}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setEndTime(Math.max(v, startTime + 0.1));
                      if (audioRef.current) audioRef.current.currentTime = v;
                    }}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!duration}
                    onClick={() => {
                      setStartTime(0);
                      setEndTime(duration / 2);
                    }}
                    className="rounded-xl text-[10px] font-black uppercase tracking-wider h-9"
                  >
                    First Half
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!duration}
                    onClick={() => {
                      setStartTime(duration / 2);
                      setEndTime(duration);
                    }}
                    className="rounded-xl text-[10px] font-black uppercase tracking-wider h-9"
                  >
                    Second Half
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-3">
                <Button
                  onClick={handleTrim}
                  disabled={!file || processing || !loaded || !duration}
                  className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Scissors className="w-5 h-5 mr-2" />
                  Trim Audio
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
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Precision</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Trimming without re-encoding preserves original quality. The cut is sample-accurate and metadata is retained.
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

          {error && (
            <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {file && !result && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} · {formatTime(duration)}
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
                </div>

                <audio
                  ref={audioRef}
                  src={audioUrl || ""}
                  onLoadedMetadata={onLoadedMetadata}
                  onTimeUpdate={onTimeUpdate}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-6">
                  <button
                    onClick={togglePlay}
                    className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-2" />}
                  </button>
                  <div className="text-center space-y-1">
                    <p className="text-3xl font-black font-mono tracking-tighter">{formatTime(currentTime)}</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Current Position
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="relative h-16 flex items-center">
                  <div className="absolute inset-0 bg-muted rounded-2xl" />
                  <div
                    className="absolute h-10 bg-primary/20 border-x-2 border-primary rounded-lg pointer-events-none"
                    style={{
                      left: `${timelinePercent(startTime)}%`,
                      width: `${timelinePercent(endTime) - timelinePercent(startTime)}%`,
                    }}
                  />
                  <div
                    className="absolute h-14 w-0.5 bg-pink-500 z-10"
                    style={{ left: `${timelinePercent(currentTime)}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.01}
                    value={currentTime}
                    disabled={!duration}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (audioRef.current) audioRef.current.currentTime = v;
                      setCurrentTime(v);
                    }}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer z-20"
                  />
                  <div className="absolute -bottom-5 w-full flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>0:00</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-2xl flex flex-col gap-1 items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Original</p>
                    <p className="text-sm font-black">{formatTime(duration)}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-2xl flex flex-col gap-1 items-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Trimmed</p>
                    <p className="text-sm font-black text-primary">{formatTime(endTime - startTime)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {processing && (
            <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
              <CardContent className="p-12 flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="text-center space-y-2">
                  <p className="font-bold text-lg">Trimming...</p>
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
                  <p className="text-2xl font-black">Trimmed!</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(startTime)} → {formatTime(endTime)} · {formatTime(endTime - startTime)} · {result.time.toFixed(1)}s
                  </p>
                </div>
                <div className="flex gap-3 w-full max-w-md">
                  <Button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = result.url;
                      const base = file?.name.split(".")[0] || "audio";
                      const ext = file?.name.substring(file.name.lastIndexOf(".")) || ".mp3";
                      a.download = `${base}_trimmed${ext}`;
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
