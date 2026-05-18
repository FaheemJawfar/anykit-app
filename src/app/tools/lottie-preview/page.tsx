"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2,
  Zap,
  Info,
  FileUp,
  FileCode,
  Settings2,
  Maximize2,
  Download,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Lottie from "lottie-react";

export default function LottiePreviewer() {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isPlaying, setIsRunning] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lottieRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setError("Please upload a valid JSON Lottie file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.v || !json.layers) {
          throw new Error("Invalid Lottie JSON structure.");
        }
        setAnimationData(json);
      } catch (err: any) {
        setError(err.message || "Failed to parse Lottie JSON.");
      }
    };
    reader.readAsText(file);
  };

  const clear = () => {
    setAnimationData(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
          <Play className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight">Lottie Previewer</h1>
          <p className="text-sm text-muted-foreground">
            Visual zone for testing and inspecting Lottie (JSON) animations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Side */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border/40 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-6">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) processFile(file);
                  }}
                  className={cn(
                    "relative group h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer",
                    animationData ? "border-primary bg-primary/5 shadow-inner" : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".json,application/json" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <FileUp className="w-8 h-8" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-bold text-sm">{animationData ? "Change Animation" : "Drop Lottie JSON"}</h3>
                    <p className="text-[10px] text-muted-foreground mt-1 px-4">Click or drag a .json file to preview</p>
                  </div>
                </div>

                {animationData && (
                  <div className="pt-4 border-t border-border/40 grid grid-cols-2 gap-4">
                    <Button 
                      variant={isPlaying ? "outline" : "default"} 
                      onClick={() => setIsRunning(!isPlaying)}
                      className="rounded-xl h-12 font-bold uppercase text-[10px]"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 mr-2" /> : <Play className="w-3.5 h-3.5 mr-2" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={clear}
                      className="rounded-xl h-12 font-bold uppercase text-[10px] text-destructive hover:bg-destructive/5"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-2" />
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Pro Tip</h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed italic">
              Lottie animations are vector-based and highly performant. Use this previewer to verify timing and layering before exporting to your app.
            </p>
          </div>
        </div>

        {/* Viewport Side */}
        <div className="lg:col-span-8">
          <Card className="border-border/40 shadow-2xl shadow-primary/5 bg-card/40 backdrop-blur-sm rounded-[3rem] overflow-hidden flex flex-col relative aspect-square md:aspect-video bg-muted/20 group min-h-[400px]">
            <div className="absolute top-8 right-8 z-10">
              <div className="px-4 py-2 rounded-full bg-white/80 dark:bg-black/80 text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md border border-border/20">
                Visual Canvas
              </div>
            </div>

            <CardContent className="flex-1 flex items-center justify-center p-12 overflow-hidden">
              {animationData ? (
                <div className="w-full h-full max-w-lg">
                  <Lottie 
                    lottieRef={lottieRef}
                    animationData={animationData} 
                    loop={true} 
                    autoplay={isPlaying}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 opacity-30 text-center max-w-sm animate-in fade-in duration-700">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Play className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Waiting for Animation</h3>
                    <p className="text-sm font-medium">Upload a Lottie JSON file to see the magic happen.</p>
                  </div>
                </div>
              )}
            </CardContent>

            {animationData && (
              <div className="px-8 py-4 bg-muted/30 border-t border-border/40 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Version</span>
                    <span className="text-xs font-mono font-bold text-primary">{animationData.v}</span>
                  </div>
                  <div className="w-px h-6 bg-border/40" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Size</span>
                    <span className="text-xs font-mono font-bold text-primary">{animationData.w}x{animationData.h}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3 h-3 text-primary animate-pulse" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Rendering Locally</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
