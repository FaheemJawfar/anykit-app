"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Camera, 
  Video, 
  Monitor, 
  Download, 
  Trash2, 
  Play, 
  Square, 
  Zap, 
  Info,
  RefreshCw,
  VideoOff,
  Mic,
  MicOff
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CameraRecorder() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mode, setMode] = useState<"camera" | "screen">("camera");
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startStream = async () => {
    setError(null);
    try {
      let newStream;
      if (mode === "camera") {
        newStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
      } else {
        newStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
        });
      }
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      setError(err.message || "Failed to access media device.");
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!stream) return;
    setRecording(true);
    chunksRef.current = [];
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setRecordedBlob(blob);
    };

    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const downloadVideo = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => stopStream();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Camera className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Camera & Screen Recorder</h1>
          <p className="text-sm text-muted-foreground">
            Record high-quality video from your camera or screen directly in the browser.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Recording Mode</Label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-muted/50 rounded-xl border border-border/40">
                    <Button
                      variant={mode === "camera" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => { setMode("camera"); stopStream(); }}
                      className={cn("rounded-lg font-bold h-10 uppercase text-[10px]", mode === "camera" && "shadow-md")}
                    >
                      <Video className="w-3.5 h-3.5 mr-2" />
                      Camera
                    </Button>
                    <Button
                      variant={mode === "screen" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => { setMode("screen"); stopStream(); }}
                      className={cn("rounded-lg font-bold h-10 uppercase text-[10px]", mode === "screen" && "shadow-md")}
                    >
                      <Monitor className="w-3.5 h-3.5 mr-2" />
                      Screen
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 space-y-4">
                  {!stream ? (
                    <Button 
                      onClick={startStream}
                      className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Enable {mode === "camera" ? "Camera" : "Screen"}
                    </Button>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {!recording ? (
                        <Button 
                          onClick={startRecording}
                          className="w-full h-14 rounded-2xl text-lg font-bold bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20 transition-all active:scale-[0.98]"
                        >
                          <Play className="w-5 h-5 mr-2 fill-white" />
                          Start Recording
                        </Button>
                      ) : (
                        <Button 
                          onClick={stopRecording}
                          className="w-full h-14 rounded-2xl text-lg font-bold bg-foreground text-background hover:opacity-90 shadow-lg transition-all animate-pulse"
                        >
                          <Square className="w-5 h-5 mr-2 fill-current" />
                          Stop Recording
                        </Button>
                      )}
                      <Button variant="ghost" onClick={stopStream} className="rounded-xl font-bold h-10">
                        <VideoOff className="w-4 h-4 mr-2" />
                        Turn Off
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Recording Info</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Recordings are processed 100% locally in your browser. Video is saved as <strong>WebM</strong> format which is optimized for web playback and small file sizes.
            </p>
          </div>
        </div>

        {/* Viewport Side */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col relative aspect-video bg-black/95 group">
            {!stream && !recordedBlob && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-muted-foreground/30">
                <VideoOff className="w-20 h-20" />
                <p className="font-bold text-sm uppercase tracking-widest">Feed Disabled</p>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={cn(
                "w-full h-full object-cover",
                !stream && "hidden"
              )}
            />

            {recordedBlob && !stream && (
              <video 
                src={URL.createObjectURL(recordedBlob)} 
                controls 
                className="w-full h-full object-cover"
              />
            )}

            {recording && (
              <div className="absolute top-8 left-8 flex items-center gap-3 bg-destructive px-4 py-2 rounded-full shadow-xl animate-bounce">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-white text-[10px] font-black uppercase tracking-widest">Recording</span>
              </div>
            )}
          </Card>

          {recordedBlob && (
            <div className="flex gap-4 animate-in slide-in-from-bottom-4">
              <Button 
                onClick={downloadVideo}
                className="flex-1 h-14 rounded-2xl text-lg font-bold bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Recording
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRecordedBlob(null)}
                className="w-14 h-14 rounded-2xl border-border/40 text-destructive hover:bg-destructive/5"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
